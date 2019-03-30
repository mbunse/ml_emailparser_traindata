from flask import Flask, jsonify
from flasgger import Swagger

app = Flask(__name__)
swagger = Swagger(app)

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
    emails = ['my.mail@address.com_Thu Aug 09 2018 06:48:01 GMT-0700 (PDT)_subject of mail', 'my.mail@address.com_Thu Aug 09 2018 06:52:01 GMT-0700 (PDT)_Re: subject of mail']

    return jsonify(emails)

app.run(debug=True)