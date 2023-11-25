// src/components/CreateCamposEntity.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, makeStyles, Paper, Typography, Select, MenuItem, InputLabel, FormControl, Container, Grid } from '@material-ui/core';
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
  formControl: {
    marginBottom: theme.spacing(2),
    minWidth: '100%',
  },
}));

const CreateAndarEntity = () => {
  const classes = useStyles();
  const [entityInfo, setEntityInfo] = useState({
    id: '',
    type: 'Andar',
    name: {
      value: '',
      type: 'Text',
    },
    maxCapacity: {
      value: 0,
      type: 'Integer'
    },
    refAndar: {
      type: 'Relationship',
      value: '',
    },
  });

  const [campusList, setCampusList] = useState([])
  const [response, setResponse] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampusEntities = async () => {
      try {
        // Obtener la lista de entidades universitarias desde FIWARE
        const response = await fiwareService.getEntitiesByType('Campos');
        console.log(response)
        setCampusList(response);
      } catch (error) {
        console.error('Error when obtaining the campus list!:', error);
        setError('Error when obtaining the campus list!');
      }
    };

    fetchCampusEntities();
  }, []);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEntityInfo((prevEntityInfo) => {
      const updatedEntityInfo = { ...prevEntityInfo };

      if (name === 'id') {
        updatedEntityInfo.id = value;
      } else {
        // Handle nested properties
        const keys = name.split('.');
        let currentLevel = updatedEntityInfo;

        for (let i = 0; i < keys.length - 1; i++) {
          currentLevel = currentLevel[keys[i]];
        }

        // Handle array property
        if (keys[keys.length - 1] === 'value' && !isNaN(value)) {
          // Convert to integer if it's a numeric value
          currentLevel[keys[keys.length - 1]] = parseInt(value, 10);
        } else {
          currentLevel[keys[keys.length - 1]] = value;
        }
      }

      return updatedEntityInfo;
    });
  };

  const handleCreateEntity = async () => {
    try {
      // Obtener la información de la universidad seleccionada desde FIWARE
      const campusInfo = await fiwareService.getCampusById(entityInfo.refAndar.value);
      console.log('universidad seleccionada es...', campusInfo[0])

      // Verificar que la universidad existe
      if (campusInfo[0] && campusInfo[0].id) {
        const fiwareResponse = await fiwareService.registerEntityFiware(entityInfo);
        //const fiwareResponse = await fiwareService.getTest(entityInfo);
        console.log('Successfully created Floor!', fiwareResponse);
        setResponse('Successfully created Floor!');
        setSuccess(true);
      } else {
        setResponse('The selected campus does not exist!');
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error creating the Floor:', error);
      setResponse('Error creating the Floor!');
      setSuccess(false);
    }
  };

  return (
    <Container className={classes.container} style={{ marginTop: '20px' }}>

      <Typography variant="h3" style={{ marginBottom: '16px' }}>
        Create New Floor
      </Typography>
      <form>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
            fullWidth
              className={classes.input}
              label='ID = "urn:ngsi-ld:Andar:001"'
              name="id"
              value={entityInfo.id}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
            fullWidth
              className={classes.input}
              label="Name"
              name="name.value"
              value={entityInfo.name.value}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
            fullWidth
              className={classes.input}
              label="Max Capacity"
              name="maxCapacity.value"
              type="number"
              value={entityInfo.maxCapacity.value}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel>Campus</InputLabel>
              <Select
                name="refAndar.value"
                value={entityInfo.refAndar.value}
                onChange={handleInputChange}
              >
                {/* Obtener la lista de universidades desde FIWARE y mostrarlas como opciones */}
                {campusList.map((campus) => (
                  <MenuItem key={campus.id} value={campus.id}>
                    {campus.name.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleCreateEntity}>
              Create Floor
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

export default CreateAndarEntity;
