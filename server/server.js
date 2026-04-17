const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running"
  });
});

// PORT (important for deployment)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});