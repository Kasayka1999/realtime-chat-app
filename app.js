const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

const messageStore = [];

app.get('/', (req, res) => {
  // Handles HTTP GET requests to the root URL.
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    // Handles real-time chat connections and messages.
    socket.emit('chat history', messageStore.map(message => message.text));


  socket.on('chat message', (msg) => {
    // Handles incoming chat messages.
    const timestamp = new Date();
    const message = { text: msg, timestamp };

    messageStore.push(message);
    io.emit('chat message', msg); // Send msg instead of message

    setTimeout(() => {
      // Delays removal of a message.
      const index = messageStore.indexOf(message);
      if (index !== -1) {
        messageStore.splice(index, 1);
      }
    }, 2 * 60 * 60 * 1000); // Remove message after 2 hours
  });
});

http.listen(PORT, () => {
  // Listens to incoming requests from clients at the specified PORT and logs listening
  // status to console.
  console.log(`listening on *:${PORT}`);
});
