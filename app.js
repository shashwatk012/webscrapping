const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const axios = require("axios");
const cheerio = require("cheerio");

const url =
  "https://www.amazon.in/dp/B0BMGB3CH9/?_encoding=UTF8&ie=UTF8&ref_=hero1_M04&pf_rd_r=YMBCNR44WB6W1Q27NWMM&pf_rd_p=7172a453-cc1c-400b-918c-2c70ad56f58c&pd_rd_r=afcd17c9-8a07-4d96-b6b1-9bae146e680e&pd_rd_w=x1tS7&pd_rd_wg=lCSrl";

const staticpath = path.join(__dirname, "./static");
app.use("/static", express.static(staticpath));

const partialspath = path.join(__dirname, "./views/templates");
hbs.registerPartials(partialspath);

app.set("views", "./views");
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  await axios
    .get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const pName = $("#productTitle");
      const p = $(".a-price-whole");
      const productName = pName.html();
      const pri = p.html();
      price = pri.substring(0, 5);
      res.render("index", {
        productName: productName,
        price: price,
      });
    })
    .catch(function (error) {
      console.error("hello");
    });
});

app.listen(8000, () => {
  console.log("listening at 8000");
});
