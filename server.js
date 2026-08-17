const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
app.use(express.static('public')); 

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message, isBinary) => {
    if (isBinary) { // รับภาพจาก ESP32 แล้วส่งให้ iPhone
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) client.send(message, { binary: true });
      });
    } else { // รับคำสั่งจาก iPhone แล้วส่งให้ ESP32
      const command = message.toString();
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) client.send(command);
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
