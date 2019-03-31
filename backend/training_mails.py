import email
import email.policy
from quopri import decodestring

from flask import Flask, jsonify, abort
from flasgger import Swagger
from azure.storage.blob import BlockBlobService
from azure.common import AzureMissingResourceHttpError
from werkzeug.exceptions import HTTPException

from bs4 import BeautifulSoup
import bs4.element

from secrets import BLOB_ACCOUNT, BLOB_KEY

app = Flask(__name__)
swagger = Swagger(app)

# https://docs.microsoft.com/de-de/azure/storage/blobs/storage-quickstart-blobs-python
block_blob_service = BlockBlobService(
    account_name=BLOB_ACCOUNT, account_key=BLOB_KEY)
container_name = "mails"
block_blob_service.list_blobs(container_name)
mails = block_blob_service.list_blobs(container_name)

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
    emails = []
    for mail in mails:
        emails.append(mail.name)

    return jsonify(emails)


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
      eml = block_blob_service.get_blob_to_text(
          container_name, email_hash).content
    except AzureMissingResourceHttpError:
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

  content = ""
  for part in email_message.walk():
    if part.get_content_type() in ["text/plain", "text/html"]:
      if "Content-Transfer-Encoding" in part:
        payload = decodestring(part.get_payload()).decode()
      else:
        payload = part.get_payload()
      if part.get_content_type() == "text/html":
        soup = BeautifulSoup(payload, 'html.parser').find("body")
        content = content + soup.get_text(separator="\n")
      else: 
        content = content + payload
  return content

app.run(debug=True)
