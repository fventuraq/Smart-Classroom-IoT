import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, Paper, Typography, Button } from '@material-ui/core';
import fiwareService from '../../services/fiwareService';

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: '600px',
    margin: 'auto',
    marginTop: theme.spacing(2),
  },
  success: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  error: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));

const ListSalas = () => {
  const classes = useStyles();
  const [salaEntities, setSalaEntities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalasEntities = async () => {
      try {
        // Obtener la lista de entidades salas desde FIWARE
        const response = await fiwareService.getEntitiesByType('Sala');
        console.log(response)
        setSalaEntities(response);
      } catch (error) {
        console.error('Error al obtener la lista de entidades salas:', error);
        setError('Error al obtener la lista de entidades salas');
      }
    };

    fetchSalasEntities();
  }, []);

  return (
    <div className={classes.container}>
      <h2>List of Salas Entities in FIWARE</h2>
      {salaEntities?.length > 0 ? (
        <ul>
          {salaEntities?.map((sala) => (
            <li key={sala.id}>
              <Typography variant="body1">
                {sala.name.value} -{' '}
                <RouterLink to={`/entities/sala/${sala.id}`}>View Sala</RouterLink>
              </Typography>
            </li>
          ))}
        </ul>
      ) : (
        <Paper className={classes.error}>
          <Typography>No Salas entities found</Typography>
        </Paper>
      )}

      {error && (
        <Paper className={classes.error}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      <Button variant="contained" component={RouterLink} to="/entities/newsala">
        Create Sala
      </Button>
    </div>
  );
};

export default ListSalas;
