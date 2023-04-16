const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

const messageStore = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.emit('chat history', messageStore.map(message => message.text));


  socket.on('chat message', (msg) => {
    const timestamp = new Date();
    const message = { text: msg, timestamp };

    messageStore.push(message);
    io.emit('chat message', msg); // Send msg instead of message

    setTimeout(() => {
      const index = messageStore.indexOf(message);
      if (index !== -1) {
        messageStore.splice(index, 1);
      }
    }, 2 * 60 * 60 * 1000); // Remove message after 2 hours
  });
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
