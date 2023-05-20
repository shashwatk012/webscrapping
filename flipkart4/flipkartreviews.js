const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { headers, replce } = require("../text");

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

    // await page.waitForSelector(
    //   "div._1AtVbE>div._27M-vq>div.col>div.col._2wzgFH.K0kLPL"
    // );
    await page.evaluate(() => {
      document
        .querySelector("div._1AtVbE>div._27M-vq>div.col>div.col._2wzgFH.K0kLPL")
        .scrollIntoView();
    });

    // await page.waitForTimeout(1000);

    // let lastHeight = await page.evaluate("document.body.scrollHeight");

    // while (true) {
    //   await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    //   await page.waitForTimeout(3000); // sleep a bit
    //   let newHeight = await page.evaluate("document.body.scrollHeight");
    //   if (newHeight === lastHeight) {
    //     break;
    //   }
    //   lastHeight = newHeight;
    // }

    const html = await page.content();
    await page.close();
    await browser.close();

    const $ = cheerio.load(html);

    console.log(typeofreviews);
    let review = [];
    let obj = {};

    // Scraping the number of all type of ratings such as 5 star, 4 star
    $("div._13sFCC.miQW6D>ul._36LmXx>li._28Xb_u>div._1uJVNT").each(
      async (_idx, el) => {
        const x = $(el);
        obj[`${5 - _idx} star ratings`] = replce(x.text());
      }
    );

    // Scraping the reviewS
    $("div._1AtVbE>div._27M-vq>div.col>div.col._2wzgFH.K0kLPL").each(
      async (_idx, el) => {
        const x = $(el);
        let title = x.find("p._2-N8zT").text();
        let summary = x.find("div.t-ZTKy>div>div").last().text();
        let type;
        if (typeofreviews === "POSITIVE_FIRST") {
          type = "POSITIVE";
        } else {
          type = "NEGATIVE";
        }
        if (title && summary) {
          review.push({
            title: title,
            summary: summary,
            type: type,
            ProductName,
          });
        } else if (title) {
          review.push({
            title: title,
            type: type,
            ProductName,
          });
        } else {
          review.push({
            summary: summary,
            type: type,
            ProductName,
          });
        }
        title = null;
        summary = null;
      }
    );
    obj[typeofreviews] = review;

    return obj;
  } catch (error) {
    const html = await page.content();
    await page.close();
    await browser.close();
    const $ = cheerio.load(html);

    console.log("ERROR");
    let review = [];
    let obj = {};

    // Scraping the number of all type of ratings such as 5 star, 4 star
    $("div._13sFCC.miQW6D>ul._36LmXx>li._28Xb_u>div._1uJVNT").each(
      async (_idx, el) => {
        const x = $(el);
        obj[`${5 - _idx} star ratings`] = replce(x.text());
      }
    );

    // Scraping the reviewS
    $("div._1AtVbE>div._27M-vq>div.col>div.col._2wzgFH.K0kLPL").each(
      async (_idx, el) => {
        const x = $(el);
        let title = x.find("p._2-N8zT").text();
        let summary = x.find("div.t-ZTKy>div>div").last().text();
        let type;
        if (typeofreviews === "POSITIVE_FIRST") {
          type = "POSITIVE";
        } else {
          type = "NEGATIVE";
        }
        if (title && summary) {
          review.push({
            title: title,
            summary: summary,
            type: type,
            ProductName,
          });
        } else if (title) {
          review.push({
            title: title,
            type: type,
            ProductName,
          });
        } else {
          review.push({
            summary: summary,
            type: type,
            ProductName,
          });
        }
        title = null;
        summary = null;
      }
    );
    obj[typeofreviews] = review;

    return obj;
  }
};

module.exports = { flipkartfetchReviews };
