const express =require("express");
const dotenv=require("dotenv")
dotenv.config({
  path:'./.env',
})
const app = express();

const dbconfig=require('./db')
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port :${port}`);
});
