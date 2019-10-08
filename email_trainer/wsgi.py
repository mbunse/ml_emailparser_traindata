import email
import email.policy
from quopri import decodestring
import glob
import os
from itertools import chain

from flask import Flask, jsonify, abort, render_template, request
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
            type: object
            properties:
              id:
                type: integer
                example: 1
              name:
                type: string
                example: "Signature Content"
          example: 
            - id: 1
              name: 'Signature Content'
            - id: 2
              name: 'Author Content'
    """
    session = Session()
    annotation_names = []
    for annotation_name in (session.query(Zonetype)
                            .options(
                              load_only("id", "name") 
                            )
                            .all()):
      annotation_names.append({
        "id": annotation_name.id,
        "name": annotation_name.name,
      })

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
          type: object
          properties:
            messageid:
              type: integer
            iszoneline:
              type: boolean
            hasannotation:
              type: boolean
            subject:
              type: string
            from:
              type: string
            to:
              type: string
            date:
              type: string
        example: 
          - messageid: 27321
            iszoneline: true
            hasannotation: true
            subject: 'Test'
            from: 'email@test.com'
            to: 'another_email@test.com'
            date: '2012-12-23 04:02:21'
  """
  session = Session()
  mails = []
  for body in (session.query(Body)
    .options(
      load_only(
        "messageid",
        ),
      joinedload(Body.subject_header),
      joinedload(Body.date_header),
      joinedload(Body.from_header),
      joinedload(Body.to_header),
      joinedload(Body.zoneannotations),
      joinedload(Body.zonelines),
    )
    .group_by(Body.messageid).limit(20)):
    mails.append({
      "messageid": body.messageid,
      "iszoneline": len(body.zonelines) > 0,
      "hasannotation": len(body.zoneannotations) > 0,
      "subject": body.subject,
      "from": body.from_,
      "to": body.to_,
      "date": body.date,
    })
  return jsonify(mails)


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
    definitions:
      Annotation:
        type: object
        properties:
          annotation:
            type: string
            example: "Author Content"
          annvalue:
            type: integer
            example: 0
          linetext:
            type: string
            example: "Dear Sir/Madam"
          lineorder:
            type: integer
            example: 0
          lineid:
            type: integer
            example: 0
          annotationid:
            type: integer
            example: 0
    responses:
      200:
        description: A list of emails
        schema:
          type: array
          items:
            $ref: '#/definitions/Annotation'
          example: 
            - annotation: "Greeting Content"
              annvalue: 4
              lineid: 4157
              lineorder: 3
              linetext: "Dear Michael"
              annotationid: 130
            - annotation: "Advertising Content"
              annvalue: 3
              lineid: 4162
              lineorder: 8
              linetext: "What Are the Hottest DVDs"
              annotationid: 135
    """
    session = Session()

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

      # try if zoneline has already conneted zoneannotation
      # otherwise AttributeError is raised
      try:
        lines_annotated.append({
          "annotation": zoneline.zoneannotation.zonetype.name, 
          "annvalue": zoneline.zoneannotation.zonetype.id, 
          "linetext": zoneline.linetext,
          "lineorder": zoneline.lineorder,
          "lineid": zoneline.id,
          "annotationid": zoneline.zoneannotation.id
        })
      except AttributeError:
        lines_annotated.append({
          "linetext": zoneline.linetext,
          "lineorder": zoneline.lineorder,
          "lineid": zoneline.id,
        })
    
    # if no zonelines are found, zoneline dataset could be missing. Create is
    # from body
    if len(lines_annotated) == 0:
      eml = []
      for header in session.query(Header).filter_by(messageid=email_hash).all():
        eml.append(header.headername + ": " + header.headervalue)

      body = session.query(Body).filter(Body.messageid == email_hash).first()
      eml.append(body.body)
      eml = "\n".join(eml)
      message = email.message_from_string(eml, policy=email.policy.default)
      payload = _extract_payload(message)
      payload = payload.replace("\r", "").split("\n")
      for line_order, line_text in enumerate(payload):
        lines_annotated.append({
          "linetext": line_text,
          "lineorder": line_order,
        })
    return jsonify(lines_annotated)

@app.route('/emails/<email_hash>', methods=['POST'])
def update_email_line(email_hash):
    """Endpoint updating a list of email hashes
    If annotation id is given, existin zone annotations are updated.
    If otherwise lineid is given, zone annotations are created for exisiting zone lines.
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
          $ref: '#/definitions/Annotation'
        example:
          - annotation: "Greeting Content"
            annvalue: 4
            lineid: 4157
            lineorder: 3
            linetext: "Dear Michael"
            annotationid: 130
          - annotation: "Advertising Content"
            annvalue: 3
            lineid: 4162
            lineorder: 8
            linetext: "What Are the Hottest DVDs"
            annotationid: 135
    responses:
      200:
        description: update OK
    """
    session = Session()

    try:
      # If annotation id is given, update existing annotation ids
      annotation_updates = {}
      for req in request.json:
        annotation_updates[req.pop("annotationid", None)] = req

      for annotation in (session.query(Zoneannotation)
          .filter(
            Zoneannotation.messageid == email_hash,
            Zoneannotation.id.in_(annotation_updates.keys())
          )
        ):
        annotation.annvalue = annotation_updates[annotation.id]

      session.commit()
    except KeyError:
      annotations_creations = {}
      for req in request.json:
        annotations_creations[req.pop("lineid", None)] = req
      for line in (session.query(Zoneline)
          .filter(
            Zoneline.messageid == email_hash,
            Zoneline.id.in_(annotations_creations.keys()),
          )
        ):
        zoneannotation = Zoneannotation()
        zoneannotation.annvalue = annotations_creations[line.id]
        zoneannotation.messageid = email_hash
        zoneannotation.lineid = line.id
        session.add(zoneannotation)
      session.commit()
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
