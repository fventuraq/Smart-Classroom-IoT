// src/components/CampusList.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import fiwareService from '../../services/fiwareService';

const ListCampusUniversity = () => {
  const { iduniversity } = useParams();
  const [campusList, setCampusList] = useState([]);

  useEffect(() => {
    // Obtener la lista de campus para la universidad específica desde FIWARE
    const fetchCampusList = async () => {
      try {
        const response = await fiwareService.getCampusListByUniversityId(iduniversity);
        setCampusList(response || []);
      } catch (error) {
        console.error('Error al obtener la lista de campus:', error);
      }
    };

    fetchCampusList();
  }, [iduniversity]);

  return (
    <div>
      <Typography variant="h4">Campus List for University <b>{iduniversity}</b></Typography>
      <ul>
        {campusList?.map((campus) => (
          <li key={campus.id}>{campus.name.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListCampusUniversity;
