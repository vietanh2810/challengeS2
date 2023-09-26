const kpiController = require('../../controllers/kpiController');
const db = require('../../models');

// Mock the Kpi model & jwt 
jest.mock('../../models/');
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

const Kpi = db.kpis


describe("Kpi Router", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    describe("Get All Kpis", () => {
        it("should return a/all Kpis", async () => {

            const mockUser = { dataValues: {id: 'user_id', role: 'admin' } };
            const req = { user: mockUser };
            const res = { status: jest.fn(() => res), json: jest.fn()}

            const mockKpis = [{ id: 1, name: 'test1'}, {id:2, name:'test2'}]
            Kpi.findAll = jest.fn().mockResolvedValue(mockKpis)

            await kpiController.getAllKpis(req, res);

            expect(Kpi.findAll).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(mockKpis)
        })

        it("should return a single KPI by ID for a non-admin user", async () => {
            const mockUser = { dataValues: { id: 'user_id', role: 'non-admin' } };
            const req = { user: mockUser, params: { id: 1 } };
            const res = { status: jest.fn(() => res), json: jest.fn() };

            const mockKpi = { id: 1, name: 'test1' };
            Kpi.findByPk = jest.fn().mockResolvedValue(mockKpi);

            await kpiController.getKpiById(req, res);

            expect(Kpi.findByPk).toHaveBeenCalledTimes(1);
            expect(Kpi.findByPk).toHaveBeenCalledWith(1, { where: { userId: 'user_id' } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockKpi);
        });

        it("should handle KPI not found", async () => {
            const mockUser = { dataValues: { id: 'user_id', role: 'webmaster' } };
            const req = { user: mockUser, params: { id: 1 } };
            const res = { status: jest.fn(() => res), json: jest.fn() };

            // Mock the behavior of Kpi.findByPk to return null (KPI not found)
            Kpi.findByPk = jest.fn().mockResolvedValue(null);

            await kpiController.getKpiById(req, res);

            expect(Kpi.findByPk).toHaveBeenCalledTimes(1);
            expect(Kpi.findByPk).toHaveBeenCalledWith(1, { where: { userId: 'user_id' } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "KPI not found" });
        });

        it("should handle errors", async () => {
            const mockUser = { dataValues: { id: 'user_id', role: 'webmaster' } };
            const req = { user: mockUser, params: { id: 1 } };
            const res = { status: jest.fn(() => res), json: jest.fn() };

            // Mock the behavior of Kpi.findByPk to throw an error
            Kpi.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

            await kpiController.getKpiById(req, res);

            expect(Kpi.findByPk).toHaveBeenCalledTimes(1);
            expect(Kpi.findByPk).toHaveBeenCalledWith(1, { where: { userId: 'user_id' } });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
        });

    })

})