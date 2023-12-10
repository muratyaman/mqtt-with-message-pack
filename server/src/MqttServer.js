const aedes = require('aedes');

class MqttServer {

  constructor(config) {
    this.config = config;

    this._server = aedes({
      // options
    });

    this._server.on('clientError', this.onClientError.bind(this));
    this._server.on('connectionError', this.connectionError.bind(this));
    this._server.on('client', this.onClient.bind(this));
    //this._server.on('publish', this.onPublish.bind(this));
    this._server.on('subscribe', this.onSubscribe.bind(this));
    this._server.on('unsubscribe', this.onUnsubscribe.bind(this));
  }

  connectionError(client, err) {
    console.debug('MqttServer: connectionError', client, err.message, err.stack);
  }

  onClientError(err, client) {  
    console.debug('MqttServer: clientError', client.id, err.message, err.stack);
  }

  onClient(client) {
    console.debug('MqttServer: client', client.id);
  }

  // subscribe client to queue on behalf of client
  async onSubscribe(subscriptions, client) {
    console.debug('MqttServer: subscribe', subscriptions, client.id);
    //if (String(client.id).startsWith('worker')) return; // ignore our worker apps
  }

  onUnsubscribe(topics, client) {
    console.debug('MqttServer: unsubscribe', topics, client.id);
    //if (String(client.id).startsWith('worker')) return; // ignore our worker apps
  }

}

module.exports = {
  MqttServer,
};
