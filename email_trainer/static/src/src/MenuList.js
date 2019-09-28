import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/List';

function MenuListItems(props) {
  return (
    <div>
        <ListItem button component={Link} to="/" 
        selected={props.location.pathname==="/"}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Email List" />
        </ListItem>
    </div>
  )
};

export default withRouter(MenuListItems);