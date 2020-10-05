let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("calculator.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

const server = new grpc.Server();
const SERVER_ADDRESS = "0.0.0.0:5000";

const getResult = ({request}, callback) => {
  console.log(request);
  const {operator, num1, num2} = request;
  let result = 0;
  if(operator === '*') {
    result = num1 * num2;
  } else if(operator === '/') {
    result = num1 / num2;
  } else if(operator === '+') {
    result = num1 + num2;
  } else if(operator === '-') {
    result = num1 - num2;
  }
  console.log(`Result: ${result}`);
  callback(null, {result});
}

server.addService(proto.Calculator.service, { getResult });
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
server.start();