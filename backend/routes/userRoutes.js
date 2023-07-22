//importing modules
const express = require('express')
const userController = require('../controllers/userController')
const { signup, login } = userController
const userAuth = require('../middlewares/userAuth')
const uploadHandler = require('../middlewares/uploadHandler')

const router = express.Router()

//get all users
router.get('/', userAuth.authenticate, userAuth.checkAdminRole, userController.getAllUsers)

//signup endpoint DONE
//passing the middleware function to the signup
router.post('/signup', uploadHandler.upload, userAuth.saveUser, userController.signup);

//login route DONE
router.post('/login', login )

//validate route 
router.put('/validate/:id', userAuth.authenticate, userAuth.checkAdminRole, userController.validateUser)

module.exports = router