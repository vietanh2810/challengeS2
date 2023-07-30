const request = require('supertest');
const WebSocket = require('ws');
const app = require('../server');

describe('Express App', () => {
    let server;

    beforeAll(() => {
        // Start the Express server before running the tests
        server = app.listen(3000);
    });

    afterAll((done) => {
        // Close the server and terminate WebSocket connections after the tests
        server.close(() => {
            done();
        });
    });

    it('should respond with "Hello, World!" when accessing the root endpoint', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello, World!');
    });

    it('should establish a WebSocket connection', (done) => {
        // Create a WebSocket client
        const ws = new WebSocket('ws://localhost:3000');

        ws.on('open', () => {
            // WebSocket connection should be open
            expect(ws.readyState).toBe(ws.OPEN);
            ws.close();
            done();
        });
    });

    it('should receive and respond to WebSocket messages', (done) => {
        const ws = new WebSocket('ws://localhost:3000');

        ws.on('open', () => {
            // WebSocket connection should be open
            expect(ws.readyState).toBe(ws.OPEN);

            const testData = { message: 'Hello WebSocket' };

            ws.on('message', (message) => {
                // Check if the received message is as expected
                const parsedMessage = JSON.parse(message);
                expect(parsedMessage).toEqual(testData);

                // Close the WebSocket connection after receiving the expected message
                ws.close();
                done();
            });

            // Send a test message to the server
            ws.send(JSON.stringify(testData));
        });
    });

    // Add more test cases for other endpoints and WebSocket functionalities as needed
});
