// src/services/fiwareService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:1026';  // Reemplaza con la URL de tu Context Broker

const fiwareService = {
    // ... otras funciones

    getStatusOrion: async () => {
        const BASE_URL_STATUS = `${BASE_URL}/version`
        try {
            const response = await axios.get(BASE_URL_STATUS, { crossdomain: true });
            return response.data
        } catch (error) {
            console.error('Error al crear la entidad en FIWARE:', error.message);
            throw error;
        }
    },

    updateDeviceStatus: async (deviceId, newStatus) => {
        try {
            await axios.patch(`${BASE_URL}/entities/${deviceId}/attrs/status`, {
                value: newStatus,
                type: 'Text',
            });
        } catch (error) {
            console.error(`Error al actualizar el estado del dispositivo ${deviceId}:`, error);
            throw error;
        }
    },

    registerDeviceFiware: async (deviceInfo) => {
        try {
            const response = await axios.post(BASE_URL, {
                id: deviceInfo.id,
                type: deviceInfo.type,
                temperature: {
                    value: deviceInfo.temperature,
                    type: 'Number',
                },
                // Agrega otros campos según tus necesidades
            });

            return response.data;
        } catch (error) {
            console.error('Error al registrar el dispositivo en FIWARE:', error);
            throw error;
        }
    },

    registerEntityFiware: async (entityInfo) => {
        const BASE_URL_ENTITY = `${BASE_URL}/v2/entities`
        try {
            const response = await axios.post(BASE_URL_ENTITY, entityInfo);
            return response.data;
        } catch (error) {
            console.error('Error al crear la entidad en FIWARE:', error.message);
            throw error;
        }
    },

    getEntitiesByType: async (entityType) => {
        const BASE_URL_GET_ENTITIES = `${BASE_URL}/v2/entities?type=${entityType}`
        try {
            const response = await axios.get(BASE_URL_GET_ENTITIES, { crossdomain: true });
            return response.data
        } catch (error) {
            console.error(`Error al traer las entidades tipo ${entityType}`, error.message);
            throw error;
        }
    },
    getEntitiesIoTAgentByType: async (entityType, fiwareService, fiwareServicePath) => {
        const BASE_URL_GET_ENTITIES = `${BASE_URL}/v2/entities?type=${entityType}`;
        const headers = {
            'fiware-service': fiwareService,
            'fiware-servicepath': fiwareServicePath,
        };

        try {
            const response = await axios.get(BASE_URL_GET_ENTITIES, { headers, crossdomain: true });
            return response.data;
        } catch (error) {
            console.error(`Error al traer las entidades tipo ${entityType}`, error.message);
            throw error;
        }
    },
    getDeviceById: async (iddevice, fiwareService, fiwareServicePath) => {
        //http://localhost:1026/v2/entities/urn:ngsi-ld:Device:001?type=Device&options=keyValues
        const BASE_URL_GET_ENTITIES = `${BASE_URL}/v2/entities/${iddevice}?type=Device&options=keyValues`;
        const headers = {
            'Content-Type': 'application/json',
            'fiware-service': fiwareService,
            'fiware-servicepath': fiwareServicePath,
        };

        try {
            const response = await axios.get(BASE_URL_GET_ENTITIES, { headers, crossdomain: true });
            return response.data;
        } catch (error) {
            console.error(`Error al traer el Device ${iddevice}`, error.message);
            throw error;
        }
    },
    getUniversityById: async (universityId) => {
        const BASE_URL_GET_ENTITIES = `${BASE_URL}/v2/entities?type=Universidade&refAndar=${universityId}`
        try {
            const response = await axios.get(BASE_URL_GET_ENTITIES, { crossdomain: true });
            return response.data
        } catch (error) {
            console.error(`Error al traer las entidades tipo ${universityId}`, error.message);
            throw error;
        }
    },
    getCampusById: async (campusId) => {
        const BASE_URL_GET_ENTITIES = `${BASE_URL}/v2/entities?type=Campos&refAndar=${campusId}`
        try {
            const response = await axios.get(BASE_URL_GET_ENTITIES, { crossdomain: true });
            return response.data
        } catch (error) {
            console.error(`Error al traer las entidades tipo ${campusId}`, error.message);
            throw error;
        }
    },
    getAndarById: async (andarId) => {
        const BASE_URL_GET_ENTITIES = `${BASE_URL}/v2/entities?type=Andar&refAndar=${andarId}`
        try {
            const response = await axios.get(BASE_URL_GET_ENTITIES, { crossdomain: true });
            return response.data
        } catch (error) {
            console.error(`Error al traer las entidades tipo ${andarId}`, error.message);
            throw error;
        }
    },
    getSalaById: async (salaId) => {
        const BASE_URL_GET_ENTITIES = `${BASE_URL}/v2/entities?type=Andar&refAndar=${salaId}`
        try {
            const response = await axios.get(BASE_URL_GET_ENTITIES, { crossdomain: true });
            return response.data
        } catch (error) {
            console.error(`Error al traer la entidade tipo ${salaId}`, error.message);
            throw error;
        }
    },
    getCampusListByUniversityId: async (universityId) => {

        const BASE_URL_GET_CAMPUS_UNI = `${BASE_URL}/v2/entities?type=Campos&refAndar=${universityId}`
        try {
            const response = await axios.get(BASE_URL_GET_CAMPUS_UNI);
            return response.data;
        } catch (error) {
            console.error(`Error al traer los campues de la universidad ${universityId}`, error.message);
            throw error;
        }
    },
    /*startDevice: async (data, deviceid, fiwareService, fiwareServicePath) => {
        console.log('mi data', data)
        console.log('mi device id', deviceid, fiwareService, fiwareServicePath)
        const headers = {
            'Content-Type': 'application/json',
            'fiware-service': fiwareService,
            'fiware-servicepath': fiwareServicePath,
        };

        const BASE_URL_GET_STAR_DEVICE= `${BASE_URL}/v2/entities/${deviceid}/attrs?type=Device`
        console.log('mi ruta', BASE_URL_GET_STAR_DEVICE)
        try {
            const response = await axios.patch(BASE_URL_GET_STAR_DEVICE, data, { headers });
            return response;
        } catch (error) {
            console.error('Error al crear la entidad en FIWARE:', error.message);
            throw error;
        }
    },*/
    startDevice: async (data, deviceid, fiwareService, fiwareServicePath) => {
        console.log('mi data', data)
        console.log('mi device id', deviceid, fiwareService, fiwareServicePath)
        const headers = {
            'Content-Type': 'application/json',
            'fiware-service': fiwareService,
            'fiware-servicepath': fiwareServicePath,
        };
    
        const BASE_URL_UPDATE_DEVICE = `${BASE_URL}/v2/entities/${deviceid}/attrs?type=Device`;
        console.log('mi ruta', BASE_URL_UPDATE_DEVICE);
        
        try {
            const response = await axios.patch(BASE_URL_UPDATE_DEVICE, data, { headers });
            return response;
        } catch (error) {
            console.error('Error al actualizar la entidad en FIWARE:', error.message);
            throw error;
        }
    },   
    
    getTest: async (dato) => {
        console.log("entre al test", dato)
        return { hola: 'hola' }
    }
};

export default fiwareService;
