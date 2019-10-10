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

mysql> create user 'emailparser_dev'@'localhost' identified by 'password';

mysql> grant all on zonerelease.* to 'emailparser_dev'@'localhost';

mysql> select CONCAT_WS('\n', GROUP_CONCAT(CONCAT_WS(' ', CONCAT(headername, ':'), headervalue) SEPARATOR '\n'), body) from bodies left join headers on bodies.messageid = headers.messageid where bodies.messageid=1;
# Set primary keys
mysql> alter table zonelines add primary key(id);
mysql> alter table zonelines change id id int(10) unsigned NOT NULL AUTO_INCREMENT;
mysql> alter table zoneannotations CHANGE `datetime` `datetime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
mysql> alter table zoneannotations add primary key(id);
mysql> alter table zoneannotations change id id int(10) unsigned NOT NULL AUTO_INCREMENT;
mysql> alter table zonetypes add primary key(id);

# Attention: there are duplicate id's in the errortypes table for 'x8';
mysql> delete from errortypes where name like '%HTML Content%';
mysql> update errortypes set name='Spam Message or HTML Content' where id='x8';
mysql> alter table errortypes add primary key(id);

```
