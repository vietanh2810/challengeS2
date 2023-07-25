const express = require("express");
const userController = require("../controllers/userController");
const grapheController = require("../controllers/grapheController");
const { signup, login } = userController;
const userAuth = require("../middlewares/userAuth");

const router = express.Router();

//get all tags
router.get("/", grapheController.getAllGraphes);

//create a new graphe
router.post("/create", grapheController.createGraphe);

// Route to get a single graphe by ID
router.get("/:id", grapheController.getGrapheById);

// Route to update a graphe by ID
router.put("/:id", grapheController.updateGrapheById);

// Route to delete a graphe by ID
router.delete("/:id", grapheController.deleteGrapheById);

module.exports = router;
