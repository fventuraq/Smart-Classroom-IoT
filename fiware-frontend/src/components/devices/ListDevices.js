import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, Paper, Typography, Button, Container, Grid } from '@material-ui/core';
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
    notlist: {
        backgroundColor: '#ffb425',
        color: 'white',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
      },
}));

const ListDevices = () => {
    const classes = useStyles();
    const [deviceEntities, setDeviceEntities] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeviceEntities = async () => {
            try {
                // Obtener la lista de entidades universitarias desde FIWARE
                const response = await fiwareService.getEntitiesIoTAgentByType('Device', 'openiot', '/');
                console.log('lista de device', response)
                setDeviceEntities(response);
            } catch (error) {
                console.error('Error getting list of devices:', error);
                setError('Error getting list of devices!');
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
        <Container className={classes.container} style={{ marginTop: '20px' }}>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
                List of Devices
            </Typography>
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
                <Paper className={classes.notlist}>
                    <Typography>There are no registered devices</Typography>
                </Paper>
            )}

            {error && (
                <Paper className={classes.error}>
                    <Typography>{error}</Typography>
                </Paper>
            )}
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to="/devices/newdevice">
                    Create Device
                </Button>
            </Grid>

            {/*

            <Button variant="contained" color="primary" onClick={iotAgentStatus}>
                IoT
            </Button>
            */}


        </Container>
    );
};

export default ListDevices;
