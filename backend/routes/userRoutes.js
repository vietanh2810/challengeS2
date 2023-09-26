//importing modules
const express = require("express");
const userController = require("../controllers/userController");
const { signup,getAllUsers,login,validateUser } = userController;
const userAuth = require("../middlewares/userAuth");
const {authenticate, checkAdminRole,saveUser} = userAuth;
const uploadHandler = require("../middlewares/uploadHandler");
const { upload } = require("../middlewares/uploadHandler");
const multer = require("multer");

const router = express.Router();

//get all users
router.get(
  "/",
  authenticate,
  checkAdminRole,
  (req, res) => {
    // Call the getAllUsers function here
    getAllUsers(req, res).catch((error) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
  }
);

//signup endpoint DONE
//passing the middleware function to the signup
router.post(
  "/signup",
  upload.single("kbis"),
  (req, res) => {
    // Call the getAllUsers function here
    saveUser(req, res,next).catch((error) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
  },
  (req, res) => {
    // Call the getAllUsers function here
    signup(req, res).catch((error) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
  },
);

//login route DONE
router.post("/login",
 (req, res) => {
  // Call the getAllUsers function here
    login(req, res).catch((error) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
  },
 );

//validate route
router.put(
  "/validate/:id",
  authenticate,
  checkAdminRole,
  (req, res) => {
    // Call the getAllUsers function here
    validateUser(req, res).catch((error) => {
        res.status(500).json({ error: "Internal Server Error" });
      });
  },
);

module.exports = router;
