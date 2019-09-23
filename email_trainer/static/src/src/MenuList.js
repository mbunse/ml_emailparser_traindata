import React from 'react';
import { NavLink } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/List';
import Email from '@material-ui/icons/Email'

export default function MenuListItems(props) {
  return (
    <div>
      <NavLink to="/">
        <ListItem>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Email List" />
        </ListItem>
      </NavLink>
      <NavLink to="/:emailHash">
        <ListItem button>
          <ListItemIcon>
            <Email />
          </ListItemIcon>
          <ListItemText primary="Test Email" />
        </ListItem>
      </NavLink>
    </div>
  )
};