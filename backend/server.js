// server.js

const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const tagRoutes = require('./routes/tagRoutes');
const userController = require('./controllers/userController');
const WebSocket = require('ws');
const expressWs = require('express-ws'); // Import express-ws library

const PORT = process.env.PORT || 8080;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// synchronizing the database and forcing it to false so we don't lose data
db.sequelize.sync({ force: true }).then(() => {
    console.log("db has been re-synced");

    userController.createDefaultAdmin();
});

app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes);

// Create an HTTP server using Express
const server = app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    // WebSocket message event handler
    ws.on('message', (message) => {
        console.log('Received message:', message);

        // Parse the incoming JSON data
        let eventData;
        try {
            eventData = JSON.parse(message);
            console.log('Parsed message:', eventData)
        } catch (error) {
            console.error('Error parsing incoming message:', error);
            return;
        }

        // Handle the incoming WebSocket event (e.g., store it in the database)
        // You can call a function here to handle the incoming WebSocket event
        // For example, eventController.handleWebSocketEvent(eventData);

        // You can also broadcast the event to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(message);
            }
        });
    });

    // WebSocket close event handler
    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});
