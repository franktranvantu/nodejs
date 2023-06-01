const messaging = require('./messaging');

// Listen for the 'message' event
messaging.receiveMessage('your_topic_name');

// Listen for the 'message' event emitted by the subscriber
messaging.eventEmitter.on('message', (message) => {
    // Process the received message
    console.log('Received message:', message);
});
