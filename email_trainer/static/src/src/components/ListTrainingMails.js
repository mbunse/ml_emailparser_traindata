import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import backend from '../backend';
import { useStyles } from '../layouts/BaseLayout';

export default function ListTrainingMails(props) {

  const classes = useStyles();

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await backend.get('/emails');
      setData(result.data);
    }
    fetchData()
  }, []);

  return (
    <div>
      {data.map(email => (
        <ListItem button component={Link} to={`/${email.messageid}`} key={email.messageid} id={email.messageid}>
          <ListItemAvatar>
            <Avatar className={ email.hasannotation ? classes.greenAvatar : (
              email.iszoneline ? classes.yellowAvatar : classes.redAvatar)
            }>{email.messageid}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={email.subject} 
          secondary={email.from + " " + email.iszoneline}/>
        </ListItem>
      ))}
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </div>
  )
}
