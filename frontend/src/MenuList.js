import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/List';
import Email from '@material-ui/icons/Email'
import PropTypes from 'prop-types';

class MenuList extends React.Component {

  render() {
    return (
      <div>
        <ListItem button onClick={ this.props.handleClick } id="list">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Email List" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Email />
          </ListItemIcon>
          <ListItemText primary="Test Email" />
        </ListItem>
      </div>
    )
  }
}

MenuList.propTypes = {
  handleClick: PropTypes.func.isRequired
};
export default MenuList;