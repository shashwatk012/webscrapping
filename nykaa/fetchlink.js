"use strict";
const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { headers, replce } = require("../text");

const fetchlink = async (url, browser, page) => {
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

    let html = await page.content();

    let $ = cheerio.load(html);
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
    let links = [];
    console.log($("div.css-1d5wdox>h1.css-1gc4x7i").text());
    // $("div.css-16kpx0l>ul.css-1uxnb1o>li").each(async (_idx, el) => {
    //   const x = $(el);
    //   console.log("jhjb");
    //   const link = x.find("a.name").attr("href");
    //   links.push(link);
    // });
    console.log(links);

    await page.close();
    await browser.close();

    return { link: `https://www.nykaa.com${links[links.length - 1]}` };
  } catch (error) {
    await page.close();
    await browser.close();
    console.log(error);
    return [{ message: "Can not fetch" }];
  }
};

module.exports = { fetchlink };
