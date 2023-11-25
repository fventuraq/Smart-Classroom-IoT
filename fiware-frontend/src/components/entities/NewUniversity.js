// src/components/CreateUniversityEntity.js
import React, { useState } from 'react';
import { TextField, Button, makeStyles, Paper, Typography, Container, Grid } from '@material-ui/core';
import fiwareService from '../../services/fiwareService';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    margin: 'auto',
  },
  input: {
    marginBottom: theme.spacing(2),
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

const CreateUniversityEntity = () => {
  const classes = useStyles();
  const [entityInfo, setEntityInfo] = useState({
    id: '',
    type: 'Universidade',
    address: {
      type: 'PostalAddress',
      value: {
        streetAddress: '',
        addressRegion: '',
        addressLocality: '',
        postalCode: '',
      },
      metadata: {
        verified: {
          value: true,
          type: 'Boolean',
        },
      },
    },
    location: {
      type: 'geo:json',
      value: {
        type: 'Point',
        coordinates: [0, 0],
      },
    },
    name: {
      value: '',
      type: 'Text',
    },
  });

  const [response, setResponse] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEntityInfo((prevEntityInfo) => {
      const updatedEntityInfo = { ...prevEntityInfo };

      if (name === 'id') {
        updatedEntityInfo.id = value;
      } else if (name.startsWith('location.value.coordinates')) {
        // Handle latitude and longitude
        const coordinates = [...updatedEntityInfo.location.value.coordinates];
        const index = parseInt(name.split('[')[1].split(']')[0], 10);
        coordinates[index] = parseFloat(value);
        updatedEntityInfo.location.value.coordinates = coordinates;
      } else {
        // Handle nested properties
        const keys = name.split('.');
        let currentLevel = updatedEntityInfo;

        for (let i = 0; i < keys.length - 1; i++) {
          currentLevel = currentLevel[keys[i]];
        }

        // Handle array property
        if (Array.isArray(currentLevel[keys[keys.length - 1]])) {
          currentLevel[keys[keys.length - 1]][0] = value;
        } else {
          currentLevel[keys[keys.length - 1]] = value;
        }
      }

      return updatedEntityInfo;
    });
  };


  const handleCreateEntity = async () => {
    try {
      console.log('mi entidad 2222', entityInfo);
      const fiwareResponse = await fiwareService.registerEntityFiware(entityInfo);
      //const fiwareResponse = await fiwareService.getTest(entityInfo);
      console.log('Successfully created university!:', fiwareResponse);
      setResponse('Successfully created university!');
      setSuccess(true);
    } catch (error) {
      console.error('Error creating the university!:', error);
      setResponse('Error creating the university!');
      setSuccess(false);
    }
  };

  return (
    <Container className={classes.container} style={{ marginTop: '20px' }}>

      <Typography variant="h3" style={{ marginBottom: '16px' }}>
        Create New University
      </Typography>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
            fullWidth
              className={classes.input}
              label='ID = "urn:ngsi-ld:UFF:001"'
              name="id"
              value={entityInfo.id}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
            fullWidth
              className={classes.input}
              label="Street Address"
              name="address.value.streetAddress"
              value={entityInfo.address.value.streetAddress}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
            fullWidth
              className={classes.input}
              label="Address Region"
              name="address.value.addressRegion"
              value={entityInfo.address.value.addressRegion}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
            fullWidth
              className={classes.input}
              label="Address Locality"
              name="address.value.addressLocality"
              value={entityInfo.address.value.addressLocality}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
            fullWidth
              className={classes.input}
              label="Postal Code"
              name="address.value.postalCode"
              value={entityInfo.address.value.postalCode}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
            fullWidth
              className={classes.input}
              label="Latitude"
              name="location.value.coordinates[0]"
              value={entityInfo.location.value.coordinates[0]}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
            fullWidth
              className={classes.input}
              label="Longitude"
              name="location.value.coordinates[1]"
              value={entityInfo.location.value.coordinates[1]}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
            fullWidth
              className={classes.input}
              label="University Name"
              name="name.value"
              value={entityInfo.name.value}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateEntity}>
              Create University
            </Button>
          </Grid>
        </Grid>
      </form>

      {response && (
        <Paper className={success ? classes.success : classes.error}>
          <Typography>{response}</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default CreateUniversityEntity;
