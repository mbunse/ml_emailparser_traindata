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
import backend from './backend';

const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
};

class LabeledMailLines extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: []
    };
  }
  componentDidMount() {
    backend.get('/emails/' + this.props.email_hash).then(res => {
      var data = res.data.map((element, index) => {
        return {id: index, text: element, linetype: "irrelevant"};
      });
      console.log(data);
      this.setState({
        isLoaded: true,
        data: data
      });
    });
  }

  render() {
    const { classes } = this.props;

    const { data } = this.state;

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
                    checked={n.linetype === 'irrelevant'}
                    onChange={this.handleChange}
                    value="a"
                    name="radio-button-demo"
                    aria-label="A"
                  />
                </TableCell>
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
LabeledMailLines.propTypes = {
  classes: PropTypes.object.isRequired,
  email_hash: PropTypes.string.isRequired
};

export default withStyles(styles)(LabeledMailLines);