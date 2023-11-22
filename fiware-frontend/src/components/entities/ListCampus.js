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

const ListCampus = () => {
  const classes = useStyles();
  const [universityEntities, setUniversityEntities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUniversityEntities = async () => {
      try {
        // Obtener la lista de entidades universitarias desde FIWARE
        const response = await fiwareService.getEntitiesByType('Universidade');
        console.log(response)
        setUniversityEntities(response);
      } catch (error) {
        console.error('Error al obtener la lista de entidades universitarias:', error);
        setError('Error al obtener la lista de entidades universitarias');
      }
    };

    fetchUniversityEntities();
  }, []);

  return (
    <div className={classes.container}>
      <h2>List of Campus Entities in FIWARE</h2>
      {universityEntities?.length > 0 ? (
        <ul>
          {universityEntities?.map((entity) => (
            <li key={entity.id}>
              <Typography variant="body1">
                {entity.name.value} -{' '}
                <RouterLink to={`/entities/campus/${entity.id}`}>View Campuses</RouterLink>
              </Typography>
            </li>
          ))}
        </ul>
      ) : (
        <Paper className={classes.error}>
          <Typography>No university entities found</Typography>
        </Paper>
      )}

      {error && (
        <Paper className={classes.error}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      <Button variant="contained" component={RouterLink} to="/entities/newcampus">
        Create Campus
      </Button>
    </div>
  );
};

export default ListCampus;
