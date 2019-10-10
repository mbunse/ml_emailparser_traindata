import React from 'react';
import { Route, BrowserRouter as Router } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import EmailListPages from '../pages/EmailListPage';
import LabelEmailPage from '../pages/LabelEmailPage';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme';

export const useStyles = makeStyles(theme);

export default function BaseLayout() {
    const classes = useStyles();

    return (
        <Router>
            <div className={classes.root}>
                <CssBaseline />
                <Route exact path="/" component={EmailListPages} />
                <Route path="/:messageId" children={<LabelEmailPage />} />
            </div>
        </Router>
    );
}
