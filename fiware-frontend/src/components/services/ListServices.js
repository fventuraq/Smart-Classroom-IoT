import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, makeStyles, Paper, Typography, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import iotAgentService from '../../services/iotAgentService';

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

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Obtener la lista de servicios desde FIWARE IoT Agent JSON
                const serviceList = await iotAgentService.getServices( 'openiot', '/');
                console.log('LIST OF SERVICES', serviceList)
                setServices(serviceList);
            } catch (error) {
                console.error('Error al obtener la lista de servicios:', error);
                setError('Error al obtener la lista de servicios');
            }
        };

        fetchServices();
    }, []);

    return (
        <div>
            <h2>Lista de Servicios en FIWARE IoT Agent JSON</h2>

            {error && <p>Error: {error}</p>}

            <ul>
                {services?.map((service) => (
                    <li key={service?.apikey}>
                        <strong>API Key:</strong> {service?.apikey}, <strong>Ruta:</strong> {service?.resource} <br/>
                        <strong>C-BROKER</strong> {service?.cbroker}
                    </li>
                ))}
            </ul>

            <Button variant="contained" component={RouterLink} to="/services/newservice">
                Create Service
            </Button>
        </div>
    );
};

export default ServiceList;
