const mongoose = require("mongoose");
require("dotenv").config();

// Define the schema for SessionEvent
const sessionEventSchema = new mongoose.Schema({
  session_duration: { type: Number, required: true },
  visitor_id: { type: String, required: true },
  tdate: { type: Date, required: true },
  app_id: { type: String, required: true },
  pages_viewed: [
    {
      url: { type: String, required: true },
      title: { type: String, required: true },
    },
  ],
});

// Define the schema for CustomEvent
const customEventSchema = new mongoose.Schema({
    event_types: { type: String, required: true },
    tag_id: { type: String, required: false},
    tdate: { type: Date, required: true },
    visitor_id: { type: String, required: true },
    session_id: { type: String, required: true },
    app_id: { type: String, required: true },
    url: { type: String, required: false },
    location: { type: String, required: false },
    screen_resolution: { type: String, required: false },
});

// Create models from the schemas
const SessionEvent = mongoose.model("SessionEvent", sessionEventSchema);
const CustomEvent = mongoose.model("CustomEvent", customEventSchema);

// Establish the MongoDB connection
// mongoose.connect("mongodb://localhost:27017/mydatabase", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://honzikoi:SuperTestPass123@analytic-challenge.2q15bqi.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log("Error connecting to MongoDB", e);
  }
};

connectDB();

module.exports = {
  SessionEvent,
  CustomEvent,
};
