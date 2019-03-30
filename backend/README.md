# Email Parser Backend

## requirements

```
pip install azure-storage-blob
```



Start backend
```
python training_mails.py
```

ApiDocs at http://localhost:5000/apidocs/.

Get list of emails at http://localhost:5000/emails.

## Secrets

Store mongo db URI in `secrets.py` like

```{python}
BLOB_KEY = "IKHGWw823jsmn23JHwekwud2jJkL889o23JJksj293KJHk328J82mKj3J203KJLkjmynbeJ823mJHalqw912jK=="
BLOB_ACCOUNT = "account_name"

```
