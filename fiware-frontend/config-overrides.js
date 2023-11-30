const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    // Desactivar escalado de retina
    config.devServer = {
      ...config.devServer,
      scale: 1,
    };

    config.devServer.overlay = false;

    return config;
  }
);
