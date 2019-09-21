# Import Data

```{sql}
$ mysql -uroot
mysql> source data/EmailZoneData/ZoneAnnotationsDatabase-20090707.dat
# db is zonerelease
mysql> select * from zonetypes;
#+----+---------------------+
#| id | name                |
#+----+---------------------+
#|  6 | Reply Content       |
#|  7 | Forwarded Content   |
#|  0 | Author Content      |
#|  1 | Signature Content   |
#|  2 | Disclaimer Content  |
#|  3 | Advertising Content |
#|  4 | Greeting Content    |
#|  5 | Signoff Content     |
#|  8 | Attachment Content  |
#+----+---------------------+
#9 rows in set (0,01 sec)

# Search an replace in enron.sql: "TYPE=MyISAM;" -> "ENGINE=MyISAM;"
mysql> source data/enron.sql
# and wait (4h)
mysql> select linetext, c.name as linetye from zonelines as a left join zoneannotations  as b on a.id=b.lineid left join zonetypes as c on b.annvalue=c.id where a.messageid=31767;
```
