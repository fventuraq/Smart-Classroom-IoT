// src/components/CampusList.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, makeStyles, Container, Grid, Switch, TextField } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import io from 'socket.io-client';
import fiwareService from '../../services/fiwareService';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '1000px',
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

const DetailSala = () => {
    const classes = useStyles();
    //const { iddevice } = useParams();
    const { idsala } = useParams();
    const [deviceDHT22, setDeviceDHT22] = useState([]);
    const [deviceRFID, setDeviceRFID] = useState([]);
    const [sala, setSala] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [message, setMessage] = useState('');
    const [intervalInfo, setIntervalInfo] = useState({ value: '' });

    const [device, setDevice] = useState([]);
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [temperatureValue, setTemperatureValue] = useState('');
    const [humidityValue, setHumidityValue] = useState('');
    const [timeSt, setTimeSt] = useState('');
    const key = '4jggokgpepnvsb2uv4s40d59ov'
    //const deviceid = 'device906'
    //const deviceid = iddevice.replace('urn:ngsi-ld:', '');
    const MAX_DATA_POINTS = 50;
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Temperature',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
            },
            {
                label: 'Humidity',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(148,159,177,0.8)',
                borderColor: 'rgba(148,159,177,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(148,159,177,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(148,159,177,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
            },
        ],
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setIntervalInfo({ ...intervalInfo, [name]: value });
    };

    const handleChangeRFID = async () => {
        setIsChecked(!isChecked);

        if (isChecked) {
            setIsChecked(!isChecked);
            let dataChecked = {
                "disable": {
                    "type": "command",
                    "value": ""
                }
            };

            try {
                const responseChecked = await fiwareService.startDevice(dataChecked, deviceRFID.id, 'openiot', '/');
                setMessage('RFID DISABLE SUCCESSFULLY')
                console.log('RFID DISABLE SUCCESSFULLY', responseChecked)
            } catch (error) {
                console.error('FAIL CONEXION', error)
            }
        } else {
            setIsChecked(!isChecked);
            let dataChecked = {
                "activate": {
                    "type": "command",
                    "value": ""
                }
            };

            try {
                const responseChecked = await fiwareService.startDevice(dataChecked, deviceRFID.id, 'openiot', '/');
                startDevice();
                setMessage('RFID ACTIVE SUCCESSFULLY')
                console.log('RFID DISABLE SUCCESSFULLY', responseChecked)
            } catch (error) {
                console.error('FAIL CONEXION', error)
            }
        }
    };


    const chartOptions = {
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                    displayFormats: {
                        second: 'h:mm:ss a',
                    },
                },
                ticks: {
                    source: 'auto', // Utiliza automáticamente el número de ticks adecuado
                },
                position: 'bottom',
            },
            y: {
                type: 'linear',
            },
        },
    };

    const myChart = useRef(null);
    const ctx = useRef(null);

    useEffect(() => {
        if (ctx.current) {
            const canvas = ctx.current;
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);

            const newChart = new Line(ctx.current, {
                type: 'line',
                data: chartData,
                options: chartOptions,
            });
            myChart.current = newChart;
        }
    }, [chartData, chartOptions]);

    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const responseSala = await fiwareService.getSalaById(idsala)
                setSala(responseSala[0]);
                console.log('datos sala:', responseSala[0])
                await fiwareService.getEntitiesIoTAgentByType('Device', 'openiot', '/').then(listDevices => {
                    console.log('mis devices: ', listDevices)

                    const myDevices = listDevices.filter(device => {
                        return device.refSala.value === idsala;
                    });

                    const dispositivosConHumidityTemperature = myDevices.filter(dispositivo => {
                        return 'relativeHumidity' in dispositivo && 'temperature' in dispositivo;
                    });

                    dispositivosConHumidityTemperature[0].name = dispositivosConHumidityTemperature[0].id.replace('urn:ngsi-ld:', '')
                    setDeviceDHT22(dispositivosConHumidityTemperature[0])
                    setTemperature(dispositivosConHumidityTemperature[0].relativeHumidity)
                    setHumidity(dispositivosConHumidityTemperature[0].temperature)
                    setTimeSt(dispositivosConHumidityTemperature[0].TimeInstant)

                    const dispositivosConRfid = myDevices.filter(dispositivo => {
                        return 'rfid' in dispositivo;
                    });

                    dispositivosConRfid[0].name = dispositivosConRfid[0].id.replace('urn:ngsi-ld:', '')
                    setDeviceRFID(dispositivosConRfid[0])
                })

            } catch (error) {
                console.error('Error al obtener los datos de la sela y los device:', error);
            }
        };

        fetchDevice();
    }, [idsala]);
    
    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('notification', (data) => {
            console.log('DATA LLEGANDO EN BUCLE', data);

            const currentDate = new Date(data.data[0].temperature.metadata.TimeInstant.value);
            console.log('Current Date:', currentDate.toLocaleTimeString());

            const newLabel = currentDate;

            console.log('New Label:', newLabel);
            console.log('New Temperature Value:', data.data[0].temperature.value);
            console.log('New Humidity Value:', data.data[0].relativeHumidity.value);

            setTemperatureValue(data.data[0].temperature.value);
            setHumidityValue(data.data[0].relativeHumidity.value);
            setTimeSt(data.data[0].temperature.metadata.TimeInstant.value);

            setChartData((prevChartData) => {
                const newLabels = [...prevChartData.labels, newLabel];
                const newTemperatureData = [...prevChartData.datasets[0].data, data.data[0].temperature.value];
                const newHumidityData = [...prevChartData.datasets[1].data, data.data[0].relativeHumidity.value];

                if (newLabels.length > MAX_DATA_POINTS) {
                    newLabels.shift(); // Eliminar el punto más antiguo
                    newTemperatureData.shift(); // Eliminar el dato más antiguo
                    newHumidityData.shift();
                }

                return {
                    labels: newLabels,
                    datasets: [
                        {
                            ...prevChartData.datasets[0],
                            data: newTemperatureData,
                        },
                        {
                            ...prevChartData.datasets[1],
                            data: newHumidityData,
                        },
                    ],
                };
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);


    const startDevice = async () => {
        let dataStart = {
            start: {
                type: 'command',
                value: ''
            }
        };
        try {
            const response = await fiwareService.startDevice(dataStart, deviceDHT22.id, 'openiot', '/');
            //console.log(response)
        } catch (error) {
            console.error('ERROR EN LA CONEXION', error)
        }
    }

    const stopDevice = async () => {
        let dataStop = {
            stop: {
                type: 'command',
                value: ''
            }
        };
        try {
            const response = await fiwareService.startDevice(dataStop, deviceDHT22.id, 'openiot', '/');
            //console.log(response)
        } catch (error) {
            console.error('ERROR EN LA CONEXION', error)
        }
    }

    const intervalDevice = async () => {

        let dataInterval = {
            interval: {
                type: "command",
                value: intervalInfo.value
            }
        }

        try {
            const response = await fiwareService.startDevice(dataInterval, deviceDHT22.id, 'openiot', '/');
            //console.log(response)
        } catch (error) {
            console.error('ERROR EN LA CONEXION', error)
        }
    }

    return (
        <Container className={classes.container} style={{ marginTop: '20px' }}>
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    <Typography variant="h3" style={{ marginBottom: '16px' }}>
                        Detail of Classroom:<b> {sala?.name?.value}  </b>
                    </Typography>
                    <h2>DHT22 <span style={{ color: '#596dd5' }}>{deviceDHT22?.name}</span>:</h2>

                    <h3>TimeInstant: {JSON.stringify(timeSt)}</h3>
                    <h3>Temperature: {JSON.stringify(temperatureValue)}</h3>
                    <h3>Relative Humidity: {JSON.stringify(humidityValue)}</h3>

                    <h2>RFID <span style={{ color: '#ea8226' }}>{deviceRFID?.name}</span>:</h2> <Switch
                        checked={isChecked}
                        onChange={handleChangeRFID}
                        color="primary"
                        name="switch"
                        inputProps={{ 'aria-label': 'Switch' }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={startDevice}
                        disabled={!isChecked}>
                        Start Device
                    </Button>

                    <Button
                        variant="contained"
                        style={{ color: 'white', backgroundColor: '#b72c2c' }}
                        onClick={stopDevice}
                        disabled={!isChecked}>
                        Stop Device
                    </Button>


                </Grid>

                <Grid item xs={3}>
                    <h2>Change interval</h2>
                    <form>
                        <TextField
                            label="Tempo"
                            name="value"
                            value={intervalInfo.value}
                            onChange={handleInputChange}
                        />
                        <Button variant="contained" color="primary" onClick={intervalDevice}>
                            Change
                        </Button>
                    </form>
                </Grid>

                <Grid item xs={12}>
                    <Line data={chartData} options={chartOptions} />
                </Grid>
            </Grid>


        </Container>
    );
};

export default DetailSala;
