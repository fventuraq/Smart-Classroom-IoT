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

const CreateSalaEntity = () => {
  const classes = useStyles();
  const [entityInfo, setEntityInfo] = useState({
    id: '',
    type: 'Sala',
    name: {
      value: '',
      type: 'Text',
    },
    size: {
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

  const [andarList, setAndarList] = useState([])
  const [response, setResponse] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndarEntities = async () => {
      try {
        // Obtener la lista de entidades Andares desde FIWARE
        const response = await fiwareService.getEntitiesByType('Andar');
        console.log(response)
        setAndarList(response);
      } catch (error) {
        console.error('Error when obtaining the floors list!', error);
        setError('Error when obtaining the floors list!');
      }
    };

    fetchAndarEntities();
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
      const andarInfo = await fiwareService.getAndarById(entityInfo.refAndar.value);
      console.log('universidad seleccionada es...', andarInfo[0])

      // Verificar que la universidad existe
      if (andarInfo[0] && andarInfo[0].id) {
        const fiwareResponse = await fiwareService.registerEntityFiware(entityInfo);
        //const fiwareResponse = await fiwareService.getTest(entityInfo);
        console.log('Successfully created classroom!', fiwareResponse);
        setResponse('Successfully created classroom!');
        setSuccess(true);
      } else {
        setResponse('The selected floor does not exist!');
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error creating the classroom!', error);
      setResponse('Error creating the classroom!');
      setSuccess(false);
    }
  };

  return (
    <Container className={classes.container} style={{ marginTop: '20px' }}>
      <Typography variant="h3" style={{ marginBottom: '16px' }}>
        Create New Classroom
      </Typography>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              className={classes.input}
              label="ID of the Entity"
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
            <FormControl className={classes.formControl}>
              <InputLabel>Size</InputLabel>
              <Select
                name="size.value"
                value={entityInfo.size.value}
                onChange={handleInputChange}
              >
                <MenuItem value='S'>
                  Small
                </MenuItem>
                <MenuItem value='M'>
                  Medium
                </MenuItem>
                <MenuItem value='L'>
                  Large
                </MenuItem>
              </Select>
            </FormControl>
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
              <InputLabel>Floor</InputLabel>
              <Select
                name="refAndar.value"
                value={entityInfo.refAndar.value}
                onChange={handleInputChange}
              >
                {/* Obtener la lista de universidades desde FIWARE y mostrarlas como opciones */}
                {andarList.map((andar) => (
                  <MenuItem key={andar.id} value={andar.id}>
                    {andar.name.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleCreateEntity}>
              Create Classroom
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

export default CreateSalaEntity;
