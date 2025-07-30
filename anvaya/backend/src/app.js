require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const scratchCardRoutes = require("./routes/scratchCardRoutes");

const app = express();

// Enable CORS - you can restrict origin here (replace with your frontend URL for production)
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // e.g., "https://your-frontend-url.com"
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Check for required env variable
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file.");
  process.exit(1);
}
console.log("Mongo URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("⚡ MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Healthcheck endpoint
app.get("/", (req, res) => res.send("Backend server is running"));

// API routes
app.use("/api/scratchCards", scratchCardRoutes);

// Start server, listen on 0.0.0.0 for cloud hosting compatibility
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`⚡ Server running on port ${PORT}`);
});

module.exports = app;
