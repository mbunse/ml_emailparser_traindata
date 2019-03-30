from flask import Flask, jsonify
from flasgger import Swagger
from azure.storage.blob import BlockBlobService

from secrets import BLOB_ACCOUNT, BLOB_KEY

app = Flask(__name__)
swagger = Swagger(app)

# https://docs.microsoft.com/de-de/azure/storage/blobs/storage-quickstart-blobs-python
block_blob_service = BlockBlobService(account_name=BLOB_ACCOUNT, account_key=BLOB_KEY)
container_name = "mails"
block_blob_service.list_blobs(container_name)
mails = block_blob_service.list_blobs(container_name)

@app.route('/emails')
def emails():
    """Example endpoint returning a list of colors by palette
    This is using docstrings for specifications.
    ---
    parameters:
      - name: palette
        in: path
        type: string
        enum: ['all', 'rgb', 'cmyk']
        required: true
        default: all
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

app.run(debug=True)