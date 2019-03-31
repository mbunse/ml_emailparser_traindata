import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import backend from './backend';
import PropTypes from 'prop-types';

const styles = {
  };

class ListTrainingMails extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoaded: false,
        data: []
      };
    }
    componentDidMount() {
      backend.get('/emails').then(res => {
        this.setState({
          isLoaded: true,
          data: res.data
        });
      });
    }
  
    render() {
        return (
            this.state.data.map(n => (
                <ListItem key={n} id={n} button onClick={this.props.handleClick}>
                    <ListItemText primary={n} />
                </ListItem>
            )))
    }
}
ListTrainingMails.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default withStyles(styles)(ListTrainingMails);