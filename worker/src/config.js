require('dotenv').config();

function makeConfig(penv = process.env) {
  let {
    HTTP_PORT      = '9090',
    MQTT_URL       = 'mqtt://127.0.0.1:1883',
    MQTT_CLIENT_ID = 'worker1',
    MQTT_TOPIC     = 'from/#',
  } = penv;

  HTTP_PORT = parseInt(HTTP_PORT, 10);

  return {
    HTTP_PORT,
    MQTT_URL,
    MQTT_CLIENT_ID,
    MQTT_TOPIC,
  }
}

module.exports = {
  makeConfig,
};
