import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import backend from './backend';
const useStyles = makeStyles({
  root: {}, // a style rule
});

export default function ListTrainingMails(props) {

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await backend.get('/emails');
      setData(result.data);
    }
    fetchData()
  }, []);

  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      {data.map(n => (
        <ListItem key={n} id={n} button onClick={props.handleClick}>
          <ListItemText primary={n} />
        </ListItem>
      ))}
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </div>
  )
}
