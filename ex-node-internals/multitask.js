const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const start = Date.now();

function doRequest() {
  https.request('https://www.google.com', res => {
    res.on('data', () => {});
    res.on('end', () => {
      console.log('HTTP:', Date.now() - start);
    });
  }).end();
}

function doHash() {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('Hash:', Date.now() - start);
  });
}

doRequest();

fs.readFile('multitask.js', 'utf8', () => {
  console.log('FS:', Date.now() - start);
});

doHash();
doHash();
doHash();
doHash();


/*
--> with the 4 doHash() calls:
HTTP: 253
Hash: 2687
FS: 2688
Hash: 2697
Hash: 2702
Hash: 2706

--> without the 4 doHash() calls:
FS: 25
HTTP: 244

This behavior: 
The result of node internally making use of the thread pool internally, 
in particular almost everything inside of the fs module (file system module), 
the crypto module also makes use of this thread pool.
The https module on the other hand, makes use of the operating system (OS), and
leverages the OS to do the networking work for us...

Timeline:
--> Call fs.readFile
--> Node gets some 'stats' on the file (requires HD access)
--> HD accessed, stats returned
--> Node requests to read the file
--> HD accessed, file contents streamed back to app
--> Node returns file contents to us
----> Two distinct pauses/times the HD were read.

EXPLANATION:
  why one of the hash console.log appears before the FS console.log:
  -->
  HTTPS module does not make use of thread pool, FS module call delayed because
  of the way the thread pool works, our four threads handle FS, HASH calls 1 to 3 
  --> 
  after FS thread 1 reaches out to HD, it switches tasks to work on HASH call #4, 
  thread 2 finishes it's hash call #1, 
  --> 
  we see console log for hash call 1. It then switches to working on 
  returned stats from the initial FS module call, 
  thread two processes the stats/finishes 
  --> 
  we see console log for FS module call, followed by the remaining hash calls.
  --> 
follow-up questions: 
  What happens if we increase thread pool size 5?
    --> The 5th thread is now entirely dedicated to the FS module function call/working
    with the hard drive and doing whatever it needs to do, so it (FS) finishes first. The 
    order is now FS, HTTP, HASH1, HASH2, HASH3, HASH4
    --> 
  What if we decrease the thread pool size to 1?
    --> the initial work on FS is initiated, thread switches to hash calls, order is now
    HTTP, HASH1, HASH2, HASH3, HASH4, FS

TLDR - you have to understand:
  HTTP module does not work with the thread pool, 
  the FS module and crypto module pbkdf2 function work with the thread pool.
  The thread pool by default has 4 threads available to it.
*/
