const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const readline = require("readline");

const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

let users = [];

const broadcast = (user, message) => {
  console.log(`${user}: ${message}`);
  users
    .filter(({ request }) => request.user != user)
    .forEach(serverStream => serverStream.write({ user, message }));
}

const join = (call) => {
  const user = call.request.user;
  broadcast('Server', `${user} conectou.`);
  users.push(call);

  call.on('cancelled', () => {
    broadcast('Server', `${user} saiu.`);
    users = users.filter(({ request }) => request.user != user);
  });
  call.write({ user: 'Server', message: `--- Bem-vindo ao chat! ---\nAtualmente tem ${users.length} clientes conectados.`});
}

const send = (call) => {
  const user = call.request.user;
  const message = call.request.message;
  broadcast(user, message);
}

const server = new grpc.Server();
server.addService(proto.Chat.service, { join, send });
server.bind(`0.0.0.0:5000`, grpc.ServerCredentials.createInsecure());
server.start();