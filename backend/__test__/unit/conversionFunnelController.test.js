const conversionFunnelController = require('../../controllers/conversionFunnelController');
const db = require("../../models");

// Mock the jwt.verify function
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));
jest.mock('../../models'); // Assuming the User model is exported from '../models'

const Tag = db.tags;
const ConversionFunnel = db.conversionFunnel;

describe('createConversionFunnel', () => {
    it('should not create conversion tunnel if the tags doesn\'t exist', async () => {
        // Arrange
        //const eventName = 'session_event';
        const mockUser = { dataValues: { id: 'user_id' } };
        const tag_id = 'test_tag_id';

        const req = { user: mockUser, body: {comment: "test", tags: [tag_id]}};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        // Create a Jest mock for console.log
        const consoleLogMock = jest.spyOn(console, 'log');

        // Create a Jest mock for console.error
        const consoleErrorMock = jest.spyOn(console, 'error');

        // Act
        await conversionFunnelController.createConvFunn(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(console.error).toHaveBeenCalled();
    });

});

describe('getConversionFunnel', () => {
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
        await conversionFunnelController.getAllConvFunns(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
