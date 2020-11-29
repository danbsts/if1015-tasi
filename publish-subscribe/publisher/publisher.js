var amqp = require("amqplib/callback_api");

let processId = 0;
let amqpchannel = null;

amqp.connect("amqp://rabbitmq", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue("idle", {
      durable: true,
      autoDelete: false,
    });
    channel.assertQueue("created", {
      durable: true,
      autoDelete: false,
    });
    channel.assertExchange("process", "fanout", { durable: true });
    channel.bindQueue("created", "process", "create");
    channel.bindQueue("idle", "process", "create");
    amqpchannel = channel;
  });
});

const interval = setInterval(() => {
  amqpchannel.publish(
    "process",
    "create",
    Buffer.from(JSON.stringify({ id: processId, ready: false })),
    {persistent: true}
  );
  processId++;
}, 10000);
