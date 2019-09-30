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
from sqlalchemy.orm import sessionmaker

from bs4 import BeautifulSoup
import bs4.element

from email_trainer.secrets import PASSWORD
from email_trainer.models import Body, Header, Zoneannotation, Zonetype

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
    definitions:
      Annotations:
        type: array
        items:
          $ref: '#/definitions/AnnotationName
      AnnotationName:
        type: string
        description: Annotation Name
        default: "Signature Content"
    responses:
      200:
        description: A list of annotation names
        schema:
          $ref: '#/definitions/Annotations'
        examples:
          ['Signature Content', 'Author Content']
    """
    session = Session()
    annotation_names = list(chain(*session.query(Zonetype.name).all()))
    return jsonify(annotation_names)


@app.route('/emails')
def emails():
    """Endpoint returning a list of email hashes
    ---
    definitions:
      Emails:
        type: array
        items:
          $ref: '#/definitions/EmailId
      EmailId:
        type: string
        description: Id of training mail
        default: e3784d58de4458deb228303590605d82
    responses:
      200:
        description: A list of emails
        schema:
          $ref: '#/definitions/Emails'
        examples:
          ['e3784d58de4458deb228303590605d82', '2eef2b4d6c7fa0659231668defadc107']
    """
    return jsonify(MAILS)


@app.route("/emails/<email_hash>")
def email_lines(email_hash):
    """Endpoint returning a list of email hashes
    ---
    parameters:
      - name: email_hash
        in: path
        type: string
        required: true
        examples: e3784d58de4458deb228303590605d82
    definitions:
      EmailLines:
        type: array
        items:
          $ref: '#/definitions/EmailId
      EmailLine:
        type: string
        description: Line of email
        examples: Dear Sir/Madam
    responses:
      200:
        description: A list of emails
        schema:
          $ref: '#/definitions/Emails'
        examples:
          ['e3784d58de4458deb228303590605d82', '2eef2b4d6c7fa0659231668defadc107']
    """
    eml = []
    session = Session()
    for header in session.query(Header).filter_by(messageid=email_hash).all():
      eml.append(header.headername + ": " + header.headervalue)

    lines_annotated = []
    for zoneannotation in session.query(Zoneannotation).filter_by(messageid=email_hash).all():
      eml.append(zoneannotation.zoneline.linetext)
      lines_annotated.append({
        "annotation": zoneannotation.zonetype.name, 
        "linetext": zoneannotation.zoneline.linetext
      })
    eml = "\n".join(eml)
    message = email.message_from_string(eml, policy=email.policy.default)
    payload = _extract_payload(message)
    payload = payload.replace("\r", "").split("\n")
    return jsonify(lines_annotated)


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
