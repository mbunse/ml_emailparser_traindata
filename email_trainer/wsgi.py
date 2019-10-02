import email
import email.policy
from quopri import decodestring
import glob
import os
from itertools import chain

from flask import Flask, jsonify, abort, render_template
from flask_cors import CORS
from flasgger import Swagger
from werkzeug.exceptions import HTTPException

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, joinedload, load_only

from bs4 import BeautifulSoup
import bs4.element

from email_trainer.secrets import PASSWORD
from email_trainer.models import Body, Header, Zoneannotation, Zonetype, Zoneline

app = Flask(__name__,
  template_folder="templates/",
  static_folder="static/"
  )

CORS(app)
swagger = Swagger(app)

engine = create_engine("mysql+mysqlconnector://emailparser_dev:" + PASSWORD + "@localhost/zonerelease",
  encoding='latin1', echo=True)
Session = sessionmaker(bind=engine)

def getMails():
  """ Get message ids for annotated mails from database
  
  Returns
  -------
  list of string
      List of message ids
  """

  session = Session()
  mails = []
  for messageid, in session.query(Zoneannotation.messageid).group_by(Zoneannotation.messageid)[1:20]:
    mails.append(messageid)
  return mails

MAILS = getMails()

@app.route('/annotations')
def annotations():
    """Endpoint returning a list of email hashes
    ---
    responses:
      200:
        description: A list of annotation names
        schema:
          type: array
          items:
            type: string
        example: ['Signature Content', 'Author Content']
    """
    session = Session()
    annotation_names = list(chain(*session.query(Zonetype.name).all()))
    return jsonify(annotation_names)


@app.route('/emails')
def emails():
    """Endpoint returning a list of email hashes
    ---
    responses:
      200:
        description: A list of emails
        schema:
          type: array
          items:
            type: string
            example: '27321'
          example: 
            - '27321'
    """
    return jsonify(MAILS)


@app.route("/emails/<email_hash>", methods=['GET'])
def email_lines(email_hash):
    """Endpoint returning a list of email hashes
    ---
    parameters:
      - name: email_hash
        in: path
        required: true
        schema:
          type: string
        example: '27321'
        default: '27321'
    responses:
      200:
        description: A list of emails
        schema:
          type: array
          items:
            type: string
          example: ['Dear Sir/Madam', '']
    """
    eml = []
    session = Session()
    for header in session.query(Header).filter_by(messageid=email_hash).all():
      eml.append(header.headername + ": " + header.headervalue)

    lines_annotated = []
    for zoneline in (
      session.query(Zoneline)
        .options(
          load_only("messageid", "linetext", "lineorder", "id"),
          joinedload(Zoneline.zoneannotation)
            .subqueryload(Zoneannotation.zonetype)
        )
        .filter_by(messageid=email_hash)
        .order_by(Zoneline.lineorder)
        .all()):
      eml.append(zoneline.linetext)
      lines_annotated.append({
        "annotation": zoneline.zoneannotation.zonetype.name, 
        "annvalue": zoneline.zoneannotation.zonetype.id, 
        "linetext": zoneline.linetext,
        "lineorder": zoneline.lineorder,
        "lineid": zoneline.id,
      })
    eml = "\n".join(eml)
    message = email.message_from_string(eml, policy=email.policy.default)
    payload = _extract_payload(message)
    payload = payload.replace("\r", "").split("\n")
    return jsonify(lines_annotated)

@app.route('/emails/<email_hash>', methods=['POST'])
def update_email_line(email_hash):
    """Endpoint updating a list of email hashes
    ---
    parameters:
    - name: email_hash
      in: path
      required: true
      schema:
        type: string
      example: '27321'
      default: '27321'
    - name: Annotations
      in: body
      required: true
      schema:
        type: array
        items:
          type: string
        example:
          - 'Dear Sir/Madam'
          - ''
    responses:
      200:
        description: update OK
    """
    return "OK", 200

def _extract_payload(email_message):
  """Function to extract text content from
  
  :param email_message: email message to extract content from
  :type email_message: email.message.EmailMessage

  :return: content fo email

  :rtype: str
  """
  relevant_content_types = ["text/plain", "text/html"]
  content = ""
  if email_message.is_multipart():
    parts = email_message.get_payload()

    # handle alternative parts, e.g. html and text
    # if text/plain is available, than only use this
    if email_message.get_content_subtype == "alternative":
      content_types = [part.get_content_type() for part in parts if part.get_content_type() in relevant_content_types]
      if "text/plain" in content_types:
        content = content + _extract_payload(parts[content_types.index("text/plain")])
    else:
      # iterate through parts
      for part in parts:
        content = content + _extract_payload(part)
        
  elif email_message.get_content_type() in relevant_content_types:
    payload = email_message.get_payload(decode=True)\
      .decode(encoding=email_message.get_content_charset(), errors="replace")
    if email_message.get_content_type() == "text/html":
      soup = BeautifulSoup(payload, 'html.parser').find("body")
      if soup == None:
        soup = BeautifulSoup(payload, 'html.parser')
      content = content + soup.get_text(separator="\n")
    else: 
      content = content + payload
  return content

@app.route("/")
def index():
  return render_template("index.html")

if __name__ == "__main__":
  app.run(debug=True)
