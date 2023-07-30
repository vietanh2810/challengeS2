const tagController = require('../../controllers/tagController');
const db = require("../../models");

// Mock the jwt.verify function
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));
jest.mock('../../models'); // Assuming the User model is exported from '../models'

const Tag = db.tags;

describe('createTag', () => {
    it('should save a tag when creating', async () => {
        // Arrange
        //const eventName = 'session_event';
        const mockUser = { dataValues: { id: 'user_id' } };

        const req = { user: mockUser, body: {comment: "test", userId: mockUser.dataValues.id}};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        // Create a Jest mock for console.log
        const consoleLogMock = jest.spyOn(console, 'log');

        // Create a Jest mock for console.error
        const consoleErrorMock = jest.spyOn(console, 'error');

        // Act
        await tagController.createTag(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(201);
        expect(console.error).not.toHaveBeenCalled();
    });

    it('should log an error when the user is unknown', async () => {
        // Arrange
        const mockUser = { dataValues: { id: 'user_id' } };

        const req = { user: null, body: {comment: "test", userId: null}};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        // Create a Jest mock for console.log
        const consoleLogMock = jest.spyOn(console, 'log');

        // Create a Jest mock for console.error
        const consoleErrorMock = jest.spyOn(console, 'error');

        // Act
        await tagController.createTag(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(console.error).toHaveBeenCalled();
    });

});

describe('getTags', () => {
    it('should see all the tags', async () => {
        // Arrange
        //const eventName = 'session_event';
        const mockUser = { dataValues: { id: 'user_id' } };

        const req = { user: mockUser};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        // Create a Jest mock for console.log
        const consoleLogMock = jest.spyOn(console, 'log');

        // Create a Jest mock for console.error
        const consoleErrorMock = jest.spyOn(console, 'error');

        // Act
        await tagController.getAllTags(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
    });
});

