const cluster = require('cluster');

// is the file being executed in master mode?
if (cluster.isMaster) {
  // Causes index.js to be executed *again* but in child mode...
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  // This is the child, and will act as a server...
  const express = require('express');
  const app = express();

  function doWork(duration) {
    const start = Date.now();
    while(Date.now() - start < duration) {}
  }

  app.get('/', (req, res) => {
    doWork(5000);
    res.send('Work intensive route, takes 5 seconds');
  });

  app.get('/fast', (req, res) => {
    res.send('Faster route, not much work required')
  })

  app.listen(3000, () => {
    console.log('server listening on port 3000');
  });
}
