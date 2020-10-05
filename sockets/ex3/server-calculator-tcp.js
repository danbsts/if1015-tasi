const net = require('net')
const readline = require('readline')
const { unmarshallOperation, marshallResult } = require('./marshalling');

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

const handleConnection = socket => {
  console.log('Conectaram')
  socket.on('end', () => {
    console.log('Desconectaram')
    console.log('Desconectando')
  })
  socket.on('data', message => {
    const data = unmarshallOperation(message).split(' ');
    console.log(data);
    socket.write(marshallResult(calculate(data[0], data[1], data[2])))
  })
}

const server = net.createServer(handleConnection)

const start = () => {
  rl.question('Que porta devo escutar?\n', (answer) => {
    if (!isNaN(answer)) {
      server.listen(answer, '0.0.0.0')
      rl.close()
    } else {
      start()
    }
  })
}

start()
