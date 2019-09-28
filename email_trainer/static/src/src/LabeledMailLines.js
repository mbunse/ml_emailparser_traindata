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
      const result = await backend.get('/emails/' + props.emailHash);
      let emailData = result.data.map((element, index) => {
        return { linenumber: index, text: element, linetype: "irrelevant" };
      });
      setData(emailData);
    }
    fetchData();
  }, [props]);
  return (
    <Paper className={classes.root}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{ maxWidth: "5px", padding: "2px",}} align="center">Line</TableCell>
            {props.linetypes.map(linetype => (
              <TableCell style={{ width: "42px", padding: "2px", }} align="center">{linetype.name}</TableCell>
            ))}
            <TableCell>Line</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => (
            <TableRow key={n.linenumber} 
            className={classes.emailListEntry}>
              <TableCell style={{ width: "5px", padding: "2px", }} className={classes.emailListEntry} align="center">
                {n.linenumber}
              </TableCell>
              {props.linetypes.map(linetype => (
              <TableCell style={{ width: "42px", padding: "2px", }} className={classes.emailListEntry} align="center">
                <Radio
                  checked={n.linetype === linetype.value}
                  onChange={handleChangeForLine(n.linenumber)}
                  value={linetype.value}
                  name={`${n.linenumber}_${linetype.value}`}
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
