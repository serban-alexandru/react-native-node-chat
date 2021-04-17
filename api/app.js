const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
require('dotenv/config');
const apiRoutes = require('./routes/api');
const cors = require('cors');

// Socket io
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

app.use(express.json());
app.use('/', apiRoutes);
app.use(cors());

// auth routes 
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// -> friends
// -> chats
// -> /chats/{id}
// -> login 
// -> register

// connect to db 
mongoose.connect(process.env.DB_CONNECTION, 
  { useNewUrlParser: true, useUnifiedTopology: true }, 
  () => {
    console.log('Connected to db');
  }
  );

server.listen(3000, () => {
  console.log('listening on *:3000');
});