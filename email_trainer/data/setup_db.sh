#!/bin/bash

wget http://bailando.sims.berkeley.edu/enron/enron.sql.gz
gunzip -d enron.sql.gz
sed 's/TYPE=MyISAM;/ENGINE=MyISAM;/g' enron.sql > enron_fixed.sql
# Fix the following error: ERROR 1426 (42000) at line 255752: Too-big precision 14 specified for 'messagedt'. Maximum is 6.
sed -i -r 's/timestamp\([0-9]+\)/timestamp/g' enron_fixed.sql

# The following script creates a db 'zonerelease'
mysql -uroot < EmailZoneData/ZoneAnnotationsDatabase-20090707.dat

# Create user
pushd .. 
PASSWD=`python3 -c 'from secrets import *;print(PASSWORD)'` 
popd
mysql -uroot --execute="CREATE USER 'emailparser_dev'@'localhost' IDENTIFIED BY '$PASSWD'; GRANT ALL ON zonerelease.* TO 'emailparser_dev'@'localhost';";


