//importing modules
const express = require('express')
const userController = require('../controllers/userController')
const convFunnelController = require('../controllers/conversionFunnelController')
const { signup, login } = userController
const userAuth = require('../middlewares/userAuth')
const uploadHandler = require('../middlewares/uploadHandler')

const router = express.Router()

//get all conversion funnels
router.get('/', userAuth.authenticate, convFunnelController.getAllConvFunns)

//signup endpoint DONE
//passing the middleware function to the signup
router.post('/create',userAuth.authenticate, convFunnelController.createConvFunn);

router.put('/update/:id', userAuth.authenticate, convFunnelController.updateConvFunn)


module.exports = router