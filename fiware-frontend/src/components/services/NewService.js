// src/components/CreateCamposEntity.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, makeStyles, Paper, Typography, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import fiwareService from '../../services/fiwareService';
import iotAgentService from '../../services/iotAgentService';

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

const CreateService = () => {
    const classes = useStyles();
    const [entityInfo, setEntityInfo] = useState({
        apikey: '',
        cbroker: '',
        entity_type: 'Device',
        resource: '',
    });

    //const [andarList, setAndarList] = useState([])
    const [response, setResponse] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null); 

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEntityInfo((prevEntityInfo) => {
            const updatedEntityInfo = { ...prevEntityInfo };

            if (name === 'apikey' || name === 'entity_type' || name === 'cbroker' || name === 'resource') {
                updatedEntityInfo[name] = value;
            } else if (name === 'static_attributes[0].value') {
                // Actualiza solo el campo de la sala
                updatedEntityInfo.static_attributes[0].value = value;
            } else {
                // Handle nested properties
                const keys = name.split('.');
                let currentLevel = updatedEntityInfo;

                for (let i = 0; i < keys.length - 1; i++) {
                    if (!currentLevel[keys[i]]) {
                        // Si la propiedad actual no existe, inicialízala como un objeto vacío
                        currentLevel[keys[i]] = {};
                    }
                    currentLevel = currentLevel[keys[i]];
                }

                // Handle array property
                if (keys[keys.length - 1] === 'value') {
                    // Obtén el id correcto del evento
                    const salaId = value;
                    // Si el valor es un objeto, intenta obtener el id
                    currentLevel[keys[keys.length - 1]] = salaId && salaId.id ? salaId.id : salaId;
                } else {
                    currentLevel[keys[keys.length - 1]] = value;
                }
            }

            return updatedEntityInfo;
        });
    };

    const handleCreateEntity = async () => {
        const serviceData = {
            services: [
                {
                    apikey: entityInfo.apikey,
                    cbroker: entityInfo.cbroker,
                    entity_type: entityInfo.entity_type,
                    resource: entityInfo.resource,
                },
            ],
        };
        try {
            const iotAgentResponse = await iotAgentService.registerService(serviceData, 'openiot', '/');
            //const iotAgentResponse = await iotAgentService.getTest(serviceData);
            console.log('Servicio creado en IoT Agent:', iotAgentResponse);
            setResponse('Servicio creado en IoT Agent');
            setSuccess(true);
        } catch (error) {
            console.error('Error al crear el servicio:', error);
            setResponse('Error al crear el servicio');
            setSuccess(false);
        }
    };

    return (
        <div className={classes.container}>
            <h2>Create New Sala Entity in FIWARE</h2>
            <form>
                <TextField
                    className={classes.input}
                    label="API key of Service"
                    name="apikey"
                    value={entityInfo.apikey}
                    onChange={handleInputChange}
                />
                <br/>
                <TextField
                    className={classes.input}
                    label="Rute of Service(cbroker)"
                    name="cbroker"
                    value={entityInfo.cbroker}
                    onChange={handleInputChange}
                />
                <br/>
                <TextField
                    className={classes.input}
                    label="Resource of Service"
                    name="resource"
                    value={entityInfo.resource}
                    onChange={handleInputChange}
                />
                <br/>
                <Button variant="contained" color="primary" onClick={handleCreateEntity}>
                    Create Service
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

export default CreateService;
