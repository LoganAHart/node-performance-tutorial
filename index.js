process.env.UV_THREADPOOL_SIZE = 1;
//typically all forked children would have 4 threads available in their
//thread pool, reducing to one thread to simplify benchmarking results
const cluster = require('cluster');

// is the file being executed in master mode?
if (cluster.isMaster) {
  // Causes index.js to be executed *again* but in child mode...
  cluster.fork();
} else {
  // This is the child, and will act as a server...
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
}
