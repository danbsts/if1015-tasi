let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var readline = require("readline");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

const client = new proto.Chat(
  `0.0.0.0:5000`,
  grpc.credentials.createInsecure()
);

let user;

rl.question('Digite o seu nome de usuario:\n', (username) => {
  user = username;
  const channel = client.join({ user });
  channel.on('data', (data) => {
    const { user, message } = data;
    console.log(`${user}: ${message}`);
  });
  rl.addListener('line', (line) => {
    const request = {
      user,
      message: line,
    }
    client.send(request, (err, data) => {
      if(err) {
        console.error(err);
        return;
      }
    })
  
  });
})