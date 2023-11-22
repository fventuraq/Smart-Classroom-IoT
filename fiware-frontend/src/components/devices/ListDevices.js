import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, Paper, Typography, Button } from '@material-ui/core';
import fiwareService from '../../services/fiwareService';
import iotAgentService from '../../services/iotAgentService';

const useStyles = makeStyles((theme) => ({
    container: {
        maxWidth: '600px',
        margin: 'auto',
        marginTop: theme.spacing(2),
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

const ListDevices= () => {
    const classes = useStyles();
    const [deviceEntities, setDeviceEntities] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeviceEntities = async () => {
            try {
                // Obtener la lista de entidades universitarias desde FIWARE
                const response = await fiwareService.getEntitiesIoTAgentByType('Device', 'openiot', '/');
                console.log('lista de device',response)
                setDeviceEntities(response);
            } catch (error) {
                console.error('Error al obtener la lista de entidades Device:', error);
                setError('Error al obtener la lista de entidades Device');
            }
        };

        fetchDeviceEntities();
    }, []);

    const iotAgentStatus = async () => {
        try {
            const response = await iotAgentService.checkConnection();
            console.log(response)
        } catch (error) {
            console.error('ERROR EN LA CONEXION', error)
        }
    };

    return (
        <div className={classes.container}>
            <h2>List of Device</h2>
            {deviceEntities?.length > 0 ? (
                <ul>
                    {deviceEntities?.map((entity) => (
                        <li key={entity.id}>
                            <Typography variant="body1">
                                {entity.id} -{' '}
                                <RouterLink to={`/devices/${entity.id}`}>View Data</RouterLink>
                            </Typography>
                        </li>
                    ))}
                </ul>
            ) : (
                <Paper className={classes.error}>
                    <Typography>No university entities found</Typography>
                </Paper>
            )}

            {error && (
                <Paper className={classes.error}>
                    <Typography>{error}</Typography>
                </Paper>
            )}

            <Button variant="contained" component={RouterLink} to="/devices/newdevice">
                Create Device
            </Button>

            <Button variant="contained" color="primary" onClick={iotAgentStatus}>
                IoT
            </Button>


        </div>
    );
};

export default ListDevices;
