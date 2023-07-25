const express = require("express");
const userController = require("../controllers/userController");
const kpiController = require("../controllers/kpiController");
const { signup, login } = userController;
const userAuth = require("../middlewares/userAuth");

const router = express.Router();

//get all tags
router.get("/", kpiController.getAllKpis);

//signup endpoint DONE
//passing the middleware function to the signup
router.post("/create", kpiController.createKpi);

// Route to get a single KPI by ID
router.get("/:id", kpiController.getKpiById);

// Route to update a KPI by ID
router.put("/:id", kpiController.updateKpiById);

// Route to delete a KPI by ID
router.delete("/:id", kpiController.deleteKpiById);

module.exports = router;
