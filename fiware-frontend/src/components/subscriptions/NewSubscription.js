// src/components/CreateSubscription.js
import React, { useState, useEffect } from 'react';
import {
    TextField, Button, makeStyles, Paper, InputLabel, Typography, Container, Grid, FormControl,
    Select, MenuItem
} from '@material-ui/core';
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
}));

const CreateSubscription = () => {
    const classes = useStyles();
    const [subscriptionInfo, setSubscriptionInfo] = useState({
        description: '',
        deviceId: '',
        atrribute: '',
        url: '',
        throttling: 0,
    });

    const [response, setResponse] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [entitiesList, setEntitiesList] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState('');
    const [selectedEntityType, setSelectedEntityType] = useState('');
    const [attributesList, setAttributesList] = useState([]);

    useEffect(() => {
        // Lógica para obtener la lista de entidades disponibles
        const fetchEntitiesList = async () => {
            try {
                const entitiesResponse = await fiwareService.getEntitiesIoTAgentByType('Device', 'openiot', '/');
                console.log('my entities', entitiesResponse)
                setEntitiesList(entitiesResponse);
            } catch (error) {
                console.error('Error fetching entities list!', error);
            }
        };

        fetchEntitiesList();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSubscriptionInfo((prevEntityInfo) => {
            const updatedEntityInfo = { ...prevEntityInfo };

            if (name === 'deviceId') {
                updatedEntityInfo.deviceId = value;
            } else if (name === 'attribute') {
                updatedEntityInfo.attribute = value;
            } else {
                // Si hay otros campos de entrada, manejarlos aquí
                updatedEntityInfo[name] = value;
            }

            return updatedEntityInfo;
        });
    };

    const handleCreateSubscription = async () => {

        let data = {
            description: subscriptionInfo.description,
            subject: {
                entities: [
                    {
                        id: subscriptionInfo.deviceId,
                        type: 'Device',
                    },
                ],
                condition: {
                    attrs: [subscriptionInfo.atrribute],
                },
            },
            notification: {
                http: {
                    url: subscriptionInfo.url,
                },
                attrs: [
                    "temperature",
                    "relativeHumidity"],
            },
            throttling: Number(subscriptionInfo.throttling),

        }
        try {
            const fiwareResponse = await fiwareService.createSubscription(data, 'openiot', '/');
            //const fiwareResponse = await fiwareService.getTest(data);
            console.log('Successfully created subscription!', fiwareResponse);
            setResponse('Successfully created subscription!');
            setSuccess(true);
        } catch (error) {
            console.error('Error creating the subscription!', error);
            setResponse('Error creating the subscription!');
            setSuccess(false);
        }
    };

    return (
        <Container className={classes.container} style={{ marginTop: '20px' }}>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
                Create New Subscription
            </Typography>
            <form>
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            className={classes.input}
                            label="Description"
                            name="description"
                            value={subscriptionInfo.description}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel>Device</InputLabel>
                            <Select
                                name="deviceId"
                                value={subscriptionInfo.deviceId}
                                onChange={handleInputChange}
                            >
                                {entitiesList.map((device) => (
                                    <MenuItem key={device.id} value={device.id}>
                                        {device.id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl className={classes.formControl} fullWidth>
                            <InputLabel>Size</InputLabel>
                            <Select
                                name="atrribute"
                                value={subscriptionInfo.atrribute}
                                onChange={handleInputChange}
                            >
                                <MenuItem value='temperature'>
                                    Temperature
                                </MenuItem>
                                <MenuItem value='relativeHumidity'>
                                    Humidity
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            className={classes.input}
                            label="Url"
                            name="url"
                            value={subscriptionInfo.url}
                            onChange={handleInputChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            className={classes.input}
                            label="Time (s)"
                            name="throttling"
                            type="number"
                            value={subscriptionInfo.throttling}
                            onChange={handleInputChange}
                        />
                    </Grid>

                    {/*
          <Grid item xs={12}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel>Attribute</InputLabel>
              <Select
                value={subscriptionInfo.subject.condition.attrs[0]}
                onChange={(event) => handleInputChange(event)}
                name="subject.condition.attrs[0]"
              >
                {attributesList.map((attribute) => (
                  <MenuItem key={attribute.label} value={attribute.label}>
                    {attribute.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
                */}
                    {/* ... (otros campos de entrada) */}
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleCreateSubscription}>
                            Create Subscription
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

export default CreateSubscription;
