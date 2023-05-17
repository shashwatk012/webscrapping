"use strict";
const axios = require("axios");
const scrapingbee = require("scrapingbee");
const cheerio = require("cheerio");
const { headers, allProducts, imglink, replce } = require("../text");

const flipkartfetchUrlDetails = async (url) => {
  try {
    const response = await axios.get(url, headers);

    const html = response.data;

    const $ = cheerio.load(html);

    const beards = [];

    $(allProducts).each(async (_idx, el) => {
      // selecting the elements to be scrapped
      const beardo = $(el);
      let imagelink = beardo.find(imglink).attr("src"); // scraping the image
      if (!imagelink) {
        imagelink = beardo.find("img._2r_T1I").attr("src"); // scraping the image
      }

      const link = beardo // scraping the link of the product
        .find("a")
        .attr("href");

      let price = beardo.find("div._30jeq3").text();
      price = replce(price);

      let maxretailprice = beardo.find("div._3I9_wc").text();

      if (maxretailprice === "") {
        maxretailprice = price;
      } else {
        maxretailprice = replce(maxretailprice);
      }
      let element = {
        imagelink,
        productlink: `https://www.flipkart.com${link}`,
        price,
        maxretailprice,
      };
      beards.push(element); //storing the details in an array
    });
    return beards;
  } catch (error) {
    return [{ message: "Can not fetch" }];
  }
};

module.exports = { flipkartfetchUrlDetails };
