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

const CreateCampusEntity = () => {
  const classes = useStyles();
  const [entityInfo, setEntityInfo] = useState({
    id: '',
    type: 'Campos',
    name: {
      value: '',
      type: 'Text',
    },
    refAndar: {
      type: 'Relationship',
      value: '',
    },
  });

  const [universityList, setUniversityList] = useState([])
  const [response, setResponse] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUniversityEntities = async () => {
      try {
        // Obtener la lista de entidades universitarias desde FIWARE
        const response = await fiwareService.getEntitiesByType('Universidade');
        console.log(response)
        setUniversityList(response);
      } catch (error) {
        console.error('Error when obtaining the university list!', error);
        setError('Error when obtaining the university list!');
      }
    };

    fetchUniversityEntities();
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
      // Obtener la información de la universidad seleccionada desde FIWARE
      const universityInfo = await fiwareService.getUniversityById(entityInfo.refAndar.value);
      console.log('universidad seleccionada es...', universityInfo[0])

      // Verificar que la universidad existe
      if (universityInfo[0] && universityInfo[0].id) {
        const fiwareResponse = await fiwareService.registerEntityFiware(entityInfo);
        //const fiwareResponse = await fiwareService.getTest(entityInfo);
        console.log('Successfully created campus!:', fiwareResponse);
        setResponse('Successfully created campus!');
        setSuccess(true);
      } else {
        setResponse('The selected university does not exist!');
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error creating the campus!', error);
      setResponse('Error creating the campus!');
      setSuccess(false);
    }
  };

  return (
    <Container className={classes.container} style={{ marginTop: '20px' }}>

      <Typography variant="h3" style={{ marginBottom: '16px' }}>
        Create New Campus
      </Typography>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
            fullWidth
              className={classes.input}
              label='ID = "urn:ngsi-ld:Campos:001"'
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
              <InputLabel>University</InputLabel>
              <Select
                name="refAndar.value"
                value={entityInfo.refAndar.value}
                onChange={handleInputChange}
              >
                {/* Obtener la lista de universidades desde FIWARE y mostrarlas como opciones */}
                {universityList.map((university) => (
                  <MenuItem key={university.id} value={university.id}>
                    {university.name.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleCreateEntity}>
              Create Campus
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

export default CreateCampusEntity;
