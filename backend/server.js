const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./models");
const userRoutes = require("./routes/userRoutes");
const tagRoutes = require("./routes/tagRoutes");
const kpiRoutes = require("./routes/kpiRoutes");
const eventRoutes = require("./routes/eventRoutes");
const dashboardRoutes = require("./routes/dashBoardRoutes");
const grapheRoutes = require("./routes/grapheRoutes");
const heatmapRoutes = require("./routes/heatmapRoutes");
const userController = require("./controllers/userController");
const tagController = require("./controllers/tagController");
const eventController = require("./controllers/eventController");
const bodyParser = require("body-parser");
const auth = require("./middlewares/userAuth");
const conversion_funnelRoutes = require("./routes/conversionFunnelRoutes");

require("dotenv").config();
const cors = require("cors"); // Import the cors middleware
const e = require("express");

const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()); // Use the cors middleware

// Synchronizing the database and forcing it to false so we don't lose data
db.sequelize.sync({ force: true }).then(async() => {
    console.log("db has been re-synced");

    userController.createDefaultAdmin();
    const webmaster = await userController.createDefaultWebmaster();

    // Now, use the created webmaster's ID to create the default tag
    tagController.createDefaultTag("core-docs-tags", webmaster.id);
});

app.use("/api/users", userRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/convTunnel", conversion_funnelRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/kpis", kpiRoutes);
app.use("/api/graphes", grapheRoutes);
app.use("/api/heatmaps", heatmapRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.post("/api/events", auth.checkAppId, (req, res) => {
    const { eventName, eventData } = req.body;

    console.log("Received event data from SDK:", eventName, eventData);

    eventController.createEvent(eventName, eventData);

    res.status(200).json({ message: "Event data received successfully" });
});

// Start the server
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
