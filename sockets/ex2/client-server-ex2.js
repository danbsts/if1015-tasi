var dgram = require('dgram');
const readline = require('readline')

var socket = dgram.createSocket('udp4');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const connect = (port) => {
  console.log('Digite \"end\" a qualquer momento para finalizar.')
  rl.addListener('line', line => {
    socket.send(line, port)
    if(line === 'end') {
      socket.close()
      rl.close()
    }
  })
}

const connectTo = () => {
  rl.question('Digite a porta que deseja se conectar\n', (answer) => {
    if (!isNaN(answer)) {
      connect(answer)
    } else {
      connectTo()
    }
  })
}

const start = () => {
  rl.question('Que porta devo escutar?\n', (answer) => {
    if (!isNaN(answer)) {
      socket.bind(answer)
      socket.on('message', message => {
        console.log(message.toString());
      }); 
      connectTo()
    } else {
      listenTo()
    }
  })
}

start()
