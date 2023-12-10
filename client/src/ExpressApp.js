const express = require('express');

function makeExpressApp(config, mqttClient) {
  const app = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json(config);
  });

  app.post('/:cmd', (req, res) => {
    const { cmd } = req.params;
    const topic = `from/${config.MQTT_CLIENT_ID}/${cmd}`;
    const payload = req.body || {};
    mqttClient.publish(topic, payload);
    res.json({ ok: true });
  });

  return app;
}

module.exports = {
  makeExpressApp,
};
