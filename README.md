# README

## Environment
```
pipenv install
```

Activate environment
```
pipenv shell
```

## Data Sources

### Zebra zone annotation
http://zebra.thoughtlets.org/data.php

for database dump of the Enron corpus http://bailando.sims.berkeley.edu/enron/enron.sql.gz

### Enron dataset
https://www.cs.cmu.edu/~enron/

# Email Parser Backend

## Data

Put eml files into backend/data directory.

## Start WebApp
```
cd email_trainer
flask run
```
Frontend at http://localhost:5000/

ApiDocs at http://localhost:5000/apidocs/.

Get list of emails at http://localhost:5000/emails.

See [email_trainer/static/src/README.md](email_trainer/static/src/README.md) to build frontend