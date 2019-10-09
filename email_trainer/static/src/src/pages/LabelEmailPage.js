import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '../layouts/BaseLayout';
import LabeledMailLines from '../components/LabeledMailLines';
import DashboardFrame from '../components/DashboardFrame';

export default function LabelEmail({ match }) {
    const classes = useStyles();

    return (
        <React.Fragment>
        <DashboardFrame title="Emails"></DashboardFrame>
  
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Typography variant="h4" gutterBottom component="h2">
                Email
            </Typography>
            <div className={classes.tableContainer}>
                <LabeledMailLines emailHash={match.params.emailHash} 
                linetypes={[
                    {name: 'Irrelevant', value: 'irrelevant'},
                    {name: 'Forwarded', value: 'forwarded'},
                    {name: 'Signature', value: 'signature'},

                ]}/>
            </div>
        </main>
        </React.Fragment>);
}