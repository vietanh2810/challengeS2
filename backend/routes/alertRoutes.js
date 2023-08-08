//importing modules
const express = require('express')
const userAuth = require('../middlewares/userAuth')
const alertController = require('../controllers/alertController')

const router = express.Router()

router.get('/',
    userAuth.authenticate,
    (req, res) => {
        // Call the getAllUsers function here
        alertController.getAllAlerts(req, res).catch((error) => {
            res.status(500).json({ error: "Internal Server Error" });
        });
    },
)

router.post('/create',
    userAuth.authenticate,
    (req, res) => {
        // Call the getAllUsers function here
        alertController.createAlert(req, res).catch((error) => {
            res.status(500).json({ error: "Internal Server Error" });
        });
    },
)

module.exports = router