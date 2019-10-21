-- Add primary keys to db
alter table zonelines add primary key(id);
alter table zonelines change id id int(10) unsigned NOT NULL AUTO_INCREMENT;
alter table zoneannotations CHANGE `datetime` `datetime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
alter table zoneannotations add primary key(id);
alter table zoneannotations change id id int(10) unsigned NOT NULL AUTO_INCREMENT;
alter table zonetypes add primary key(id);

-- Attention: there are duplicate id's in the errortypes table for 'x8';
delete from errortypes where name like '%HTML Content%';
update errortypes set name='Spam Message or HTML Content' where id='x8';
alter table errortypes add primary key(id);