import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Irrelevant</TableCell>
            <TableCell align="center">Relevant</TableCell>
            <TableCell align="center">Next Mail</TableCell>
            <TableCell>Line</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => (
            <TableRow key={n.linenumber}>
              <TableCell align="center">
                <Radio
                  checked={n.linetype === 'irrelevant'}
                  onChange={handleChangeForLine(n.linenumber)}
                  value="irrelevant"
                  name={`${n.linenumber}_irrelevant`}
                />
              </TableCell>
              <TableCell align="center">
                <Radio
                  checked={n.linetype === 'relevant'}
                  onChange={handleChangeForLine(n.linenumber)}
                  value="relevant"
                  name={`${n.linenumber}_relevant`}
                />
              </TableCell>
              <TableCell align="center">
                <Radio
                  checked={n.linetype === 'nextmail'}
                  onChange={handleChangeForLine(n.linenumber)}
                  value="nextmail"
                  name={`${n.linenumber}_nextmail`}
                />
              </TableCell>
              <TableCell align="left" >{n.text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
