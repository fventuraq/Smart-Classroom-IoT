// src/components/CampusList.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';
import fiwareService from '../../services/fiwareService';
import iotAgentService from '../../services/iotAgentService';

const DetailDevice = () => {
    const { iddevice } = useParams();
    const [device, setDevice] = useState([]);
    const key = '4jggokgpepnvsb2uv4s40d59ov'
    const deviceid = 'device906'

    useEffect(() => {
        // Obtener la lista de campus para la universidad específica desde FIWARE
        const fetchDevice = async () => {
            try {
                console.log('iddevice:  ', iddevice)
                const response = await fiwareService.getDeviceById(iddevice, 'openiot', '/');
                console.log('la respuesta es ...', response)
                setDevice(response);
            } catch (error) {
                console.error('Error al obtener el Device:', error);
            }
        };

        fetchDevice();
    }, []);

    const sendDataAgent = async () => {                

        let data = {
            temperature: 50,
            humidity: 10
        }

        try {
            
            const response = await iotAgentService.sendDataAgent(data, key, iddevice, 'openiot', '/');
            console.log(response)
        } catch (error) {
            console.error('ERROR EN LA CONEXION', error)
        }
    };

    const startDevice = async () => {

        console.log('iddevice2222:  ', iddevice)

        let data = {
            start: {
                type: 'command',
                value: ''
            }
        };
        
        try {
            const response = await fiwareService.startDevice(data, iddevice, 'openiot', '/');
            console.log(response)
        } catch (error) {
            console.error('ERROR EN LA CONEXION', error)
        } 

    }

    return (
        <div>
            <Typography variant="h4">Detail of Device:<b> {device?.id}</b></Typography>

            <h3>TimeInstant:  <span>{device?.TimeInstant}</span></h3>
            <h3>Relative Humidity: <span>{device?.relativeHumidity}</span></h3>
            <h3>Temperature: <span>{device?.temperature}</span></h3>

            {//<h3>Start: <span>{device?.start.type} </span></h3>
                //<h3>Stop: <span>{device?.start.value} </span></h3>
                //<h3>Interval: <span>{device?.start.value} </span></h3>
            }

            <Button variant="contained" color="primary" onClick={sendDataAgent}>
                SEND data IoT-Agent
            </Button>

            <Button variant="contained" color="primary" onClick={startDevice}>
                Start Device
            </Button>

        </div>
    );
};

export default DetailDevice;
