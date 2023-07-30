const request = require('supertest');
const jwt = require('jsonwebtoken'); // import jwt library
const auth = require('../middlewares/userAuth');
const db = require("../models");

jest.mock('jsonwebtoken');
jest.mock('../models'); // Assuming the User model is exported from '../models'
const User = db.users;

describe('Authentication Middleware', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    it('should pass authentication and call next middleware', async () => {
        // Arrange
        const mockUser = { id: 1, username: 'testUser' };
        const authToken = 'valid_token';
        const req = { headers: { authorization: `Bearer ${authToken}` } };
        const res = {};
        const next = jest.fn();

        // Mock jwt.verify to call the callback with no error and decoded payload
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, { id: mockUser.id });
        });

        // Mock User.findByPk to return a user
        User.findByPk.mockResolvedValue(mockUser);

        // Act
        await auth.authenticate(req, res, next);

        // Assert
        expect(req.user).toBe(mockUser);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 401 when authentication fails due to missing or invalid token', async () => {
        // Arrange
        const authToken = 'invalid_token';
        const req = { headers: { authorization: authToken } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // Act
        await auth.authenticate(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Unauthorized. Missing or invalid token.',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when authentication fails due to invalid or expired token', async () => {
        // Arrange
        const authToken = 'expired_token';
        const req = { headers: { authorization: `Bearer ${authToken}` } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // Mock jwt.verify to call the callback with an error
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Token expired'));
        });

        // Act
        await auth.authenticate(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Unauthorized. Invalid or expired token.',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 500 when an error occurs during authentication', async () => {
        // Arrange
        const authToken = 'valid_token';
        const req = { headers: { authorization: `Bearer ${authToken}` } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // Mock jwt.verify to throw an error
        jwt.verify.mockImplementation(() => {
            throw new Error('Some error occurred');
        });

        // Act
        await auth.authenticate(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'An error occurred during user authentication.',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 409 when a username is already taken', async () => {
        // Arrange
        const req = { body: { userName: 'existing_user', email: 'new_user@example.com' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // Mock User.findOne to simulate an existing username
        User.findOne = jest.fn().mockResolvedValue({ userName: 'existing_user' });

        // Act
        await auth.saveUser(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'Username already taken' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 409 when an email is already taken', async () => {
        // Arrange
        const req = { body: { userName: 'new_user', email: 'existing_user@example.com' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // Mock User.findOne to simulate an existing email
        User.findOne = jest.fn().mockResolvedValue({ email: 'existing_user@example.com' });

        // Act
        await auth.saveUser(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'Username already taken' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next middleware when username and email are available', async () => {
        // Arrange
        const req = { body: { userName: 'new_user', email: 'new_user@example.com' } };
        const res = {};
        const next = jest.fn();

        // Mock User.findOne to simulate that both username and email are available
        User.findOne = jest.fn().mockResolvedValue(null);

        // Act
        await auth.saveUser(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should return 401 when an invalid or missing token is provided for checkAppId', async () => {
        // Arrange
        const req1 = { headers: { authorization: 'invalid_token' } };
        const req2 = { headers: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // Act
        await auth.checkAppId(req1, res, next);
        await auth.checkAppId(req2, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledTimes(2);
        expect(res.json).toHaveBeenCalledTimes(2);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenNthCalledWith(1, 401);
        expect(res.json).toHaveBeenNthCalledWith(1, { error: 'Unauthorized. Missing APP_ID in headers.' });
        expect(res.status).toHaveBeenNthCalledWith(2, 401);
        expect(res.json).toHaveBeenNthCalledWith(2, { error: 'Unauthorized. Missing APP_ID in headers.' });
    });

    it('should call next middleware when a valid APP_ID is provided', async () => {
        // Arrange
        const req = { headers: { authorization: 'Bearer valid_token', 'app-id': 'test' } };
        const res = {};
        const next = jest.fn();

        // Act
        await auth.checkAppId(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(1);
    });
});
