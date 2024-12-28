const express = require("express");
const dotenv = require("dotenv");
const roomroute = require("./routes/roomroute.js");
const userroute = require("./routes/userroute.js");
const bookingroute = require("./routes/bookingroute.js");
const cors = require("cors");

dotenv.config({
  path: "./.env",
});

const dbconfig = require("./db");

const app = express();

const corsOptions = {
  origin: ["https://travelnest-sand.vercel.app","http://localhost:5173"],
  credentials:true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const port = process.env.PORT || 4000;
app.use(express.json());
app.use("/api/rooms", roomroute);

app.use("/api/user", userroute);

app.use("/api/bookings", bookingroute);
app.listen(port, () => {
  console.log(`Server running on port :${port}`);
});
