let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var readline = require("readline");
 
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
 
var proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("calculator.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);
 
const REMOTE_SERVER = "0.0.0.0:5000";
const client = new proto.Calculator(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);

rl.addListener('line', (line) => {
  const splittedLine = line.split(' ');
  const request = {
    operator: splittedLine[0],
    num1: +splittedLine[1],
    num2: +splittedLine[2],
  }
  client.getResult(request, (err, data) => {
    if(err) {
      console.error('Error');
      return;
    }
    console.log(data.result);
  })

});

