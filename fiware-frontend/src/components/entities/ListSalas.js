import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, Paper, Typography, Button, Container, Grid } from '@material-ui/core';
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
  notlist: {
    backgroundColor: '#ffb425',
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
        console.error('Error getting list of classroom:', error);
        setError('Error getting list of classrooms');
      }
    };

    fetchSalasEntities();
  }, []);

  return (
    <Container className={classes.container} style={{ marginTop: '20px' }}>
      <Typography variant="h3" style={{ marginBottom: '16px' }}>
      List of Classroom
            </Typography>
      {salaEntities?.length > 0 ? (
        <ul>
          {salaEntities?.map((sala) => (
            <li key={sala.id}>
              <Typography variant="body1">
                {sala.name.value} -{' '}
                <RouterLink to={`/entities/salas/${sala.id}`}>View Sala</RouterLink>
              </Typography>
            </li>
          ))}
        </ul>
      ) : (
        <Paper className={classes.notlist}>
          <Typography>There are no registered classrooms</Typography>
        </Paper>
      )}

      {error && (
        <Paper className={classes.error}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      <Button variant="contained" component={RouterLink} to="/entities/newsala">
        Create New Classroom
      </Button>
    </Container>
  );
};

export default ListSalas;
