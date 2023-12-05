// src/components/CampusList.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, makeStyles, Container, Grid } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns'; 
import io from 'socket.io-client';
import fiwareService from '../../services/fiwareService';
import iotAgentService from '../../services/iotAgentService';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '700px',
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

const DetailDevice = () => {
    const classes = useStyles();
    const { iddevice } = useParams();
    const [device, setDevice] = useState([]);
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [timeSt, setTimeSt] = useState();
    const key = '4jggokgpepnvsb2uv4s40d59ov'
    //const deviceid = 'device906'
    const deviceid = iddevice.replace('urn:ngsi-ld:', '');
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
        ],
    });


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
            position: 'left',
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
                const response = await fiwareService.getDeviceById(iddevice, 'openiot', '/');
                console.log('mi res', response)
                setDevice(response);
                setTemperature(response?.relativeHumidity)
                setHumidity(response?.temperature)
                setTimeSt(response?.TimeInstant)                
            } catch (error) {
                console.error('Error al obtener el Device:', error);
            }
        };

        fetchDevice();
    }, [iddevice]);

    useEffect(() => {
        const socket = io('http://localhost:5000');

        // Manejar los datos recibidos desde el socket
        socket.on('notification', (data) => {
            console.log('DATA LLEGANDO EN BUCLE', data);
            let temHumi = data.data[0].relativeHumidity.value
            let temTempe = data.data[0].temperature.value
            let temTime = data.data[0].temperature.metadata.TimeInstant.value
            setTemperature(temTempe);
            setHumidity(temHumi)
            setTimeSt(temTime)
            // Actualizar el estado del gráfico con los nuevos datos
            setChartData((prevChartData) => {
                const newLabels = [...prevChartData.labels, new Date().toLocaleTimeString()];
                const newTemperatureData = [...prevChartData.datasets[0].data, data.temperature];

                if (newLabels.length > MAX_DATA_POINTS) {
                    newLabels.shift(); // Eliminar el punto más antiguo
                    newTemperatureData.shift(); // Eliminar el dato más antiguo
                  }

                return {
                    labels: newLabels,
                    datasets: [
                        {
                            ...prevChartData.datasets[0],
                            data: newTemperatureData,
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
            const response = await fiwareService.startDevice(dataStart, iddevice, 'openiot', '/');
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
            const response = await fiwareService.startDevice(dataStop, iddevice, 'openiot', '/');
            //console.log(response)
        } catch (error) {
            console.error('ERROR EN LA CONEXION', error)
        }
    }

    return (
        <Container className={classes.container} style={{ marginTop: '20px' }}>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
                Detail of Device:<b> {deviceid}</b>
            </Typography>

            <h3>TimeInstant:  <span>{timeSt}</span></h3>
            <h3>Relative Humidity: <span>{temperature}</span></h3>
            <h3>Temperature: <span>{humidity}</span></h3>

            {//<h3>Start: <span>{device?.start.type} </span></h3>
                //<h3>Stop: <span>{device?.start.value} </span></h3>
                //<h3>Interval: <span>{device?.start.value} </span></h3>
            }

            {/*<Button variant="contained" color="primary" onClick={sendDataAgent}>
                SEND data IoT-Agent
            </Button>*/}

            <Button variant="contained" color="primary" onClick={startDevice}>
                Start Device
            </Button>

            <Button
                variant="contained"
                style={{ color: 'white', backgroundColor: '#b72c2c' }}
                onClick={stopDevice}>
                Stop Device
            </Button>

            {//<Line data={chartData} options={chartOptions} />
}


        </Container>
    );
};

export default DetailDevice;
