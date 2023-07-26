const express = require("express");
const userController = require("../controllers/userController");
const kpiController = require("../controllers/kpiController");
const { signup, login } = userController;
const userAuth = require("../middlewares/userAuth");

const router = express.Router();

//get all tags
router.get("/", userAuth.authenticate, kpiController.getAllKpis);

//create a new KPI
router.post("/create", userAuth.authenticate, kpiController.createKpi);

// Route to get a single KPI by ID
router.get("/:id", userAuth.authenticate, kpiController.getKpiById);

// Route to update a KPI by ID
router.put("/:id", userAuth.authenticate, kpiController.updateKpiById);

// Route to delete a KPI by ID
router.delete("/:id", userAuth.authenticate, kpiController.deleteKpiById);

module.exports = router;
