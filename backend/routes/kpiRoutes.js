const express = require("express");
const userController = require("../controllers/userController");
const kpiController = require("../controllers/kpiController");
const { signup, login } = userController;
const userAuth = require("../middlewares/userAuth");

const router = express.Router();

//get all tags
router.get("/", userAuth.authenticate, kpiController.getAllKpi);

//signup endpoint DONE
//passing the middleware function to the signup
router.post("/create", userAuth.authenticate, kpiController.createKpi);

// router.put('/update/:id', userAuth.authenticate, kpiController.updateKpi)

module.exports = router;
