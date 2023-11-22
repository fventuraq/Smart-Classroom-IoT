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
        console.error('Error al obtener la lista de andares:', error);
        setError('Error al obtener la lista de entidades andares');
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
        console.log('Entidad creada en FIWARE:', fiwareResponse);
        setResponse('Entidad creada con éxito en FIWARE');
        setSuccess(true);
      } else {
        setResponse('El Andar seleccionado no existe');
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error al crear la entidad Sala:', error);
      setResponse('Error al crear la entidad Sala');
      setSuccess(false);
    }
  };

  return (
    <div className={classes.container}>
      <h2>Create New Sala Entity in FIWARE</h2>
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
          label="Size"
          name="size.value"
          value={entityInfo.size.value}
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
          <InputLabel>Andar</InputLabel>
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
        <Button variant="contained" color="primary" onClick={handleCreateEntity}>
          Create Sala Entity
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

export default CreateSalaEntity;
