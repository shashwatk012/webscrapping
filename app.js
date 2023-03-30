const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const { router } = require("./router");

app.use(router); //Creating router to make main file neat and clean

// EXPRESS SPECIFIC STUFF
const staticpath = path.join(__dirname, "./static");
app.use("/static", express.static(staticpath)); // For serving static files

// PUG SPECIFIC STUFF
app.set("view engine", "hbs"); // Set the template engine as pug
app.set("views", path.join(__dirname, "views")); // Set the views directory

//Registering the partials
const partialPath = path.join(__dirname, "./views/templates");
hbs.registerPartials(partialPath);

app.listen(3000, () => {
  console.log(`Server running at ${3000}`);
});
