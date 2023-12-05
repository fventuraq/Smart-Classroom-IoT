// src/components/CreateCamposEntity.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, makeStyles, Paper, Typography, Select, MenuItem, InputLabel, FormControl, Container, Grid } from '@material-ui/core';
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

const CreateDeviceEntity = () => {
    const classes = useStyles();
    const [entityInfo, setEntityInfo] = useState({
        device_id: '',
        entity_name: '',
        entity_type: 'Device',
        transport: '',
        endpoint: '',
        deviceType: '',
        /*attributes: [
            {
                object_id: 'temperature',
                name: 'temperature',
                type: 'Number',
            },
            {
                object_id: 'humidity',
                name: 'relativeHumidity',
                type: 'Number',
            },
        ],
        commands: [
            {
                name: 'start',
                type: 'command',
            },
            {
                name: 'stop',
                type: 'command',
            },
            {
                name: 'interval',
                type: 'command',
            },
        ],*/
        static_attributes: [
            {
                name: 'refSala',
                type: 'Relationship',
                value: '',
            },
        ],
    });

    const [salaList, setSalaList] = useState([])
    const [response, setResponse] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSalaEntities = async () => {
            try {
                // Obtener la lista de entidades Andares desde FIWARE
                const response = await fiwareService.getEntitiesByType('Sala');
                console.log(response)
                setSalaList(response);
            } catch (error) {
                console.error('Error al obtener la lista de Salas:', error);
                setError('Error al obtener la lista de entidades Sala');
            }
        };

        fetchSalaEntities();
    }, []);


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEntityInfo((prevEntityInfo) => {
            const updatedEntityInfo = { ...prevEntityInfo };

            if (name === 'device_id' || name === 'entity_name' || name === 'transport' || name === 'endpoint') {
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
        let iotAgentResponse;
        try {
            // Obtener la información de la sala seleccionada desde FIWARE
            console.log('La sala seleccionada es ', entityInfo.static_attributes[0])
            const salaInfo = await fiwareService.getSalaById(entityInfo.static_attributes[0].value);
            console.log('universidad seleccionada es...', salaInfo[0])

            // Verificar que la universidad existe
            if (salaInfo[0] && salaInfo[0].id) {

                if(entityInfo.deviceType === 'dht22'){
                    entityInfo.attributes = [
                        {
                            object_id: 'temperature',
                            name: 'temperature',
                            type: 'Number',
                        },
                        {
                            object_id: 'humidity',
                            name: 'relativeHumidity',
                            type: 'Number',
                        },
                    ]

                    entityInfo.commands = [
                        {
                            "name": "start",
                            "type": "command"
                        },
                        {
                            "name": "stop",
                            "type": "command"
                        },{
                            "name": "interval",
                            "type": "command"
                        }
                    ]

                } else if (entityInfo.deviceType === 'rfid') {
                    entityInfo.attributes = [
                        {
                            object_id: "rfid",
                            name: "rfid",
                            type: "Bolean"
                        }
                    ]

                    entityInfo.commands = [
                        {
                            "name": "activate",
                            "type": "command"
                        },
                        {
                            "name": "disable",
                            "type": "command"
                        }
                    ]
                }
                const deviceData = {
                    devices: [
                        {
                            device_id: entityInfo.device_id,
                            entity_name: 'urn:ngsi-ld:' + entityInfo.device_id,
                            entity_type: entityInfo.entity_type,
                            transport: entityInfo.transport,
                            endpoint: entityInfo.endpoint,
                            attributes: entityInfo.attributes,
                            commands: entityInfo.commands,
                            static_attributes: entityInfo.static_attributes,
                        },
                    ],
                };
                //const iotAgentResponse = await iotAgentService.getTest(deviceData);                
                iotAgentResponse = await iotAgentService.registerDevice(deviceData, 'openiot', '/').then(async (response) => {
                    let key = '4jggokgpepnvsb2uv4s40d59ov'
                    setResponse('Device created and successfully tested in IoT Agent!!!');
                    setSuccess(true);
                    console.log('Device created successfully in IoT Agent: ', iotAgentResponse);
                    if (response && entityInfo.deviceType === 'dht22') {
                        let tempdata = {
                            temperature: 1,
                            humidity: 1
                        }

                        await iotAgentService.sendDataAgent(tempdata, key, entityInfo.device_id, 'openiot', '/').then(res1 => {
                            console.log('respuesta2', res1)
                            setResponse('Device created and successfully tested in IoT Agent!!!');
                            setSuccess(true);
                        }).catch(err => {
                            console.error('ERROR EN LA CONEXION', error);
                        })                   
                    } else if ( response && entityInfo.deviceType === 'rfid'){
                        let tempdata = {
                            rfid: false
                        }
                        await iotAgentService.sendDataAgent(tempdata, key, entityInfo.device_id, 'openiot', '/').then(res2 => {
                            console.log('respuesta2', res2)
                            setResponse('Device created and successfully tested in IoT Agent!!!');
                            setSuccess(true);
                        }).catch(err => {
                            console.error('CONECTION ERROR', error)
                        })
                    }
                });
            } else {
                setResponse('The selected classroom does not exist!!!');
                setSuccess(false);
            }
        } catch (error) {
            console.error('Error creating the DEVICE:', error);
            setResponse('Error creating the DEVICE');
            setSuccess(false);
        }
    };

    return (
        <Container className={classes.container} style={{ marginTop: '20px' }}>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
                Create New Device
            </Typography>
            <form>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            className={classes.input}
                            label='Device ID = "device001"'
                            name="device_id"
                            value={entityInfo.device_id}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl className={classes.formControl}>
                            <InputLabel>Transport</InputLabel>
                            <Select
                                name="transport"
                                value={entityInfo.transport}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="">Select Transport</MenuItem>
                                <MenuItem value='HTTP'>HTTP</MenuItem>
                                <MenuItem value='MQTT'>MQTT</MenuItem>

                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl className={classes.formControl}>
                            <InputLabel>Device Type</InputLabel>
                            <Select
                                name="deviceType"
                                value={entityInfo.deviceType}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="">Select Type</MenuItem>
                                <MenuItem value='dht22'>DHT22</MenuItem>
                                <MenuItem value='rfid'>RFID</MenuItem>

                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            className={classes.input}
                            label='Endpoint = "http://dummy-device:80/dht22"'
                            name="endpoint"
                            value={entityInfo.endpoint}
                            onChange={handleInputChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl className={classes.formControl}>
                            <InputLabel>Classroom</InputLabel>
                            <Select
                                name="static_attributes[0].value"
                                value={entityInfo.static_attributes[0].value}
                                onChange={handleInputChange}
                            >
                                {/* Obtener la lista de universidades desde FIWARE y mostrarlas como opciones */}
                                <MenuItem value="">Select Classroom</MenuItem>
                                {salaList.map((sala) => (
                                    <MenuItem key={sala.id} value={sala.id}>
                                        {sala.name.value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleCreateEntity}>
                            Create Device
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

export default CreateDeviceEntity;
