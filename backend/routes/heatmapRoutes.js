const express = require("express");
const userController = require("../controllers/userController");
const heatmapController = require("../controllers/heatmapController");
const { signup, login } = userController;
const userAuth = require("../middlewares/userAuth");

const router = express.Router();

//get all tags
router.get("/", heatmapController.getAllHeatmaps);

//create a new heatmap
router.post("/create", heatmapController.createHeatmap);

// Route to get a single heatmap by ID
router.get("/:id", heatmapController.getHeatmapById);

// Route to update a heatmap by ID
router.put("/:id", heatmapController.updateHeatmapById);

// Route to delete a heatmap by ID
router.delete("/:id", heatmapController.deleteHeatmapById);

module.exports = router;
