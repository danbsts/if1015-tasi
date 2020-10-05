const net = require('net')
const readline = require('readline')
const client = new net.Socket()
let username

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const handleConnection = socket => {
  console.log('Conectaram')
  socket.on('end', () => {
    console.log('Desconectaram')
    console.log('Desconectando')
    client.end()
    server.close()
    rl.close()
  })
  socket.on('data', data => {
    const str = data.toString()
    console.log(str)
  })
}

const server = net.createServer(handleConnection)

const connect = (port) => {
  client.connect(port, '127.0.0.1', () => {
    console.log('conectou')
    rl.addListener('line', line => {
      if(line === 'end') {
        client.emit('end')
        console.log('Desconectando')
        client.end()
        server.close()
      } else {
        client.write(line)
      }
    })
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

const listenTo = () => {
  rl.question('Que porta devo escutar?\n', (answer) => {
    if (!isNaN(answer)) {
      server.listen(answer, '127.0.0.1')
      connectTo()
    } else {
      listenTo()
    }
  })
}


const start = () => {
  rl.question('Qual seu nome?\n', (name) => {
    username = name
    listenTo()
  })
}

start()
