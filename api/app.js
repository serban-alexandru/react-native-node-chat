const express = require('express');

const app = express();

// routes: 
app.get('/', (req, res) => {
  res.send('We are on home');
}); 
// -> friends
// -> chats
// -> /chats/{id}
// -> login 
// -> register

app.listen(3000);