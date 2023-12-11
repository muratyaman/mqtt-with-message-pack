# mqtt-with-message-pack

Demo MQTT server and client using MessagePack for payloads.

Sample MQTT server, MQTT worker and MQTT client to use MessagePack for better usage of network bandwidth.

[MQTT](https://en.wikipedia.org/wiki/MQTT) is the de facto protocol for [IoT](https://en.wikipedia.org/wiki/Internet_of_things) systems to exchange messages.

[MessagePack](https://msgpack.org/) does not get the attention it deserves. IMHO, it is much better than [Protocol Buffers](https://protobuf.dev/).

* Flexibility: you don't have to define a schema and generate code for it. It's like JSON!
* Adaptability: when we have IoT environment with many devices and (possibly) with different firmware versions; you cannot force upgrade all of them, if you make changes in the data structures of messages. In server environment (where you have full control), you may consider more strict alignment using rigid protocols like gRPC, and you can upgrade all codebases.

It's worth checking the serialisation methods https://en.wikipedia.org/wiki/Comparison_of_data-serialization_formats.

Good read: https://medium.com/@hugovs/the-need-for-speed-experimenting-with-message-serialization-93d7562b16e4

Benchmarks: https://github.com/endel/msgpack-benchmark

## requirements

[Node v18.x](https://nodejs.org/en)

We use:

* [aedes](https://www.npmjs.com/package/aedes) as MQTT server library
* [mqtt](https://www.npmjs.com/package/mqtt) as MQTT client library
* [@msgpack/msgpack](https://www.npmjs.com/package/@msgpack/msgpack) as payload serialisation library
* [dotenv](https://www.npmjs.com/package/dotenv) to process `.env` files.

Check [msgpackr](https://www.npmjs.com/package/msgpackr), it seems faster!

## components

CLIENT subscribes to MQTT server topics like `to/<clientId>/text` etc.; publishes to topics like `from/<clientId>/text`. Also, HTTP interface `POST <host>/<command>` like `POST <host>/text` makes it easier to test publishing messages. `<command>` is a topic suffix.

SERVER acts is a simple MQTT server.

WORKER subscribes to topics `from/#` on MQTT server; publishes messages to topics `to/<clientId>/confirm`:

Sample payload using MessagePack:

```json
{
  "ts": "<appends new Date()>",
  "id": "<appends crypto.randomUUID()>"
}
```

Folders:

```plain
client/
  src/
    index.js

server/
  src/
    index.js

worker/
  src/
    index.js
```

## tests

```sh
# Terminal 1
cd server
npm i
cp .sample.env .env
# edit .env file
npm run start

# Terminal 2
cd worker
npm i
cp .sample.env .env
# edit .env file
npm run start

# Terminal 3: start client 1
cd client
npm i
cp .sample.env .env
# edit .env file
npm run start:1
# or:
# npm run start

# Terminal 4: start client 2
cd client
npm run start:2
```

## TODO

* read and send binary files
