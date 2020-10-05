const net = require('net')
const readline = require('readline')
const { marshallOperation, unmarshallResult } = require('./marshalling');
const client = new net.Socket()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const connect = (port) => {
  client.connect(port, '0.0.0.0', () => {
    console.log('Conectado')
    rl.addListener('line', line => {
      if(line === 'end') {
        client.emit('end')
        console.log('Desconectando')
      } else {
        client.write(marshallOperation(line))
      }
    })
  })
  client.on('data', (data) => {
    console.log(unmarshallResult(data))
  })
  client.on('end', () => {
    client.end()
    rl.close()
  })
}

const start = () => {
  rl.question('Digite a porta que deseja se conectar\n', (answer) => {
    if (!isNaN(answer)) {
      connect(answer)
    } else {
      start()
    }
  })
}

start()
