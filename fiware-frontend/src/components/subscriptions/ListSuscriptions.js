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

const ListSuscriptions = () => {
  const classes = useStyles();
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        // Obtener la lista de entidades universitarias desde FIWARE
        const response = await fiwareService.getSubscriptions('openiot', '/');
        console.log(response)
        setSubscriptions(response);
      } catch (error) {
        console.error('Error getting list of subscriptions:', error);
        setError('Error getting list of subscriptons');
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <Container className={classes.container} style={{ marginTop: '20px' }}>

      <Typography variant="h3" style={{ marginBottom: '16px' }}>
        List of Subscriptions
      </Typography>
      {subscriptions?.length > 0 ? (
        <ul>
          {subscriptions?.map((entity) => (
            <li key={entity.id}>
              <Typography variant="body1">
                {entity.description} -{' '}
                <RouterLink to={`/`}>Delete Subsctiption</RouterLink>
              </Typography>
            </li>
          ))}
        </ul>
      ) : (
        <Paper className={classes.notlist}>
          <Typography>There are no registered subscriptions</Typography>
        </Paper>
      )}

      {error && (
        <Paper className={classes.error}>
          <Typography>{error}</Typography>
        </Paper>
      )}
      <Grid item xs={12}>
        <Button variant="contained" component={RouterLink} to="/subscriptions/newsubscription">
          Create New Subscription
        </Button>
      </Grid>
    </Container>
  );
};

export default ListSuscriptions;
