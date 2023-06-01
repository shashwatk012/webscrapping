"use strict";
const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { headers, replce } = require("../text");

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

    let lastHeight = await page.evaluate("document.body.scrollHeight");

    while (true) {
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForTimeout(1000); // sleep a bit
      let newHeight = await page.evaluate("document.body.scrollHeight");
      if (newHeight === lastHeight) {
        break;
      }
      lastHeight = newHeight;
    }

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
    await page.close();
    await browser.close();
    console.log(error);
    return [{ message: "Can not fetch" }];
  }
};

module.exports = { check };
