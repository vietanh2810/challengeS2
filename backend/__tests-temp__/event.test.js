const db = require("../../models");
const eventController = require('../../controllers/eventController');
const { SessionEvent, CustomEvent } = require('../../models/mongoDb');

// Mock the jwt.verify function
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

// Mock the db models
jest.mock('../../models'); // Assuming the User model is exported from '../models'
const Company = db.companies;
const conversionFunnel = db.conversionFunnel;

describe('Event Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    describe('createEvent', () => {
        it('should save a SessionEvent when the eventName is "session_event"', async () => {
            // Arrange
            const eventName = 'session_event';
            const eventData = { /* Provide the session event data here */ };

            // Create a Jest mock for SessionEvent.prototype.save
            const sessionEventSaveMock = jest.fn().mockResolvedValue(eventData);

            // Create a Jest mock for console.log
            const consoleLogMock = jest.spyOn(console, 'log');

            // Create a Jest mock for console.error
            const consoleErrorMock = jest.spyOn(console, 'error');

            // Act
            await eventController.createEvent(eventName, eventData, sessionEventSaveMock);

            // Assert
            expect(sessionEventSaveMock).toHaveBeenCalledTimes(1);
            expect(sessionEventSaveMock).toHaveBeenCalledWith(); // Check if save is called with the correct data

            // Check if console.log was called with the correct message
            expect(consoleLogMock).toHaveBeenCalledWith('SessionEvent saved:', eventData);

            expect(consoleErrorMock).not.toHaveBeenCalled();
        });

        it('should save a CustomEvent when the eventName is "custom_event"', async () => {
            // Arrange
            const eventName = 'custom_event';
            const eventData = { /* Provide the custom event data here */ };

            // Mock the CustomEvent.save function to resolve successfully
            CustomEvent.prototype.save = jest.fn().mockResolvedValue(eventData);

            // Act
            await eventController.createEvent(eventName, eventData);

            // Assert
            expect(CustomEvent.prototype.save).toHaveBeenCalledTimes(1);
            expect(console.log).toHaveBeenCalledWith('CustomEvent saved:', eventData);
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should log an error when the eventName is unknown', async () => {
            // Arrange
            const eventName = 'unknown_event';
            const eventData = { /* Provide some dummy event data */ };

            // Act
            await eventController.createEvent(eventName, eventData);

            // Assert
            expect(console.error).toHaveBeenCalledWith('Unknown event type:', eventName);
        });
    });

    describe('getEventTypes', () => {
        // Mock the req.user object
        const mockUser = { dataValues: { id: 'user_id' } };
        const req = { user: mockUser };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        it('should fetch eventTypes from the database and return them', async () => {
            // Arrange
            const mockCompany = { appId: 'test' };
            Company.findOne = jest.fn().mockResolvedValue(mockCompany);
            const expectedEventTypes = ['event_type_1', 'event_type_2'];
            CustomEvent.find = jest.fn().mockReturnValue({ distinct: jest.fn().mockResolvedValue(expectedEventTypes) });

            // Act
            await eventController.getEventTypes(req, res);

            // Assert
            expect(Company.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.dataValues.id } });
            expect(CustomEvent.find).toHaveBeenCalledWith({ app_id: mockCompany.appId });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expectedEventTypes);
            expect(console.error).not.toHaveBeenCalled();
        });
    });

    describe('getAllUrl', () => {
        it('should fetch distinct URLs from the database and return them', async () => {
            // Arrange
            const mockUser = { dataValues: { id: 'user_id' } };
            const req = { user: mockUser };
            const res = { status: jest.fn(() => res), json: jest.fn() };

            const mockCompany = { appId: 'test' };
            Company.findOne = jest.fn().mockResolvedValue(mockCompany);

            const expectedUrls = ['http://example.com', 'http://test.com'];
            CustomEvent.find = jest.fn().mockReturnValue({ distinct: jest.fn().mockResolvedValue(expectedUrls) });

            // Act
            await eventController.getAllUrl(res, req);

            // Assert
            expect(Company.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.dataValues.id } });
            expect(CustomEvent.find).toHaveBeenCalledWith({ app_id: mockCompany.appId });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expectedUrls);
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should handle errors and return 500 when fetching URLs', async () => {
            // Arrange
            const mockUser = { dataValues: { id: 'user_id' } };
            const req = { user: mockUser };
            const res = { status: jest.fn(() => res), json: jest.fn() };

            const mockCompany = { appId: 'test' };
            Company.findOne = jest.fn().mockResolvedValue(mockCompany);

            const expectedError = new Error('Internal Server Error');
            CustomEvent.find = jest.fn().mockReturnValue({ distinct: jest.fn().mockRejectedValue(expectedError) });

            // Act
            await eventController.getAllUrl(res, req);

            // Assert
            expect(Company.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.dataValues.id } });
            expect(CustomEvent.find).toHaveBeenCalledWith({ app_id: mockCompany.appId });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
        });

    });

    describe('getNbOfEventsByDate', () => {
        it('should fetch the number of new_visitor events by date', async () => {
            // Arrange
            const appId = 'test_app_id';
            const eventType = 'new_visitor';
            const tagId = null;
            const start = '2023-07-01T00:00:00Z';
            const end = '2023-07-30T00:00:00Z';
            const expectedCount = 1;
            const mockDataset = [
                {
                    _id: 'event_id_1',
                    app_id: 'test_app_id',
                    event_types: 'new_visitor',
                    tag_id: 'test_tag_id',
                    tdate: new Date('2023-07-05T12:00:00Z'),
                },
                {
                    _id: 'event_id_2',
                    app_id: 'test_app_id',
                    event_types: 'new_visitor',
                    tag_id: 'test_tag_id',
                    tdate: new Date('2022-07-10T08:00:00Z'),
                },
                {
                    _id: 'event_id_3',
                    app_id: 'different_app_id',
                    event_types: 'new_visitor',
                    tag_id: 'test_tag_id',
                    tdate: new Date('2023-07-15T15:00:00Z'),
                },
                {
                    _id: 'event_id_4',
                    app_id: 'test_app_id',
                    event_types: 'different_event_type',
                    tag_id: 'test_tag_id',
                    tdate: new Date('2021-07-20T18:00:00Z'),
                },
                {
                    _id: 'event_id_5',
                    app_id: 'test_app_id',
                    event_types: 'new_visitor',
                    tag_id: 'different_tag_id',
                    tdate: new Date('2022-07-25T21:00:00Z'),
                },
            ];

            CustomEvent.find = jest.fn().mockImplementation((query) => {
                return mockDataset.filter((event) => {
                    return (
                        event.app_id === query.app_id &&
                        event.event_types === query.event_types &&
                        (query.tag_id === null || event.tag_id === query.tag_id) &&
                        event.tdate >= new Date(query.tdate.$gte) &&
                        event.tdate < new Date(query.tdate.$lt)
                    );
                });
            });

            // Act
            const count = await eventController.getNbOfEventsByDate(appId, eventType, tagId, start, end);

            // Assert
            expect(count).toBe(expectedCount);
        });

        it('should fetch the number of custom events by date', async () => {
            // Arrange
            const appId = 'test_app_id';
            const eventType = 'custom_event';
            const tagId = 'test_tag_id';
            const start = '2023-07-01T00:00:00Z';
            const end = '2023-07-30T00:00:00Z';
            const expectedCount = 2;

            const mockDataset = [
                {
                    _id: 'event_id_1',
                    app_id: 'test_app_id',
                    event_types: 'custom_event',
                    tag_id: 'test_tag_id',
                    tdate: new Date('2023-07-05T12:00:00Z'),
                },
                {
                    _id: 'event_id_2',
                    app_id: 'test_app_id',
                    event_types: 'custom_event',
                    tag_id: 'test_tag_id',
                    tdate: new Date('2023-07-10T08:00:00Z'),
                },
                {
                    _id: 'event_id_3',
                    app_id: 'different_app_id',
                    event_types: 'custom_event',
                    tag_id: 'test_tag_id',
                    tdate: new Date('2023-07-15T15:00:00Z'),
                },
                {
                    _id: 'event_id_4',
                    app_id: 'test_app_id',
                    event_types: 'different_event_type',
                    tag_id: 'test_tag_id',
                    tdate: new Date('2023-07-20T18:00:00Z'),
                },
                {
                    _id: 'event_id_5',
                    app_id: 'test_app_id',
                    event_types: 'custom_event',
                    tag_id: 'different_tag_id',
                    tdate: new Date('2023-07-25T21:00:00Z'),
                },
            ];

            CustomEvent.find = jest.fn().mockImplementation((query) => {
                return mockDataset.filter((event) => {
                    return (
                        event.app_id === query.app_id &&
                        event.event_types === query.event_types &&
                        event.tag_id === query.tag_id &&
                        event.tdate >= new Date(query.tdate.$gte) &&
                        event.tdate < new Date(query.tdate.$lt)
                    );
                });
            });

            // Act
            const count = await eventController.getNbOfEventsByDate(appId, eventType, tagId, start, end);

            // Assert
            expect(count).toBe(expectedCount);
        });


        it('should return 0 if no events are found in the specified date range', async () => {
            // Arrange
            const appId = 'test_app_id';
            const eventType = 'custom_event';
            const tagId = 'test_tag_id';
            const start = '2022-07-01T00:00:00Z';
            const end = '2022-07-30T00:00:00Z';
            const expectedCount = 0; // No events found in the specified date range
            const mockDataset = [
                {
                    _id: 'event_id_1',
                    app_id: 'test_app_id',
                    event_types: 'custom_event',
                    tag_id: 'test_tag_id',
                    tdate: new Date('2023-07-05T12:00:00Z'),
                },
                {
                    _id: 'event_id_2',
                    app_id: 'test_app_id',
                    event_types: 'custom_event',
                    tag_id: 'test_tag_id',
                    tdate: new Date('2023-07-10T08:00:00Z'),
                },
                {
                    _id: 'event_id_3',
                    app_id: 'different_app_id',
                    event_types: 'custom_event',
                    tag_id: 'test_tag_id',
                    tdate: new Date('2023-07-15T15:00:00Z'),
                },
                {
                    _id: 'event_id_4',
                    app_id: 'test_app_id',
                    event_types: 'different_event_type',
                    tag_id: 'test_tag_id',
                    tdate: new Date('2023-07-20T18:00:00Z'),
                },
                {
                    _id: 'event_id_5',
                    app_id: 'test_app_id',
                    event_types: 'custom_event',
                    tag_id: 'different_tag_id',
                    tdate: new Date('2023-07-25T21:00:00Z'),
                },
            ];

            CustomEvent.find = jest.fn().mockImplementation((query) => {
                return mockDataset.filter((event) => {
                    return (
                        event.app_id === query.app_id &&
                        event.event_types === query.event_types &&
                        event.tag_id === query.tag_id &&
                        event.tdate >= new Date(query.tdate.$gte) &&
                        event.tdate < new Date(query.tdate.$lt)
                    );
                });
            });
            // Act
            const count = await eventController.getNbOfEventsByDate(appId, eventType, tagId, start, end);

            // Assert
            expect(count).toBe(expectedCount);
        });

    });

    describe('getCustomEventsByDate', () => {
        it('should return 0 if conversion funnel is not found', async () => {
            // Arrange
            const conversionFunnelId = 'non_existent_conversion_funnel_id';
            const visitorId = 'test_visitor_id';
            const tag_id = 'test_tag_id';

            // Mock the conversion funnel to return null (not found)
            conversionFunnel.findOne = jest.fn().mockResolvedValue(null);

            // Act
            const count = await eventController.getCustomEventsByDate(conversionFunnelId, visitorId, tag_id);
            console.log(count)

            // Assert
            expect(count).toBe(0); 
        });

        it('should return the correct count of custom events matching the conversion funnel', async () => {
            // Arrange
            const conversionFunnelId = 'test_conversion_funnel_id';
            const visitorId = 'test_visitor_id';
            const tag_id = 'test_tag_id';
            const expectedCount = 2; // Assuming there are 2 matching custom events

            // Mock the conversion funnel to return tagList
            conversionFunnel.findOne = jest.fn().mockResolvedValue({
                tagList: ['event_type_1', 'event_type_2'],
            });

            // Mock the CustomEvent.findAll to return mock custom events
            CustomEvent.findAll = jest.fn().mockResolvedValue([
                { event_types: 'event_type_1', tag_id: 'test_tag_id' },
                { event_types: 'event_type_2', tag_id: 'test_tag_id' },
                // Add more mock custom events as needed
            ]);

            // Act
            const count = await eventController.getCustomEventsByDate(conversionFunnelId, visitorId, tag_id);

            console.log(count)

            // Assert
            expect(count).toBe(expectedCount);
        });
    });

    describe('getHeatMapByDate', () => {
        it('should return heatmap data based on appUrl, start, and end', async () => {
            // Arrange
            const appUrl = 'test_app_url';
            const start = '2023-07-01T00:00:00Z';
            const end = '2023-07-30T00:00:00Z';
            const expectedHeatmapData = [{ /* Provide expected heatmap data */ }]; // Mock expected heatmap data

            // Mock the CustomEvent.aggregate function to return the mock heatmap data
            CustomEvent.aggregate = jest.fn().mockResolvedValue(expectedHeatmapData);

            // Act
            const heatmapData = await eventController.getHeatMapByDate(appUrl, start, end);

            // Assert
            expect(heatmapData).toEqual(expectedHeatmapData);
        });
    });

    describe('getGrapheByDate', () => {
        it('should return graph data based on start, end, eventType, tagId, graphType, step, stepType, and appId', async () => {
            // Arrange
            const start = '2023-07-01T00:00:00Z';
            const end = '2023-07-30T00:00:00Z';
            const eventType = 'test_event_type';
            const tagId = 'test_tag_id';
            const graphType = 'test_graph_type';
            const step = 1;
            const stepType = 'hour';
            const appId = 'test_app_id';
            const altTagId = 'core-docs-tags';
            const expectedGraphData = [{ /* Provide expected graph data */ }]; // Mock expected graph data

            // Mock the CustomEvent.aggregate function to return the mock graph data
            CustomEvent.aggregate = jest.fn().mockResolvedValue(expectedGraphData);

            // Act
            const graphData = await eventController.getGrapheByDate(
                start,
                end,
                eventType,
                tagId,
                graphType,
                step,
                stepType,
                appId
            );

            // Assert
            expect(graphData).toEqual(expectedGraphData);
        });
    });

    // Add test cases for the remaining functions in the eventController, such as getAllUrl, getNbOfEventsByDate, getCustomEventsByDate, getHeatMapByDate, getGrapheByDate
});