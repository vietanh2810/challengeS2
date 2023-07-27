//importing modules
const express = require('express')
const userAuth = require('../middlewares/userAuth')
const eventController = require('../controllers/eventController')

const router = express.Router()

//get all tags
router.get('/types', userAuth.authenticate, eventController.getEventTypes)

//signup endpoint DONE
//passing the middleware function to the signup

module.exports = router