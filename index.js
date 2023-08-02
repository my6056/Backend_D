// Importing FIles
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const app = express();
const { connectDB } = require("./config/dataBase");
const PORT = 3000;

// MiddleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
/* _____________________________________ROUTE Start ______________________________________________*/

app.use("/", require("./routes"));
app.get("*", (req, res) => {
  return res.send("Router Not Found");
});
/* _____________________________________ROUTE Start ______________________________________________*/

// Start the server With DB connection

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
