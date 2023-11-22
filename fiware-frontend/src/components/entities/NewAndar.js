// src/components/CreateCamposEntity.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, makeStyles, Paper, Typography, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
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
        console.error('Error al obtener la lista de campus:', error);
        setError('Error al obtener la lista de entidades campus');
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
        console.log('Entidad creada en FIWARE:', fiwareResponse);
        setResponse('Entidad creada con éxito en FIWARE');
        setSuccess(true);
      } else {
        setResponse('El Campus seleccionada no existe');
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error al crear la entidad Andar:', error);
      setResponse('Error al crear la entidad Andar');
      setSuccess(false);
    }
  };

  return (
    <div className={classes.container}>
      <h2>Create New Andar Entity in FIWARE</h2>
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
          label="Name"
          name="name.value"
          value={entityInfo.name.value}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.input}
          label="Max Capacity"
          name="maxCapacity.value"
          type="number"
          value={entityInfo.maxCapacity.value}
          onChange={handleInputChange}
        />
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
        <Button variant="contained" color="primary" onClick={handleCreateEntity}>
          Create Andar Entity
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

export default CreateAndarEntity;
