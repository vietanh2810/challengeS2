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
const grapheController = require("./controllers/grapheController");
const kpiController = require("./controllers/kpiController");
const heatmapController = require("./controllers/heatmapController");
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
db.sequelize.sync({ force: true }).then(async () => {
    console.log("db has been re-synced");

    const graphes = [
        {
            "id": 1,
            "graphe_type": "all_time",
            "name": "Visitor",
            "userId": 1,
            "event_type": "new_visitor",
            "tag_id": null,
            "createdAt": "2023-07-28T18:40:38.310Z",
            "updatedAt": "2023-07-28T18:40:38.310Z"
        },
        {
            "id": 2,
            "graphe_type": "time_span",
            "name": "Visitor by time ",
            "userId": 1,
            "event_type": "new_visitor",
            "tag_id": null,
            "createdAt": "2023-07-28T18:40:48.708Z",
            "updatedAt": "2023-07-28T18:40:48.708Z"
        },
        {
            "id": 3,
            "graphe_type": "time_span",
            "name": "Click on core-docs-tag",
            "userId": 1,
            "event_type": "click",
            "tag_id": "core-docs-tags",
            "createdAt": "2023-07-28T18:41:03.748Z",
            "updatedAt": "2023-07-28T18:41:03.748Z"
        }
    ];

    kpis = [
        {
            "id": 1,
            "name": "Visit Aout",
            "description": "hihi",
            "value": "120",
            "value_type": "number",
            "userId": 1,
            "event_type": "new_visitor",
            "tag_id": null,
            "start": "2023-08-01T00:00:00.000Z",
            "end": "2023-09-01T00:00:00.000Z",
            "conversionId": null,
            "createdAt": "2023-07-28T20:07:53.403Z",
            "updatedAt": "2023-07-28T20:07:53.403Z"
        },
        {
            "id": 2,
            "name": "Click aout",
            "description": "hehe",
            "value": "100",
            "value_type": "number",
            "userId": 1,
            "event_type": "click",
            "tag_id": null,
            "start": "2023-08-01T00:00:00.000Z",
            "end": "2023-08-31T00:00:00.000Z",
            "conversionId": null,
            "createdAt": "2023-07-28T20:08:15.676Z",
            "updatedAt": "2023-07-28T20:08:15.676Z"
        }
    ]

    userController.createDefaultAdmin();
    const webmaster = await userController.createDefaultWebmaster();

    // Now, use the created webmaster's ID to create the default tag
    await tagController.createDefaultTag("core-docs-tags", webmaster.id);

    graphes.forEach(graphe => {
        grapheController.createDefaultGraph(webmaster.id, graphe.graphe_type, graphe.name, graphe.event_type, graphe.tag_id);
    });

    kpis.forEach(kpi => {
        kpiController.createDefaultKpi(webmaster.id, kpi.name, kpi.value, kpi.value_type, kpi.description, kpi.tag_id, kpi.event_type, kpi.start, kpi.end, kpi.conversionId);
    });

    heatmapController.createDefaultHeatmap(webmaster.id, 'test-sdk-page', 'http://localhost:8081/')
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

const server = app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
const io = require("socket.io")(server, {
    cors: {
        origin: "https://zesty-cranachan-1bc6dc.netlify.app/", // Replace with your Vue.js app's domain
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Handle incoming WebSocket connections
io.on("connection", (socket) => {
    // console.log("A new client connected here.");
});

// Example: When a new event is created, emit a Socket.IO message to connected clients
app.post('/api/events', auth.checkAppId, (req, res) => {
    const { eventName, eventData } = req.body;

    eventController.createEvent(eventName, eventData);

    const message = { message: 'New event created' };
    io.emit('message', message); // Emit the message to all connected clients using Socket.IO

    res.status(200).json({ message: 'Event data received successfully' });
});

module.exports = app;