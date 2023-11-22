import React, { useState, useEffect } from 'react';
import { Typography, Paper, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import fiwareService from '../services/fiwareService';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(2),
    },
    listItem: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }));
  
  const ListEntities = () => {
    const classes = useStyles();
    const [entities, setEntities] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchEntities = async () => {
        try {
          // Obtener las entidades de FIWARE para el tipo 'Room'
          const response = await fiwareService.getEntitiesByType('Room');
          console.log(response)
          setEntities(response);
        } catch (error) {
          console.error('Error al obtener las entidades:', error);
          setError('Error al obtener las entidades');
        }
      };
  
      fetchEntities();
    }, []);
  
    return (
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom>
          List of Entities (Room)
        </Typography>
  
        {error && (
          <Paper className={classes.error}>
            <Typography>{error}</Typography>
          </Paper>
        )}
  
        <List className={classes.listItem}>
          {entities?.map((entity) => (
            <ListItem key={entity.id}>
              <ListItemText
                primary={`ID: ${entity.id}`}
                secondary={`Type: ${entity.type}`}
              />
            </ListItem>
          ))}
        </List>
      </div>
    );
  };
  
  export default ListEntities;
  