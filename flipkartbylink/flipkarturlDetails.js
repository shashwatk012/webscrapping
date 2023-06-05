"use strict";
const axios = require("axios");
const cheerio = require("cheerio");
const { headers, allProducts, imglink, replce } = require("../text");

const flipkartfetchUrlDetails = async (url) => {
  try {
    const response = await axios.get(url, headers);

    const html = response.data;

    const $ = cheerio.load(html);

    const products = [];

    $(allProducts).each(async (_idx, el) => {
      // selecting the elements to be scrapped
      const listofproducts = $(el);
      let imagelink = listofproducts.find(imglink).attr("src"); // scraping the image
      if (!imagelink) {
        imagelink = listofproducts.find("img._2r_T1I").attr("src"); // scraping the image
      }

      const link = listofproducts // scraping the link of the product
        .find("a")
        .attr("href");

      let price = listofproducts.find("div._30jeq3").text();
      price = replce(price);

      let maxretailprice = listofproducts.find("div._3I9_wc").text();

      if (maxretailprice === "") {
        maxretailprice = price;
      } else {
        maxretailprice = replce(maxretailprice);
      }

      let ads = listofproducts.find("div._2tfzpE>span").text();
      if (ads === "Ad") {
        ads = "Yes";
      } else {
        ads = "No";
      }

      let element = {
        imagelink,
        productlink: `https://www.flipkart.com${link}`,
        price,
        maxretailprice,
        IsAds: ads,
      };
      products.push(element); //storing the details in an array
    });
    return products;
  } catch (error) {
    return [{ message: "Can not fetch" }];
  }
};

module.exports = { flipkartfetchUrlDetails };
