// src/components/Register.js
import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import fiwareService from '../services/fiwareService';

const Register = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    id: '',
    type: 'TemperatureSensor', // Tipo específico para un sensor de temperatura
    temperature: '', // Campo específico para la temperatura
    // Agrega otros campos según tus necesidades
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDeviceInfo({ ...deviceInfo, [name]: value });
  };

  const handleRegisterDevice = async () => {
    try {
      // Registra el dispositivo en FIWARE
      const fiwareResponse = await fiwareService.registerDeviceFiware(deviceInfo);

      // Puedes realizar acciones adicionales aquí, como registrar en MongoDB

      // Muestra un mensaje de éxito
      console.log('Dispositivo registrado en FIWARE:', fiwareResponse);
      alert('Dispositivo registrado con éxito en FIWARE');
    } catch (error) {
      // Maneja los errores
      console.error('Error al registrar el dispositivo:', error);
      alert('Error al registrar el dispositivo');
    }
  };

  return (
    <div>
      <h2>Registro de Dispositivo</h2>
      <form>
        <TextField
          label="ID del Dispositivo"
          name="id"
          value={deviceInfo.id}
          onChange={handleInputChange}
        />
        <TextField
          label="Temperatura"
          name="temperature"
          value={deviceInfo.temperature}
          onChange={handleInputChange}
        />
        {/* Agrega otros campos del formulario según tus necesidades */}
        <Button variant="contained" color="primary" onClick={handleRegisterDevice}>
          Registrar Dispositivo
        </Button>
      </form>
    </div>
  );
};

export default Register;
