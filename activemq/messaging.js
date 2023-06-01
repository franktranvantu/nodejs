const stompit = require('stompit');
const { EventEmitter } = require('events');

// Create an event emitter to handle message events
const eventEmitter = new EventEmitter();

// Create a STOMP client
const connectOptions = {
    host: 'localhost',
    port: 61613,
    connectHeaders: {
        host: '/',
        login: 'admin',
        passcode: 'admin',
    },
};

// Send a message to the topic
const sendMessage = (topic, message) => {
    stompit.connect(connectOptions, (error, client) => {
        if (error) {
            console.error('Could not connect to ActiveMQ:', error.message);
            return;
        }

        console.log('Connected to ActiveMQ');

        // Create the headers for the message
        const sendHeaders = {
            destination: `/topic/${topic}`,
            'content-type': 'text/plain',
            persistent: 'true',
        };

        // Send the message
        const frame = client.send(sendHeaders);
        frame.write(message);
        frame.end();

        console.log('Message sent');

        // Disconnect from the ActiveMQ broker
        client.disconnect();
    });
}

// Receive messages from the topic
const receiveMessage = topic => {
    stompit.connect(connectOptions, (error, client) => {
        if (error) {
            console.error('Could not connect to ActiveMQ:', error.message);
            return;
        }

        console.log('Connected to ActiveMQ');

        // Subscribe to the topic
        const subscribeHeaders = {
            destination: `/topic/${topic}`,
            ack: 'auto',
        };

        client.subscribe(subscribeHeaders, (error, message) => {
            if (error) {
                console.error('Error subscribing to topic:', error.message);
                return;
            }

            // Convert the message body to a string
            message.readString('utf-8', (error, body) => {
                if (error) {
                    console.error('Error reading message:', error.message);
                    return;
                }

                // Emit the received message as an event
                eventEmitter.emit('message', body);
            });
        });
    });
}

// Export the messaging module
module.exports = {
    sendMessage,
    receiveMessage,
    eventEmitter,
};
