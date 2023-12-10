const { makeConfig } = require('./config');
const { MqttServer } = require('./MqttServer');
const { NetServer } = require('./NetServer');
const { makeExpressApp } = require('./ExpressApp');

async function factory() {
  const config     = makeConfig();
  const app        = makeExpressApp(config);
  const mqttServer = new MqttServer(config);
  const netServer  = new NetServer(config, mqttServer);

  return {
    app,
    config,
    mqttServer,
    netServer,
  };
}

module.exports = {
  factory,
};
