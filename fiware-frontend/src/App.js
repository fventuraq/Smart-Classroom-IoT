// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Devices from './components/Devices';
import Entity from './components/CreateEntity';
import Inicio from './components/Inicio';
import ListEntities from './components/ListEntities';
import ListUniversity from './components/entities/ListUniversity';
import CreateUniversityEntity from './components/entities/NewUniversity';
import CreateCampusEntity from './components/entities/NewCampus';
import ListCampus from './components/entities/ListCampus';
import CreateAndarEntity from './components/entities/NewAndar';
import ListAndares from './components/entities/ListAndares';
import CreateSalaEntity from './components/entities/NewSala';
import ListSalas from './components/entities/ListSalas';
import DetailSala from './components/entities/DetailSala';
import ListCampusUniversity from './components/entities/ListCampusUniversity';

import ListDevices from './components/devices/ListDevices';
import CreateDeviceEntity from './components/devices/NewDevice';
import DetailDevice from './components/devices/DetailDevice';
import ServiceList from './components/services/ListServices';
import CreateService from './components/services/NewService';
import ListSuscriptions from './components/subscriptions/ListSuscriptions';
import CreateSubscription from './components/subscriptions/NewSubscription';
import MyMenu from './components/MyMenu'; // Agrega esta línea para importar el componente Menu

const App = () => {
  return (
    <Router>
      <div>
        {/* Agrega el componente Menu aquí para que se muestre en la interfaz */}
        <MyMenu />

        {/* Configura las rutas para los componentes Register y Devices */}
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/register" element={<Register />} />
          <Route path="/devices/listdevices" element={<ListDevices />} />
          <Route path="/devices/newdevice" element={<CreateDeviceEntity />} />
          <Route path="/devices/:iddevice" element={<DetailDevice />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/services/newservice" element={<CreateService />} />
          <Route path="/newentity" element={<Entity />} />
          <Route path="/entities/university" element={<ListUniversity />} />
          <Route path="/entities/newuniversity" element={<CreateUniversityEntity />} />
          <Route path="/entities/campus" element={<ListCampus />} />
          <Route path="/entities/newcampus" element={<CreateCampusEntity />} />
          <Route path="/entities/andares" element={<ListAndares />} />
          <Route path="/entities/newandar" element={<CreateAndarEntity />} />
          <Route path="/entities/salas" element={<ListSalas />} />
          <Route path="/entities/salas/:idsala" element={<DetailSala />} />
          <Route path="/entities/newsala" element={<CreateSalaEntity />} />
          <Route path="/entities/campus/:iduniversity" element={<ListCampusUniversity />} />
          <Route path="/entities/room" element={<ListEntities />} />
          <Route path="/subscriptions" element={<ListSuscriptions />} />
          <Route path="/subscriptions/newsubscription" element={<CreateSubscription />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;