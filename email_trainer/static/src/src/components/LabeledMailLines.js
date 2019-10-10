import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import { useStyles } from '../layouts/BaseLayout';

export default function LabeledMailLines(props) {

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{ maxWidth: "5px", padding: "2px", }} align="center">Line</TableCell>
            {props.linetypes.map(linetype => (
              <TableCell key={linetype.id} style={{ width: "42px", padding: "2px", }} align="center">{linetype.name}</TableCell>
            ))}
            <TableCell>Line</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.annotationLines.map(line => (
            <TableRow key={line.lineorder}
              className={classes.emailListEntry}>
              <TableCell key={line.lineorder} style={{ width: "5px", padding: "2px", }} className={classes.emailListEntry} align="center">
                {line.lineorder}
              </TableCell>
              {props.linetypes.map(linetype => (
                <TableCell key={`${line.lineorder}_${linetype.id}`} style={{ width: "42px", padding: "2px", }} className={classes.emailListEntry} align="center">
                  <Radio
                    // eslint-disable-next-line 
                    checked={line.annvalue == linetype.id}
                    onChange={props.handleChangeForLine(line.lineorder)}
                    value={linetype.id}
                    name={`${line.lineorder}_${linetype.id}_${line.annvalue}`}
                    key={`${line.lineorder}_${linetype.id}`}
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
  );
}
