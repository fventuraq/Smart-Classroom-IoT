import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, makeStyles, Typography, Container, Grid, Paper } from '@material-ui/core';
import iotAgentService from '../../services/iotAgentService';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '650px',
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
    const classes = useStyles();
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Obtener la lista de servicios desde FIWARE IoT Agent JSON
                const serviceList = await iotAgentService.getServices('openiot', '/');
                console.log('LIST OF SERVICES', serviceList)
                setServices(serviceList);
            } catch (error) {
                console.error('Error getting list of services:', error);
                setError('Error getting list of services!');
            }
        };

        fetchServices();
    }, []);

    return (
        <Container className={classes.container} style={{ marginTop: '20px' }}>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
                List of Services (IoT Agent)
            </Typography>

            {//error && <p>Error: {error}</p>
            }

            <ul>
                {services?.map((service) => (
                    <li key={service?.apikey}>
                        <strong>API Key:</strong> {service?.apikey}, <strong>Ruta:</strong> {service?.resource} <br />
                        <strong>C-BROKER</strong> {service?.cbroker}
                    </li>
                ))}
            </ul>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to="/services/newservice">
                    Create Service
                </Button>
            </Grid>

            {error && (
                <Paper className={classes.error}>
                    <Typography>{error}</Typography>
                </Paper>
            )}


        </Container>
    );
};

export default ServiceList;
