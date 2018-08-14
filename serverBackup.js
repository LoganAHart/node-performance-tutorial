const express = require('express');
const crypto = require('crypto');
const app = express();

app.get('/', (req, res) => {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    res.send('Mock of work intensive route - crypto.pbkdf2');
  });
});

app.get('/fast', (req, res) => {
  res.send('Mock of faster route, not much work required')
})

app.listen(3000, () => {
  console.log('server listening on port 3000');
});
