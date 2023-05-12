const express = require("express");
const app = express();
const path = require("path");
const { router } = require("./router");

app.use(router); //Creating router to make main file neat and clean

app.listen(8000, () => {
  console.log(`Server running at ${8000}`);
});

module.exports = app;
