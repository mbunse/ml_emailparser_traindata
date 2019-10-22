# Import Data

## Generate password
```
python3.7 -c 'import os; print(f"PASSWORD = \"{os.urandom(12).hex()}\"")' > email_trainer/secrets.py
```

## Setup db

Import of enron emails takes approx. 1h up to 4h.

```
source setup_db.sh
```

Manually import mails to avoid encoding errors.
```
mysql -uroot zonerelease 
mysql> source enron_fixed.sql
mysql> source fix_primkeys.sql
```
## Some example queries

`$ mysql -uroot zonerelease`

```{sql}
select * from zonetypes;
--+----+---------------------+
--| id | name                |
--+----+---------------------+
--|  6 | Reply Content       |
--|  7 | Forwarded Content   |
--|  0 | Author Content      |
--|  1 | Signature Content   |
--|  2 | Disclaimer Content  |
--|  3 | Advertising Content |
--|  4 | Greeting Content    |
--|  5 | Signoff Content     |
--|  8 | Attachment Content  |
--+----+---------------------+
--9 rows in set (0,01 sec)

-- Search an replace in enron.sql: "TYPE=MyISAM;" -> "ENGINE=MyISAM;"
-- sed 's/TYPE=MyISAM;/ENGINE=MyISAM;/g' email_trainer/data/enron.sql > email_trainer/data/enron_fixed.sql

source data/enron.sql
select linetext, c.name as linetye from zonelines as a left join zoneannotations  as b on a.id=b.lineid left join zonetypes as c on b.annvalue=c.id where a.messageid=31767;


select CONCAT_WS('\n', GROUP_CONCAT(CONCAT_WS(' ', CONCAT(headername, ':'), headervalue) SEPARATOR '\n'), body) from bodies left join headers on bodies.messageid = headers.messageid where bodies.messageid=1;
```


