const express = require("express");
const userController = require("../controllers/userController");
const heatmapController = require("../controllers/heatmapController");
const { signup, login } = userController;
const userAuth = require("../middlewares/userAuth");

const router = express.Router();

//get all tags
router.get("/", userAuth.authenticate, heatmapController.getAllHeatmaps);

//create a new heatmap
router.post("/create", userAuth.authenticate, heatmapController.createHeatmap);

// Route to get a single heatmap by ID
router.get("/:id", userAuth.authenticate, heatmapController.getHeatmapById);

// Route to update a heatmap by ID
router.put("/:id", userAuth.authenticate, heatmapController.updateHeatmapById);

// Route to delete a heatmap by ID
router.delete(
  "/:id",
  userAuth.authenticate,
  heatmapController.deleteHeatmapById
);

module.exports = router;
