// src/components/DeviceMenu.js
import React, { useState, useEffect } from 'react';
import fiwareService from '../services/fiwareService';

const DeviceMenu = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devicesData = await fiwareService.getDevices();
        setDevices(devicesData);
      } catch (error) {
        // Maneja el error según tus necesidades
      }
    };

    // Define la función fetchDevices dentro del useEffect
    fetchDevices();
  }, []); // Este efecto se ejecutará una vez al montar el componente

  const toggleDeviceStatus = async (deviceId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'on' ? 'off' : 'on';
      await fiwareService.updateDeviceStatus(deviceId, newStatus);
      // Vuelve a cargar la lista de dispositivos después de la actualización
      fetchDevices();
    } catch (error) {
      // Maneja el error según tus necesidades
    }
  };

  return (
    <div>
      <h1>Dispositivos Disponibles</h1>
      <ul>
        {devices.map(device => (
          <li key={device.id}>
            {device.type}: {device.id} - Estado: {device.status.value}
            <button onClick={() => toggleDeviceStatus(device.id, device.status.value)}>
              Toggle
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceMenu;
