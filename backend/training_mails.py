from flask import Flask, jsonify
from flasgger import Swagger
from pymongo import MongoClient

from secrets import MONGO_URI

app = Flask(__name__)
swagger = Swagger(app)

client = MongoClient(MONGO_URI)
mails = client["emailparser"]["mails"]


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
        default: my.mail@address.com_Thu Aug 09 2018 06:48:01 GMT-0700 (PDT)_subject of mail
    responses:
      200:
        description: A list of emails
        schema:
          $ref: '#/definitions/Emails'
        examples:
          ['my.mail@address.com_Thu Aug 09 2018 06:48:01 GMT-0700 (PDT)_subject of mail', 'my.mail@address.com_Thu Aug 09 2018 06:52:01 GMT-0700 (PDT)_Re: subject of mail']
    """
    emails = []
    for mail in mails.find():
        emails.append(mail["id"])

    return jsonify(emails)

app.run(debug=True)