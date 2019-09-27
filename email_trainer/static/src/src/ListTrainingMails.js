import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import backend from './backend';

export default function ListTrainingMails(props) {

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
      {data.map(emailHash => (
        <ListItem button component={Link} to={`/${emailHash}`} key={emailHash} id={emailHash} onClick={props.handleClick}>
          <ListItemText primary={emailHash} />
        </ListItem>
      ))}
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </div>
  )
}
