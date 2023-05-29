// This page scraps the reviews of the product

const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { headers, replce, scrapreviews } = require("../text");

const flipkartfetchReviews = async (
  url,
  typeofreviews,
  browser,
  page,
  ProductName
) => {
  try {
    browser = await puppeteer.launch({
      headless: `true`,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    page = await browser.newPage();
    await page.goto(url);

    await page.evaluate(() => {
      document
        .querySelector("div._1AtVbE>div._27M-vq>div.col>div.col._2wzgFH.K0kLPL")
        .scrollIntoView();
    });

    const html = await page.content();
    await page.close();
    await browser.close();

    // function in text.js to scrap the required details from the page
    return scrapreviews(html, typeofreviews, ProductName);
  } catch (error) {
    await page.close();
    await browser.close();
    const response = await axios.get(url, headers);

    const html = response.data;

    // function in text.js to scrap the required details from the page
    return scrapreviews(html, typeofreviews, ProductName);
  }
};

module.exports = { flipkartfetchReviews };
