const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const tagRoutes = require('./routes/tagRoutes');
const userController = require('./controllers/userController');
const eventController = require('./controllers/eventController');
const auth = require('./middlewares/userAuth');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
require('dotenv').config();

const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware

// Synchronizing the database and forcing it to false so we don't lose data
db.sequelize.sync({ force: true }).then(() => {
    console.log("db has been re-synced");
    userController.createDefaultAdmin();
});

console.log('test')

app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes);

app.post('/api/events',auth.checkAppId, (req, res) => {
    const { eventName, eventData } = req.body;

    console.log('Received event data from SDK:', eventName, eventData);

    eventController.createEvent(eventName, eventData);

    res.status(200).json({ message: 'Event data received successfully' });
});

// Start the server
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
