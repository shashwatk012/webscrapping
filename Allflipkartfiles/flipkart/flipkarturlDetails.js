"use strict";
const axios = require("axios");
const cheerio = require("cheerio");
const { headers, allProducts } = require("../text");

const flipkartfetchUrlDetails = async (url) => {
  try {
    const response = await axios.get(url, headers);

    const html = response.data;

    const $ = cheerio.load(html);

    const allLink = [];

    $(allProducts).each(async (_idx, el) => {
      // selecting the elements to be scrapped
      const links = $(el);

      const link = links // scraping the link of the product
        .find("a")
        .attr("href");

      let ads = links.find("div._2tfzpE>span").text();
      if (ads === "Ad") {
        ads = "Yes";
      } else {
        ads = "No";
      }

      let element = {
        productlink: `https://www.flipkart.com${link}`,
        IsAds: ads,
      };
      allLink.push(element); //storing the details in an array
    });
    return allLink;
  } catch (error) {
    return [{ message: "Can not fetch" }];
  }
};

module.exports = { flipkartfetchUrlDetails };
