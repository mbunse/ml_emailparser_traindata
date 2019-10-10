import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LabeledMailLines from '../components/LabeledMailLines';
import DashboardFrame from '../components/DashboardFrame';
import backend from '../backend';
import { useStyles } from '../layouts/BaseLayout';

import { Button } from '@material-ui/core';
import { Save as SaveIcon } from  '@material-ui/icons';

export default function LabelEmailPage() {
    const classes = useStyles();

    const [annotationLines, setAnnotationLines] = useState([]);

    const [email, setEmail] = useState({
      subject: '',
      date: ''
    })
  
    const [linetypes, setLinetypes] = useState([])
  
    let { messageId } = useParams();

    function getLinetypeForId(id) {
        let linetype = linetypes.find(element => {
          return element.id === Number(id)
        })
        if (linetype === undefined) {
          return undefined;
        }
        else {
          return linetype.name;
        }
      }
    
    function handleChangeForLine(line) {
        return event => {
          setAnnotationLines(annotationLines.map((element) => {
            if (element.lineorder === line) {
              element.annvalue = Number(event.target.value);
              element.linetype = getLinetypeForId(event.target.value);
              return element;
            }
            else {
              return element;
            }
          }));
        }
      }    

    useEffect(() => {
        async function fetchData() {
          let isSubscribed = true;
          const result_annotations = await backend.get('/annotations');
          if (isSubscribed) {
            setLinetypes(result_annotations.data);
          }
          const result = await backend.get('/emails/' + messageId);
          if (isSubscribed) {
            setAnnotationLines(result.data.lines_annotated);
            setEmail({
              date: result.data.date,
              subject: result.data.subject
            })
          }
          return () => isSubscribed = false;
        }
        fetchData();
      }, [messageId]);
    function updateAnnotation() {
      console.log(annotationLines);
      backend.post('/emails/'+messageId,
        annotationLines
      )
    }
    return (
        <React.Fragment>
        <DashboardFrame title={email.subject}
        appbarItems={
          <Button variant="contained" size="large" 
            className={classes.button} startIcon={<SaveIcon />}
            onClick={updateAnnotation}>
          Save
        </Button>
        }
        ></DashboardFrame>
  
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <div className={classes.tableContainer}>
                <LabeledMailLines emailHash={messageId} 
                handleChangeForLine={handleChangeForLine}
                annotationLines={annotationLines}
                email={email}
                linetypes={linetypes}/>
            </div>
        </main>
        </React.Fragment>);
}
