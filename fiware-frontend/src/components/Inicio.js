// src/components/Register.js
import React, { useState } from 'react';
import { TextField, Button, makeStyles, Paper, Typography, Container, Grid } from '@material-ui/core';
import fiwareService from '../services/fiwareService';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '600px', // Ajusta el ancho máximo según tus preferencias
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
            //setResponse('Connection established:', fiwareResponse);
            setResponse('Connection established');
            setSuccess(true)
            // Muestra un mensaje de éxito
            console.log('FIWARE response:', fiwareResponse);
        } catch (error) {
            // Maneja los errores
            //console.error('Connection failed"', error);
            console.error('Connection failed....', error);
            setResponse('Connection failed...');
            setSuccess(false)
        }
    };

    return (
        <Container className={classes.container} style={{ marginTop: '20px' }}>

            <Typography variant="h3" style={{ marginBottom: '16px' }}>
                Smart Classroom
            </Typography>

            <p> <a href="https://github.com/fventuraq/Smart-Classroom-IoT" target="_blank">GitHub Repository</a></p>

            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleRegisterDevice}>
                    Connection test
                </Button>
            </Grid>


            {response && (
                <Paper className={success ? classes.success : classes.error}>
                    <Typography>{response}</Typography>
                </Paper>
            )}
        </Container>
    );
};

export default Inicio;
