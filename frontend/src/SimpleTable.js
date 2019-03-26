import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
};

let id = 0;
function createData(text, linetype) {
  id += 1;
  return { id, text, linetype };
}

const data = [
  createData('Hallo Herr Schneider,', 'relevant'),
  createData('vielen Dank. Wir konnten es aber leider jetzt nicht mehr f=C3=BCr den Pitch einbauen. F=C3=BCr eine =C3=BCberarbeitete Version ist es aber auf jeden Fa=ll hilfreich!', "relevant"),
  createData('Vielen Dank und Gr=C3=BC=C3=9Fe', "irrelevant"),
  createData('Moritz Bunse', "irrelevant"),
  createData('Harald Schneider <Harald.Schneider@company.com> schrieb am Do. 8. Nov. 2018 um 12:52:', "nextmail")
];

class SimpleTable extends React.Component {

  render() {
    const { classes } = this.props;

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
              <TableRow key={n.id}>
                <TableCell align="center">
                  <Radio
                    checked={n.linetype === 'relevant'}
                    onChange={this.handleChange}
                    value="a"
                    name="radio-button-demo"
                    aria-label="A"
                  />
                </TableCell>
                <TableCell align="center">
                  <Radio
                    checked={n.linetype === 'irrelevant'}
                    onChange={this.handleChange}
                    value="a"
                    name="radio-button-demo"
                    aria-label="A"
                  />
                </TableCell>
                <TableCell align="center">
                  <Radio
                    checked={n.linetype === 'nextmail'}
                    onChange={this.handleChange}
                    value="a"
                    name="radio-button-demo"
                    aria-label="A"
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
}
SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);