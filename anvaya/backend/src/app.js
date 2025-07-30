require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const scratchCardRoutes = require("./routes/scratchCardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Debug: Log Mongo URI to verify it's loaded properly
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file.");
  process.exit(1);
}
console.log("Mongo URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("⚡ MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if unable to connect to DB
  });

// Healthcheck endpoint
app.get("/", (req, res) => res.send("Backend server is running"));

// API routes
app.use("/api/scratchCards", scratchCardRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
