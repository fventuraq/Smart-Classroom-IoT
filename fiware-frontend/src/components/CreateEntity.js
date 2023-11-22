// src/components/CreateEntity.js
import React, { useState } from 'react';
import { TextField, Button, makeStyles, Paper, Typography } from '@material-ui/core';
import fiwareService from '../services/fiwareService';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '300px', // Ajusta el ancho máximo según tus preferencias
        margin: 'auto', // Centra el formulario en la pantalla
    },
    input: {
        marginBottom: theme.spacing(2), // Agrega margen inferior entre campos
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

const CreateEntity = () => {
    const classes = useStyles();
    const [entityInfo, setEntityInfo] = useState({
        id: '',
        type: '',
        temperature: { value: 0, type: 'Float' },
        pressure: { value: 0, type: 'Integer' },
    });

    const [response, setResponse] = useState(null);
    const [success, setSuccess] = useState(false);   

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'id' || name === 'type') {
            setEntityInfo((prevEntityInfo) => ({
                ...prevEntityInfo,
                [name]: value,
            }));
        } else {
            const [fieldName, subFieldName] = name.split('.');
            setEntityInfo((prevEntityInfo) => ({
                ...prevEntityInfo,
                [fieldName]: {
                    ...prevEntityInfo[fieldName],
                    [subFieldName]: subFieldName === 'value' ? parseFloat(value) : value,
                },
            }));
        }
    };

    const handleCreateEntity = async () => {
        try {
            console.log('mi entiti', entityInfo)
            const fiwareResponse = await fiwareService.registerEntityFiware(entityInfo);

            // Puedes realizar acciones adicionales aquí

            console.log('Entidad creada en FIWARE:', fiwareResponse);
            setResponse('Entidad creada con éxito en FIWARE');
            setSuccess(true)
            //alert('Entidad creada con éxito en FIWARE');
        } catch (error) {
            console.error('Error al crear la entidad:', error);
            setResponse('Error al crear la entidad');
            setSuccess(false)
            //alert('Error al crear la entidad');
        }
    };

    return (
        <div className={classes.container}>
            <h2>Create New Entity in FIWARE</h2>
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
                    label="Type of the Entity"
                    name="type"
                    value={entityInfo.type}
                    onChange={handleInputChange}
                />
                <TextField
                    className={classes.input}
                    label="Temperature"
                    name="temperature.value"
                    type="number"
                    value={entityInfo.temperature.value}
                    onChange={handleInputChange}
                />
                <TextField
                    className={classes.input}
                    label="Pressure"
                    name="pressure.value"
                    type="number"
                    value={entityInfo.pressure.value}
                    onChange={handleInputChange}
                />
                {/* Agrega otros campos del formulario según tus necesidades */}
                <Button variant="contained" color="primary" onClick={handleCreateEntity}>
                    Create Entity
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

export default CreateEntity;
