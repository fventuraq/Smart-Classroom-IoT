// src/components/CreateUniversityEntity.js
import React, { useState } from 'react';
import { TextField, Button, makeStyles, Paper, Typography } from '@material-ui/core';
import fiwareService from '../../services/fiwareService';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
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
      console.log('Entidad University creada en FIWARE:', fiwareResponse);
      setResponse('Entidad universidad creada con éxito en FIWARE');
      setSuccess(true);
    } catch (error) {
      console.error('Error al crear la entidad universidad:', error);
      setResponse('Error al crear la entidad universidad');
      setSuccess(false);
    }
  };

  return (
    <div className={classes.container}>
      <h2>Create New UNIVERSITY Entity in FIWARE</h2>
      <form>
        <TextField
          className={classes.input}
          label="ID of the Entity"
          name="id"
          value={entityInfo.id}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.input}
          label="Street Address"
          name="address.value.streetAddress"
          value={entityInfo.address.value.streetAddress}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.input}
          label="Address Region"
          name="address.value.addressRegion"
          value={entityInfo.address.value.addressRegion}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.input}
          label="Address Locality"
          name="address.value.addressLocality"
          value={entityInfo.address.value.addressLocality}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.input}
          label="Postal Code"
          name="address.value.postalCode"
          value={entityInfo.address.value.postalCode}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.input}
          label="Latitude"
          name="location.value.coordinates[0]"
          value={entityInfo.location.value.coordinates[0]}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.input}
          label="Longitude"
          name="location.value.coordinates[1]"
          value={entityInfo.location.value.coordinates[1]}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.input}
          label="University Name"
          name="name.value"
          value={entityInfo.name.value}
          onChange={handleInputChange}
        />
        <Button variant="contained" color="primary" onClick={handleCreateEntity}>
          Create University Entity
        </Button>
      </form>

      {response && (
        <Paper className={success ? classes.success : classes.error}>
          <Typography>{response}</Typography>
        </Paper>
      )}
    </div>
  );
};

export default CreateUniversityEntity;
