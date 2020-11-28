var WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ port: 8080, path: "/chat" });

let eventResponse = [];
var http = require("http");
http
  .createServer(function (req, res) {
    res.writeHeader(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    console.log("new in");
    res.on("close", () => {
      eventResponse = eventResponse.filter((r) => r === res);
    });
    eventResponse.push(res);
    res.write('data: Welcome to the chat. (read-only)\n\n')
  })
  .listen(9090);
console.log("SSE-Server started!");

const broadcast = (message) => {
  eventResponse.forEach((res) => res.write(`data: ${message}\n\n`));
  wss.clients.forEach((socket) => {
    socket.send(message);
  });
};

wss.on("connection", function (ws) {
  ws.on("message", function (message) {
    if (ws.nickname == undefined) {
      ws.nickname = message;
      broadcast(`${message} joined the server.`);
    } else {
      broadcast(`${ws.nickname}: ${message}`);
    }
  });

  ws.on("close", () => {
    broadcast(`${ws.nickname} left the server.`);
  });

  console.log("new connection");
  ws.send("Welcome to chat :D\nPlease tell us your nickname");
});
