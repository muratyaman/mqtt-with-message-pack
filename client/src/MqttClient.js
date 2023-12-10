const { randomUUID: uuid } = require('crypto');
const mqtt = require('mqtt');
const { encode, decode } = require('@msgpack/msgpack');

class MqttClient {

  constructor(config) {
    this.config = config;
    this._client = mqtt.connect(config.MQTT_URL, {
      clientId: config.MQTT_CLIENT_ID,
    });

    this._client.on('connect', this.onConnect.bind(this));
    this._client.on('message', this.onMessage.bind(this));
  }

  onConnect() {
    this._client.subscribe(this.config.MQTT_TOPICS, { qos: 1 }, (err) => {
      if (err) {
        console.error('error subscribing to topic', err);
      } else {
        console.info('subscribed to topics', this.config.MQTT_TOPICS);
      }
    });
    this.publishTimer();
  }

  publish(topic, payload = {}) {
    const _payload = { ts: new Date().toISOString(), id: uuid(), ...payload };
    console.log('MQTT: publishing', { topic, _payload });
    const buffer = Buffer.from(encode(_payload));
    this._client.publish(topic, buffer, { qos: 1 }, (err) => {
      if (err) {
        console.error('error publishing message', err);
      } else {
        console.info('published');
      }
    });
  }

  publishTimer() {
    const topic = `from/${this.config.MQTT_CLIENT_ID}/timer`;
    this.publish(topic);
  }

  onMessage(topic, messageBuffer) {
    console.log('MQTT: onMessage', { topic, messageBuffer });
    const payload = decode(messageBuffer);
    console.log('MQTT: onMessage', { topic, payload });
  }

}

module.exports = {
  MqttClient,
};
