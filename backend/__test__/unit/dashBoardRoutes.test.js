const request = require('supertest');
const express = require('express');
const dashboardRoutes = require('../../routes/dashBoardRoutes');
const dashBoardController = require('../../controllers/dashBoardController');

jest.mock('../../controllers/dashBoardController', () => ({
    getUserDashBoard: jest.fn(),
}));

jest.mock('../../middlewares/userAuth', () => ({
    authenticate: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/', dashboardRoutes);

describe('Dashboard Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /', () => {
        it('should return user dashboard data with status 200', async () => {
            // Arrange
            const mockUser = { dataValues: { id: 'user_id' } };
            const req = { user: mockUser };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mock the getUserDashBoard function to resolve with mock data
            const mockDashboardData = {
                kpis: [{ kpi: 'kpi_data' }],
                heatmaps: [{ heatmap: 'heatmap_data' }],
                graphes: [{ graphe: 'graphe_data' }],
            };
            dashBoardController.getUserDashBoard.mockResolvedValue(mockDashboardData);

            // Act
            await request(app).post('/').send(req).expect(200);

            // Assert
            expect(dashBoardController.getUserDashBoard).toHaveBeenCalledWith(
                mockUser.dataValues.id
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockDashboardData);
        });

        it('should handle errors and return 500 on internal server error', async () => {
            // Arrange
            const mockUser = { dataValues: { id: 'user_id' } };
            const req = { user: mockUser };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Mock the getUserDashBoard function to reject with an error
            const expectedError = new Error('Internal Server Error');
            dashBoardController.getUserDashBoard.mockRejectedValue(expectedError);

            // Act
            await request(app).post('/').send(req).expect(500);

            // Assert
            expect(dashBoardController.getUserDashBoard).toHaveBeenCalledWith(
                mockUser.dataValues.id
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });
});
