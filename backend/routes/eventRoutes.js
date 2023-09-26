//importing modules
const express = require('express')
const userAuth = require('../middlewares/userAuth')
const eventController = require('../controllers/eventController')

const router = express.Router()

//get all tags
router.get('/types',
    userAuth.authenticate,
    (req, res) => {
        // Call the getAllUsers function here
        eventController.getEventTypes(req, res).catch((error) => {
            res.status(500).json({ error: "Internal Server Error" });
        });
    },
)

//get all url
router.get('/urls',
    userAuth.authenticate,

    (req, res) => {
        // Call the getAllUsers function here
        eventController.getAllUrl(req, res).catch((error) => {
            res.status(500).json({ error: "Internal Server Error" });
        });
    },
)

//signup endpoint DONE
//passing the middleware function to the signup

module.exports = router