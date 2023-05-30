// This page scrapps the complete product details

const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { headers, replce, scrap, scrapdetails } = require("../text");

const flipkartfetchIndividualDetails = async (url, browser, page) => {
  // function to scrap complete data about one product
  try {
    // api to get html of the required page
    browser = await puppeteer.launch({
      headless: `true`,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    page = await browser.newPage();
    await page.goto(url);
    // await page.waitForSelector("div.col.JOpGWq>a");

    await page.evaluate(() => {
      document.querySelector("div.col.JOpGWq>a").scrollIntoView();
    });
    // await page.waitForTimeout(1000);
    const html = await page.content();
    await page.close();

    await browser.close();

    // function in text.js to scrap the required details from the page
    return scrapdetails(html);
  } catch (error) {
    await page.close();

    await browser.close();

    const response = await axios.get(url, headers);

    const html = response.data;

    // function in text.js to scrap the required details from the page
    return scrapdetails(html);
  }
};

module.exports = { flipkartfetchIndividualDetails };
