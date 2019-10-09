import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import backend from './backend';
import { useStyles } from './pages/Dashboard';

export default function LabeledMailLines(props) {

  const classes = useStyles();

  const [data, setData] = useState([]);

  const [email, setEmail] = useState({
    subject: '',
    date: ''
  })

  const [linetypes, setLinetypes] = useState([])

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
      setData(data.map((element, index) => {
        if (index === line) {
          element.annvalue = event.target.value;
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
      const result = await backend.get('/emails/' + props.emailHash);
      let emailData = result.data.lines_annotated.map((element, index) => {
        element.linenumber = index 
        return element;
      });
      if (isSubscribed) {
        setData(emailData);
        setEmail({
          date: result.data.date,
          subject: result.data.subject
        })
      }
      return () => isSubscribed = false;
    }
    fetchData();
  }, [props]);
  return (
    <div>      {email.subject}
    <Paper className={classes.root}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{ maxWidth: "5px", padding: "2px", }} align="center">Line</TableCell>
            {linetypes.map(linetype => (
              <TableCell key={linetype.id} style={{ width: "42px", padding: "2px", }} align="center">{linetype.name}</TableCell>
            ))}
            <TableCell>Line</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(line => (
            <TableRow key={line.linenumber}
              className={classes.emailListEntry}>
              <TableCell key={line.linenumber} style={{ width: "5px", padding: "2px", }} className={classes.emailListEntry} align="center">
                {line.linenumber}
              </TableCell>
              {linetypes.map(linetype => (
                <TableCell key={`${line.linenumber}_${linetype.id}`} style={{ width: "42px", padding: "2px", }} className={classes.emailListEntry} align="center">
                  <Radio
                    // eslint-disable-next-line 
                    checked={line.annvalue == linetype.id}
                    onChange={handleChangeForLine(line.linenumber)}
                    value={linetype.id}
                    name={`${line.linenumber}_${linetype.id}_${line.annvalue}`}
                    key={`${line.linenumber}_${linetype.id}`}
                  />
                </TableCell>
              ))}
              <TableCell align="left" className={classes.emailListEntry} >
                <Typography component="div">
                  <Box fontFamily="Monospace">{line.linetext}</Box>
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
    </div>
  );
}
