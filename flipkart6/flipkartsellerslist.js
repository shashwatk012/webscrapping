"use strict";
// This page scrapps the sellers details

const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { headers, apikey, replce, sellers } = require("../text");

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

    return sellers(html, ProductName);
  } catch (error) {
    await page.close();
    await browser.close();
    return { message: "Can not fetch" };
  }
};

module.exports = { flipkartsellerslist };
