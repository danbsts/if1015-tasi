var dgram = require('dgram');
const readline = require('readline');
const { unmarshallOperation, marshallResult } = require('./marshalling');

var socket = dgram.createSocket('udp4');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const calculate = (operator, num1, num2) => {
  if(isNaN(num1) || isNaN(num2)) {
    console.log('Not a number')
    return 'Wrong format!'
  }
  const x = +num1, y = +num2
  if(operator === '*') {
    return x * y;
  } else if(operator === '/') {
    return x / y;
  } else if(operator === '+') {
    return x + y;
  } else if(operator === '-') {
    return x - y;
  }
  return 'Wrong format!'
}

const connectTo = () => {
  rl.question('Digite a porta que deseja responder\n', (answer) => {
    if (!isNaN(answer)) {
      socket.on('message', message => {
        const data = unmarshallOperation(message).split(' ');
        console.log(data);
        socket.send(marshallResult(calculate(data[0], data[1], data[2])), answer)
      });
    } else {
      connectTo()
    }
  })
}

const start = () => {
  rl.question('Que porta devo escutar?\n', (answer) => {
    if (!isNaN(answer)) {
      socket.bind(answer)
      connectTo()
    } else {
      start()
    }
  })
}

start()