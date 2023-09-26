//importing modules
const express = require('express')
const userAuth = require('../middlewares/userAuth')
const companyController = require('../controllers/companyController')

const router = express.Router()

router.get('/',
    userAuth.authenticate,
    (req, res) => {
        // Call the getAllUsers function here
        companyController.getCompany(req, res).catch((error) => {
            res.status(500).json({ error: "Internal Server Error" });
        });
    },
)

module.exports = router