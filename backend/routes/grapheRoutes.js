const express = require("express");
const userController = require("../controllers/userController");
const grapheController = require("../controllers/grapheController");
const { signup, login } = userController;
const userAuth = require("../middlewares/userAuth");

const router = express.Router();

//get all tags
router.get("/", userAuth.authenticate, grapheController.getAllGraphes);

//create a new graphe
router.post("/create", userAuth.authenticate, grapheController.createGraphe);

// Route to get a single graphe by ID
router.get("/:id", userAuth.authenticate, grapheController.getGrapheById);

// Route to update a graphe by ID
router.put("/:id", userAuth.authenticate, grapheController.updateGrapheById);

// Route to delete a graphe by ID
router.delete("/:id", userAuth.authenticate, grapheController.deleteGrapheById);

module.exports = router;
