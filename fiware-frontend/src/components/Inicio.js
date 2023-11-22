// src/components/Register.js
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

const Inicio = () => {
    const classes = useStyles();
    const [deviceInfo, setDeviceInfo] = useState({
        id: '',
        type: 'TemperatureSensor', // Tipo específico para un sensor de temperatura
        temperature: '', // Campo específico para la temperatura
        // Agrega otros campos según tus necesidades
    });

    const [response, setResponse] = useState(null);
    const [success, setSuccess] = useState(false);    

    const handleRegisterDevice = async () => {
        try {
            // Registra el dispositivo en FIWARE
            const fiwareResponse = await fiwareService.getStatusOrion();
            setResponse('FIWARE response:', fiwareResponse);
            setSuccess(true)
            // Muestra un mensaje de éxito
            console.log('FIWARE response:', fiwareResponse);
        } catch (error) {
            // Maneja los errores
            console.error('Error in the response:', error);
            setResponse('Error in the Conecction');
            setSuccess(false)
        }
    };

    return (
        <div className={classes.container}>
            <h2>Registro de Dispositivo</h2>
            <form>               
                {/* Agrega otros campos del formulario según tus necesidades */}
                <Button variant="contained" color="primary" onClick={handleRegisterDevice}>
                    Verificar conexion
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

export default Inicio;
