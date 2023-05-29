"use strict";
// This page scrapps the sellers details

const math = require("mathjs");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { headers, apikey, replce } = require("../text");

const flipkartsellerslist = async (url, browser, page, ProductName) => {
  try {
    browser = await puppeteer.launch({
      headless: `true`,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });

    await page.waitForSelector("div._2Y3EWJ");

    const html = await page.content();
    await page.close();
    await browser.close();

    const $ = cheerio.load(html);
    console.log("sellers");

    let count = 0,
      mn = 1000000,
      mx = 0;
    let sellersDetails = [],
      pricearr = [];
    $("div._2Y3EWJ").each(async (_idx, el) => {
      const x = $(el);

      const sellersName = x.find("div._3enH42>span").text();

      let Ratings = x.find("div._3LWZlK._2GCNvL").text();
      Ratings = replce(Ratings);

      let price = x.find("div._25b18c>div._30jeq3").text();
      price = replce(price);
      pricearr.push(price);
      mx = Math.max(mx, price);
      mn = Math.min(mn, price);

      let flipkartassured = x.find("div._3J2v2E>div>img").attr("src");
      if (flipkartassured) {
        flipkartassured = 1;
      } else {
        flipkartassured = 0;
      }
      let date = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      date = date.toLocaleString("en-IN", options);
      sellersDetails.push({
        sellersName,
        price,
        Ratings,
        flipkartassured,
        ProductName,
        date,
      });
      count++;
    });
    const stDev = math.std(pricearr);

    return {
      "St-dev-Price": stDev,
      "Min Price": mn,
      "Max Price": mx,
      NumberofSellers: count,
      sellersDetails,
    };
  } catch (error) {
    await page.close();
    await browser.close();
    return { message: "Can not fetch" };
  }
};

module.exports = { flipkartsellerslist };
