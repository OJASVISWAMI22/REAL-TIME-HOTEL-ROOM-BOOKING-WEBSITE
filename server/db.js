const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;

mongoose.connect(url /*,{useUnifiedTopology:true,useNewUrlParser:true}*/);

const connection = mongoose.connection;
connection.on("error", () => {
  console.log("MONGODB connection error");
});

connection.on("connected", () => {
  console.log("mongodb connection sucessful");
});

module.exports = mongoose;
