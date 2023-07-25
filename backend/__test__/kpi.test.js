const request = require("supertest");
const app = require("../server"); // Import your main application
const db = require("../models");

// Import the test database
const sequelize = require("./db");
const Kpi = db.kpis;

// Define some test KPI data
const testKPI = {
  name: "Test KPI",
  value: 42,
  description: "This is a test KPI",
};

// Run before each test to set up the test database and insert test data
beforeEach(async () => {
  await sequelize.sync({ force: true }); // Drop and recreate the tables
  await Kpi.create(testKPI); // Insert test KPI data
});

// Test createKpi function
describe("createKpi", () => {
  test("should create a new KPI", async () => {
    const response = await request(app)
      .post("/api/kpis/create")
      .send({ name: "New KPI", value: 123, description: "New test KPI" });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("New KPI");
    // Add more assertions as needed
  });
});

// Test getKpiById function
describe("getKpiById", () => {
  test("should get a KPI by ID", async () => {
    const kpi = await Kpi.findOne();
    const response = await request(app).get(`/api/kpis/${kpi.id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(kpi.name);
    // Add more assertions as needed
  });

  test("should return 404 if KPI not found", async () => {
    const response = await request(app).get("/api/kpis/nonexistent-id");

    expect(response.status).toBe(404);
    // Add more assertions as needed
  });
});

// Test updateKpiById function
describe("updateKpiById", () => {
  test("should update a KPI by ID", async () => {
    const kpi = await Kpi.findOne();
    const response = await request(app).put(`/api/kpi/${kpi.id}`).send({
      name: "Updated KPI",
      value: 999,
      description: "Updated test KPI",
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated KPI");
    // Add more assertions as needed
  });

  test("should return 404 if KPI not found", async () => {
    const response = await request(app).put("/api/kpi/nonexistent-id");

    expect(response.status).toBe(404);
    // Add more assertions as needed
  });
});

// Test deleteKpiById function
describe("deleteKpiById", () => {
  test("should delete a KPI by ID", async () => {
    const kpi = await Kpi.findOne();
    const response = await request(app).delete(`/api/kpi/${kpi.id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(kpi.name);
    // Add more assertions as needed
  });

  test("should return 404 if KPI not found", async () => {
    const response = await request(app).delete("/api/kpi/nonexistent-id");

    expect(response.status).toBe(404);
    // Add more assertions as needed
  });
});
