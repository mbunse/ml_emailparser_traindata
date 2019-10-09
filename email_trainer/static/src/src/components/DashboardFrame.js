import React, { useState } from 'react';
import clsx from 'clsx';
import {
  Drawer, AppBar, Toolbar, List, Typography,
  Divider, IconButton, Badge
} from '@material-ui/core';
import {
  Menu as MenuIcon, Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons';
import MenuList from './MenuList';
import { useStyles } from '../layouts/BaseLayout';

export default function DashboardFrame(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState('list');
  // eslint-disable-next-line no-unused-vars
  const [emailHash, setEmailHash] = useState();

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (event) => {
    setEmailHash(event.currentTarget.id);
    setPage('email');
  }

  return (
    <React.Fragment>
      <AppBar position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {props.title}
          </Typography>
          <div>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <MenuList handleClick={handleClick} />
        </List>
      </Drawer>
    </React.Fragment>
  );
}
