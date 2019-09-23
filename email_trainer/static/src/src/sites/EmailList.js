import React from 'react';
import ListTrainingMails from '../ListTrainingMails';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '../pages/Dashboard';

export default function EmailList(props) {
    const classes = useStyles();
    return (
    <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Typography variant="h4" gutterBottom component="h2">
            List
          </Typography>
        <div className={classes.tableContainer}>
            <ListTrainingMails handleClick={props.handleClick} />
        </div>
    </main>
    );
};