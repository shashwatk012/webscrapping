"use strict";
const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { headers, replce } = require("../../text");

const check = async (url, browser, page) => {
  try {
    // api to get html of the required page
    browser = await puppeteer.launch({
      // headless: "new",
      headless: `true`,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      // `headless: 'new'` enables new Headless;
      // `headless: false` enables “headful” mode.
    });

    page = await browser.newPage();
    await page.goto(url);

    // await page.waitForSelector("button.load-more-button");

    let html = await page.content();

    let $ = cheerio.load(html);
    let load = $("button.load-more-button").text();
    console.log(load);
    await page.close();
    await browser.close();
    if (load) {
      return true;
    }
    return false;
  } catch (error) {
    try {
      if (page) {
        await page.close();
      }
      if (browser) {
        await browser.close();
      }
      // api to get html of the required page
      const response = await axios.get(url, headers);

      const html = response.data;

      let $ = cheerio.load(html);

      let load = $("button.load-more-button").text();
      console.log(load);
      if (load) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(error);
      return "NOT POSSIBLE";
    }
  }
};

module.exports = { check };
