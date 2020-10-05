const net = require('net')
const sockets = []

const broadcast = (sender, message) => {
  console.log(message)
  sockets.forEach(socket => {
    if(socket.nickname && socket.nickname !== sender) {
      socket.write(message)
    }
  })
}

const handleConnection = socket => {
  console.log('Conectaram')
  socket.write('Server: Please tell me your name')

  socket.on('data', data => {
    const message = data.toString()
    if(socket.nickname === undefined) {
      socket.nickname = message;
      broadcast(socket.nickname, 'Server' + ': ' + message + ' joined the server.')
      return;
    }
    if(message === 'end') {
      socket.end()
    }
    broadcast(socket.nickname, socket.nickname + ': ' + message)
  })

  socket.on('end', () => {
    console.log(socket.nickname, 'is leaving')
    broadcast(socket.nickname, 'Server: ' + socket.nickname + ' is leaving')
    socket.end()
    sockets.splice(sockets.indexOf(socket), 1);
  })

  sockets.push(socket)
}

const server = net.createServer(handleConnection)
server.listen(4000, '127.0.0.1')