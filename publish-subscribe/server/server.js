var amqp = require("amqplib/callback_api");
var WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ port: 8080, path: "/orders" });

var amqpChannel = null;

const orders = [];

amqp.connect("amqp://rabbitmq", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue("idle", {
      autoDelete: false,
      durable: true,
    });
    channel.assertQueue("created", {
      autoDelete: false,
      durable: true,
    });
    amqpChannel = channel;
    channel.consume("created", (data) => {
      if (data) {
        const content = data.content.toString();
        console.log("[x] %s", content);
        orders.push(JSON.parse(content));
        wss.clients.forEach((socket) => socket.send(content));
        amqpChannel.ack(data);
      }
    });
  });
});

var readMessageFromQueue = function () {
  if (amqpChannel) {
    amqpChannel.get("idle", null, (_, data) => {
      if (data) {
        const content = data.content.toString();
        console.log("Autorizando: %s", content);
        const newOrder = JSON.parse(content);
        const or = orders.find((o) => o.id === newOrder.id);
        if (or) {
          or.ready = true;
          wss.clients.forEach((socket) => socket.send(JSON.stringify(or)));
        }
        amqpChannel.ack(data);
        return or;
      }
    });
  }
};

wss.on("connection", function (ws) {
  console.log("new connection");
  ws.on("message", () => readMessageFromQueue(ws));
  ws.send(JSON.stringify({ orders }));
});

console.log("Init server");
// Whatever interval you like..
