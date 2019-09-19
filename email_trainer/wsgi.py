import email
import email.policy
from quopri import decodestring
import glob
import os

from flask import Flask, jsonify, abort, render_template
from flask_cors import CORS
from flasgger import Swagger
from werkzeug.exceptions import HTTPException

from bs4 import BeautifulSoup
import bs4.element

app = Flask(__name__,
  template_folder="templates/",
  static_folder="static/"
  )

CORS(app)
swagger = Swagger(app)

mails = []
for mail_path in glob.iglob("data/*.eml"):
  mails.append(os.path.basename(mail_path).split(".")[0])

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
    return jsonify(mails)


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
    try:
      # eml = block_blob_service.get_blob_to_text(
      #     container_name, email_hash).content
      with open(os.path.join("data", email_hash + ".eml")) as eml_file:
        eml = eml_file.read()
    except FileNotFoundError:
      abort(404)

    message = email.message_from_string(eml, policy=email.policy.default)
    payload = _extract_payload(message)
    payload = payload.replace("\r", "").split("\n")
    return jsonify(payload)


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