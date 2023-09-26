const request = require('supertest');
const express = require('express');
const router = require('../../routes/eventRoutes');

const eventController = require('../../controllers/eventController');

// const mockUserAuthMiddleware = jest.fn((req, res, next) => next());

jest.mock('../../middlewares/userAuth', () => ({
    authenticate: jest.fn((req, res, next) => next()),
}));

// jest.mock('../../middlewares/userAuth', () => jest.fn((req, res, next) => next()));

jest.mock('../../controllers/eventController');

const app = express();
app.use(express.json());
app.use('/events', router);

describe('GET /types', () => {
    // it('should return event types with status 200', async () => {
    //     // Mock the eventController.getEventTypes function
    //     const expectedEventTypes = ['event_type_1', 'event_type_2'];
    //     eventController.getEventTypes.mockResolvedValue(expectedEventTypes);

    //     // Perform the GET request
    //     const response = await request(app).get('/events/types');

    //     // Assertions
    //     expect(response.status).toBe(200);
    //     expect(response.body).toEqual(expectedEventTypes);
    //     expect(eventController.getEventTypes).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    // });

    it('should return 500 if there is an error in the controller', async () => {
        // Mock the eventController.getEventTypes function to throw an error
        eventController.getEventTypes.mockRejectedValue(new Error('Internal Server Error'));

        // Perform the GET request
        const response = await request(app).get('/events/types');

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal Server Error' });
        expect(eventController.getEventTypes).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
});
