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

  const [linetypes, setLinetypes] = useState([])

  function handleChangeForLine(line) {
    return event => {
      setData(data.map((element, index) => {
        if (index === line) {
          return {
            linenumber: element.linenumber,
            text: element.text,
            linetype: event.target.value
          };
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
      let emailData = result.data.map((element, index) => {
        return { linenumber: index, text: element.linetext, linetype: element.annotation };
      });
      if (isSubscribed) {
        setData(emailData);
      }
      return () => isSubscribed = false;
    }
    fetchData();
  }, [props]);
  return (
    <Paper className={classes.root}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{ maxWidth: "5px", padding: "2px",}} align="center">Line</TableCell>
            {linetypes.map(linetype => (
              <TableCell key={linetype} style={{ width: "42px", padding: "2px", }} align="center">{linetype}</TableCell>
            ))}
            <TableCell>Line</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => (
            <TableRow key={n.linenumber} 
            className={classes.emailListEntry}>
              <TableCell key={n.linenumber} style={{ width: "5px", padding: "2px", }} className={classes.emailListEntry} align="center">
                {n.linenumber}
              </TableCell>
              {linetypes.map(linetype => (
              <TableCell key={`${n.linenumber}_${linetype}`} style={{ width: "42px", padding: "2px", }} className={classes.emailListEntry} align="center">
                <Radio
                  // eslint-disable-next-line 
                  checked={n.linetype == linetype}
                  onChange={handleChangeForLine(n.linenumber)}
                  value={linetype}
                  name={`${n.linenumber}_${linetype}`}
                  key={`${n.linenumber}_${linetype}`}
                />
              </TableCell>
                ))}
              <TableCell align="left" className={classes.emailListEntry} >
              <Typography component="div">
              <Box fontFamily="Monospace">{n.text}</Box>
              </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
