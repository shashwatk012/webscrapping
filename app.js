const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const axios = require("axios");
const cheerio = require("cheerio");
const { fetchShelves } = require("./api");

const staticpath = path.join(__dirname, "./static");
app.use("/static", express.static(staticpath));

const partialspath = path.join(__dirname, "./views/templates");
hbs.registerPartials(partialspath);

app.set("views", "./views");
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  let arr = await fetchShelves();
  // console.log(arr);
  res.render("index", { arr: arr });
});

app.listen(8000, () => {
  console.log("listening at 8000");
});
