const express = require('express');
const crypto = require('crypto');
const Worker = require('webworker-threads').Worker;
const app = express();

app.get('/', (req, res) => {
  const worker = new Worker(function() {
    this.onmessage = function() {
      let counter = 0;
      while (counter < 1e9) {
        counter++;
      }
      postMessage(counter);
    }
  });
  worker.onmessage = function(message) {
    console.log(message.data);
    res.send('' + message.data);
  }
  worker.postMessage();
});

app.get('/fast', (req, res) => {
  res.send('Mock of faster route, not much work required')
})

app.listen(3000, () => {
  console.log('server listening on port 3000');
});
