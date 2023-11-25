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
        console.error('Error getting list of floors:', error);
        setError('Error getting list of floors');
      }
    };

    fetchAndaresEntities();
  }, []);

  return (
    <Container className={classes.container} style={{ marginTop: '20px' }}>
      <Typography variant="h3" style={{ marginBottom: '16px' }}>
        List of Floors
      </Typography>
      {andarEntities?.length > 0 ? (
        <ul>
          {andarEntities?.map((andar) => (
            <li key={andar.id}>
              <Typography variant="body1">
                {andar.name.value} -{' '}
                <RouterLink to={`/entities/campus/${andar.id}`}>View Floor</RouterLink>
              </Typography>
            </li>
          ))}
        </ul>
      ) : (

        <Paper className={classes.notlist}>
          <Typography>There are no registered flats</Typography>
        </Paper>
      )}

      {error && (
        <Paper className={classes.error}>
          <Typography>{error}</Typography>
        </Paper>
      )}
      <Grid item xs={12}>
        <Button variant="contained" component={RouterLink} to="/entities/newandar">
          Create New Floor
        </Button>
      </Grid>
    </Container>
  );
};

export default ListAndares;
