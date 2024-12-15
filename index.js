const express = require("express");
const dotenv = require("dotenv");
const roomroute = require("./routes/roomroute.js");
const userroute=require('./routes/userroute.js')
const bookingroute=require('./routes/bookingroute.js')
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

app.use("/api/user",userroute)

app.use("/api/bookings",bookingroute)
app.listen(port, () => {
  console.log(`Server running on port :${port}`);
 });
// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");

// // Routes
// const roomRoute = require("./routes/roomroute.js");
// const userRoute = require('./routes/userroute.js');
// const bookingRoute = require('./routes/bookingroute.js');

// // Database configuration
// const dbConfig = require("./db");

// // Environment configuration
// dotenv.config({ path: "./.env" });

// const app = express();

// // Middleware
// app.use(helmet()); // Security headers
// app.use(morgan('combined')); // Request logging
// app.use(express.json()); // JSON body parser

// // CORS Configuration
// const corsOptions = {
//   origin: process.env.FRONTEND_URL || "http://localhost:5173",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };
// app.use(cors(corsOptions));

// // Routes
// app.use("/api/rooms", roomRoute);
// app.use("/api/user", userRoute);
// app.use("/api/bookings", bookingRoute);

// // Global Error Handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     message: 'Internal Server Error',
//     error: process.env.NODE_ENV !== 'production' ? err.stack : {}
//   });
// });

// // Start Server
// const port = process.env.PORT || 4000;
// app.listen(port, () => {
//   console.log(`Server running on port: ${port}`);
//   console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
// });

// module.exports = app; // For potential testing