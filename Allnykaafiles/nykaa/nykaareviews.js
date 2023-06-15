const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { headers, replce } = require("../text");

const reviews = (html, ProductName) => {
  // cheerio nodejs module to load html
  let $ = cheerio.load(html);
  let date = new Date();

  date = date.toLocaleDateString();

  let obj = {},
    review = [];
  // Scraping the reviewS
  $("div.css-z7l7ua").each(async (_idx, el) => {
    const x = $(el);
    let name = x.find("span.css-amd8cf").text();
    let title = x.find("h4.css-tm4hnq").text();
    let summary = x.find("p.css-1n0nrdk").text();
    let type = "Most Useful";

    if (title && summary) {
      review.push({
        name,
        title: title,
        summary: summary,
        type: type,
        ProductName,
        date,
      });
    } else if (title) {
      review.push({
        name,
        title: title,
        summary: null,
        type: type,
        ProductName,
        date,
      });
    } else {
      review.push({
        name,
        title: null,
        summary: summary,
        type: type,
        ProductName,
        date,
      });
    }
    title = null;
    summary = null;
  });
  obj["MOST_USEFUL"] = review;
  return obj;
};

const nykaafetchReviews = async (url, browser, page, ProductName) => {
  // function to scrap complete data about one product
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

    const html = await page.content();

    await page.close();
    await browser.close();

    return reviews(html, ProductName);
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

      return reviews(html, ProductName);
    } catch (e) {
      return { message: "NOT POSSIBLE" };
    }
  }
};

module.exports = { nykaafetchReviews };
