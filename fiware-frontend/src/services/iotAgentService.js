import axios from 'axios';

const BASE_URL_4041 = 'http://localhost:3001';
const BASE_URL_7896 = 'http://localhost:3002'

const iotAgentService = {
    // ... otras funciones

    checkConnection: async () => {
        const BASE_URL_STATUS = `${BASE_URL_4041}/version`;  // Cambia la URL base y agrega el puerto 4041
        try {
            const response = await axios.head(BASE_URL_STATUS, { crossdomain: true });
            console.log('Conexión exitosa con IoT Agent');
            return response;
        } catch (error) {
            console.error('No hay conexión con IoT Agent', error.message);
            throw error;
        }
    },
    registerDevice: async (entityInfo, fiwareService, fiwareServicePath) => {
        const BASE_URL_DEVICE_REGISTER = `${BASE_URL_4041}/iot/devices`
        const headers = {
            'Content-Type': 'application/json',
            'fiware-service': fiwareService,
            'fiware-servicepath': fiwareServicePath,
        };

        try {
            const response = await axios.post(BASE_URL_DEVICE_REGISTER, entityInfo, { headers });
            return response.data;
        } catch (error) {
            console.error('Error al crear la entidad en FIWARE:', error.message);
            throw error;
        }
    },
    registerService: async (entityInfo, fiwareService, fiwareServicePath) => {
        const BASE_URL_DEVICE_REGISTER = `${BASE_URL_4041}/iot/services`
        const headers = {
            'Content-Type': 'application/json',
            'fiware-service': fiwareService,
            'fiware-servicepath': fiwareServicePath,
        };

        try {
            const response = await axios.post(BASE_URL_DEVICE_REGISTER, entityInfo, { headers });
            return response.data;
        } catch (error) {
            console.error('Error al crear la entidad en FIWARE:', error.message);
            throw error;
        }
    },
    getServices: async (fiwareService, fiwareServicePath) => {
        const BASE_URL_SERVICES = `${BASE_URL_4041}/iot/services`;

        const headers = {
            'Content-Type': 'application/json',
            'fiware-service': fiwareService,
            'fiware-servicepath': fiwareServicePath,
        };

        try {
            const response = await axios.get(BASE_URL_SERVICES, { headers });
            console.log('RESPUESTA COMPLETA', response)
            return response.data.services;
        } catch (error) {
            console.error('Error al obtener la lista de servicios:', error.message);
            throw error;
        }
    },
    sendDataAgent: async (data, key, deviceId, fiwareService, fiwareServicePath) => {
        const BASE_URL_SEND_DATA = `${BASE_URL_7896}/iot/json?k=${key}&i=${deviceId}`;  // Agrega el puerto 7896
        const headers = {
            'Content-Type': 'application/json',
            'fiware-service': fiwareService,
            'fiware-servicepath': fiwareServicePath,
        };

        try {
            const response = await axios.post(BASE_URL_SEND_DATA, data, { headers });
            return response.data;
        } catch (error) {
            console.error('Error al enviar datos al IoT Agent:', error.message);
            throw error;
        }
    },
    getTest: async (dato) => {
        console.log("entre al test iot Agent", dato)
        return { hola: 'hola' }
    }
};

export default iotAgentService;