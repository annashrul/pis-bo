const path = require("path");
const express = require("express");
const app = express(); // create express app
const dotenv = require('dotenv')
dotenv.config();

// add middlewares
app.use(express.static(path.join(__dirname, "/", "build")));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "/", "build", "index.html"));
});


app.listen(process.env.PORT, () => {
  console.log("Backoffice running on port "+process.env.PORT);
});
