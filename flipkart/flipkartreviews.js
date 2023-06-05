// This page scraps the reviews of the product

const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { headers, replce } = require("../text");

const scrapreviews = (html, typeofreviews, ProductName) => {
  const $ = cheerio.load(html);

  let review = [];
  let obj = {};

  // Scraping the number of all type of ratings such as 5 star, 4 star
  $("div._13sFCC.miQW6D>ul._36LmXx>li._28Xb_u>div._1uJVNT").each(
    async (_idx, el) => {
      const x = $(el);
      obj[`${5 - _idx} star ratings`] = replce(x.text());
    }
  );
  let date = new Date();

  date = date.toLocaleDateString();

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
          date,
        });
      } else if (title) {
        review.push({
          title: title,
          summary: null,
          type: type,
          ProductName,
          date,
        });
      } else {
        review.push({
          title: null,
          summary: summary,
          type: type,
          ProductName,
          date,
        });
      }
      title = null;
      summary = null;
    }
  );
  obj[typeofreviews] = review;

  return obj;
};

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

      // function in text.js to scrap the required details from the page
      return scrapreviews(html, typeofreviews, ProductName);
    } catch (e) {
      return { message: "Some error occured" };
    }
  }
};

module.exports = { flipkartfetchReviews };
