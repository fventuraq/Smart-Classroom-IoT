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

const ListAndares = () => {
  const classes = useStyles();
  const [andarEntities, setAndarEntities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndaresEntities = async () => {
      try {
        // Obtener la lista de entidades universitarias desde FIWARE
        const response = await fiwareService.getEntitiesByType('Andar');
        console.log(response)
        setAndarEntities(response);
      } catch (error) {
        console.error('Error al obtener la lista de entidades andar:', error);
        setError('Error al obtener la lista de entidades andar');
      }
    };

    fetchAndaresEntities();
  }, []);

  return (
    <div className={classes.container}>
      <h2>List of Andaree Entities in FIWARE</h2>
      {andarEntities?.length > 0 ? (
        <ul>
          {andarEntities?.map((andar) => (
            <li key={andar.id}>
              <Typography variant="body1">
                {andar.name.value} -{' '}
                <RouterLink to={`/entities/campus/${andar.id}`}>View Andar</RouterLink>
              </Typography>
            </li>
          ))}
        </ul>
      ) : (
        <Paper className={classes.error}>
          <Typography>No Andares entities found</Typography>
        </Paper>
      )}

      {error && (
        <Paper className={classes.error}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      <Button variant="contained" component={RouterLink} to="/entities/newandar">
        Create Andar
      </Button>
    </div>
  );
};

export default ListAndares;
