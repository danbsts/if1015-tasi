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

const send = ({request}) => {
  const {user, message} = request;
  console.log(`${user}: ${message}`);
}


rl.question('Digite os seguintes parametros separados por espaco:\n[porta de conexao] [porta para escutar] [nome usuario]\n', (line) => {
  const splittedLine = line.split(' ');
  const connectPort = splittedLine[0];
  const listenPort = splittedLine[1];
  const user = splittedLine[2];

  const client = new proto.Chat(
    `0.0.0.0:${connectPort}`,
    grpc.credentials.createInsecure()
  );
  const server = new grpc.Server();
  server.addService(proto.Chat.service, { send });
  server.bind(`0.0.0.0:${listenPort}`, grpc.ServerCredentials.createInsecure());
  server.start();
  
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