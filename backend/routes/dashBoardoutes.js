//importing modules
const express = require('express')
const dashBoardController = require('../controllers/dashBoardController')
const userAuth = require('../middlewares/userAuth')

const router = express.Router()

//get all tags
router.post('/', userAuth.authenticate, dashBoardController.getUserDashBoard)

module.exports = router