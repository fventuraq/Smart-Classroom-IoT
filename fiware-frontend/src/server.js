const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configuración de CORS para Express
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Configuración de CORS para Socket.io
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  },
});

const PORT = 5000;

app.use(bodyParser.json());

// Ruta para recibir notificaciones de Fiware Orion
app.post('/notify', (req, res) => {
  const notificationData = req.body;
  // Aquí puedes procesar la notificación como desees, por ejemplo, transmitirla a tu aplicación React
  console.log('Notificación recibida:', notificationData);

  // Emitir un evento 'notification' con los datos al cliente
  io.emit('notification', notificationData);

  res.status(200).send('Notificación recibida');
});

server.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
