const express = require("express");
const dotenv = require("dotenv");
const roomroute = require("./routes/roomroute.js");
const cors = require("cors");

dotenv.config({
  path: "./.env",
});

const dbconfig = require("./db");

const app = express();

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173", // our frontend URL
  credentials: true, // This is important.
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const port = process.env.PORT || 4000;
app.use(express.json());
app.use("/api/rooms", roomroute);

app.listen(port, () => {
  console.log(`Server running on port :${port}`);
});
