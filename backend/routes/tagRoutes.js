//importing modules
const express = require('express')
const userController = require('../controllers/userController')
const tagController = require('../controllers/tagController')
const { signup, login } = userController
const userAuth = require('../middlewares/userAuth')
const uploadHandler = require('../middlewares/uploadHandler')

const router = express.Router()

//get all tags
router.get('/', userAuth.authenticate, tagController.getAllTags)

//signup endpoint DONE
//passing the middleware function to the signup
router.post('/create',userAuth.authenticate, tagController.createTag);

// router.put('/update/:id', userAuth.authenticate, tagController.updateTag)


module.exports = router