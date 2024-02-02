const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const connectDB = require("./db");
const express = require("express");
const app = express();
const indxRouter = require("./routes/index");

app.use(express.json());

app.use("/api/v1", indxRouter);

app.use("*", function (req, res) {
  res.status(404).json({ msg: "page not exists: 404" });
});

connectDB(process.env.MONGO_URI);
app.listen(3000, console.log("app running on 3000..."));

module.exports = app;