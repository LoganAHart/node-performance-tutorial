// node myFile.js

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// New timers, tasks, and operations are recorded from myFile running
myFile.runContents();

function shouldContinue() {
  // Check one: Any pending setTimeout, setInterval, setImmediate?
  // Check two: Any pending OS tasks? (e.g. server listening to port)
  // Check three: Any pending long running operations? (e.g. fs module)
  return pendingTimers.length || pendingOSTasks.length || pendingOperations.length;
}

// Entire body executes in one 'tick'
while (shouldContinue()) {
  // 1) Node looks at pendingTimers: are any pending functions ready to be called? (setTimeout, setInterval)
  // 2) Node looks at pendingOSTasks and pendingOperations: calls relevant callbacks
  // 3) Pause execution. Continues when..
    // - a new pendingOSTask is done
    // - a new pendingOperation is done
    // - a timer is about to complete
  // 4) Look at pendingTimers. Call any setImmediate.
  // 5) Handle any 'close' events (e.g. readStream.on('close', () => {'Cleanup code'})...)
}

// exit back to terminal
