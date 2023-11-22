const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors'); // Agrega esta línea

const app = express();
const port = 3002;

// Usa el middleware de CORS
app.use(cors());

// Configura el middleware de proxy para redirigir las solicitudes al servidor IoT Agent
const proxy = createProxyMiddleware({
  target: 'http://localhost:7896',
  changeOrigin: true,
  ws: true,
});

app.use('/', proxy);

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});