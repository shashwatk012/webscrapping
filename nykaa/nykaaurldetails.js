"use strict";
const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { headers, replce } = require("../text");

const nykaafetchUrlDetails = async (url, browser, page) => {
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

    await page.waitForSelector("button.load-more-button");

    let html = await page.content();

    let $ = cheerio.load(html);
    let load = $("button.load-more-button").text();
    console.log(load);
    let i = 0;
    while (load) {
      await page.click("button.load-more-button");
      // await page.waitForSelector("button.load-more-button");
      html = await page.content();

      $ = cheerio.load(html);
      load = $("button.load-more-button").text();
      console.log(load);
      console.log(i);
      i++;
      if (i == 7) {
        break;
      }
    }

    const nykaa = [];

    $("div#product-list-wrap>div.productWrapper.css-xin9gt").each(
      async (_idx, el) => {
        // selecting the elements to be scrapped
        const links = $(el);

        // let imagelink = links.find(imglink).attr("src"); // scraping the image

        const link = links // scraping the link of the product
          .find("a")
          .attr("href");

        let element = {
          // imagelink,
          productlink: `https://www.nykaa.com${link}`,
        };
        nykaa.push(element); //storing the details in an array
      }
    );
    await page.close();
    await browser.close();
    return nykaa;
  } catch (error) {
    console.log(error);
    return [{ message: "Can not fetch" }];
  }
};

module.exports = { nykaafetchUrlDetails };
