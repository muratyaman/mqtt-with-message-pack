const { randomUUID } = require('crypto');
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
    this._client.subscribe(this.config.MQTT_TOPIC, { qos: 1 }, (err) => {
      if (err) {
        console.error('error subscribing to topic', err);
      } else {
        console.info('subscribed to topic', this.config.MQTT_TOPIC);
      }
    });
  }

  publish(topic, payload = {}) {
    const _payload = { ts: new Date().toISOString(), id: randomUUID(), ...payload };
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

  onMessage(topic, messageBuffer) {
    console.log('MQTT: onMessage', { topic, messageBuffer });
    const payload = decode(messageBuffer);
    console.log('MQTT: onMessage', { topic, payload });
    const { id } = payload;
    const [_from, senderClientId, cmd] = topic.split('/'); // 'from/1234567890abcdef/timer'
    if (id && senderClientId) {
      // send confirmation for all messages - just for testing
      const topic = `to/${senderClientId}/confirm`;
      const payloadOut = { id, ts: new Date().toISOString(), msg: 'we received ' + id };
      console.log('MQTT: publishing confirmation', { topic, payloadOut });
      this.publish(topic, payloadOut);
    }
    // TODO: implement some commands
    // switch (cmd) {
    //   case 'text':
    //     const { text, to } = payload;
    //     this.publish(`to/${to}/text`, { text, from: senderClientId });
    //     break;
    // }
  }

}

module.exports = {
  MqttClient,
};
