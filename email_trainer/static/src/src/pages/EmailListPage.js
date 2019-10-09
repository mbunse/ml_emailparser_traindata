import React from 'react';
import { Typography } from '@material-ui/core';
import { useStyles } from '../layouts/BaseLayout';
import DashboardFrame from '../components/DashboardFrame';
import ListTrainingMails from '../components/ListTrainingMails';
export default function EmailListPage() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <DashboardFrame title="Emails"></DashboardFrame>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Typography variant="h4" gutterBottom component="h2">
          List
          </Typography>
        <div className={classes.tableContainer}>
          <ListTrainingMails />
        </div>
      </main>
    </React.Fragment>
  );
}
