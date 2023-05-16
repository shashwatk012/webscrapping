const cheerio = require("cheerio");
const { headers, apikey } = require("../text");
const scrapingbee = require("scrapingbee");
const puppeteer = require("puppeteer");

const amazonfetchReviews = async (url, index) => {
  try {
    // var client = new scrapingbee.ScrapingBeeClient(apikey[index]);
    // var response = await client.get({
    //   url: url,
    //   headers,
    //   params: {},
    // });

    // var decoder = new TextDecoder();
    // var text = decoder.decode(response.data);
    const browser = await puppeteer.launch({
      // headless: "new",
      headless: `true`,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      // `headless: 'new'` enables new Headless;
      // `headless: false` enables “headful” mode.
    });

    const page = await browser.newPage();
    await page.goto(url);

    let lastHeight = await page.evaluate("document.body.scrollHeight");

    while (true) {
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForTimeout(2000); // sleep a bit
      let newHeight = await page.evaluate("document.body.scrollHeight");
      if (newHeight === lastHeight) {
        break;
      }
      lastHeight = newHeight;
    }

    const html = await page.content();
    const $ = cheerio.load(html);

    let obj = {};
    // Scraping the Global number of reviews
    const noReviews = $(".a-row.a-spacing-base.a-size-base");
    numberReviews = noReviews.html();
    if (numberReviews) {
      numberReviews = numberReviews.trim();
      let sp = numberReviews.split(",");
      numberReviews = sp[1].replace(/\D/g, "");
    }

    //Scraping the number of all type of ratings such as 5 star, 4 star
    $("tr.a-histogram-row.a-align-center").each(async (_idx, el) => {
      // selecting the ratings element and the looping to get the different ratings
      const x = $(el);
      let key = x.find("td.aok-nowrap>span.a-size-base>a.a-link-normal").text();
      let value = x
        .find("td.a-text-right.a-nowrap>span.a-size-base>a.a-link-normal")
        .text();
      if (key) {
        key = key.trim();
      }
      if (value) {
        value = value.trim(); // triming to trim the spaces in the string
      }

      if (key !== "" && value !== "") {
        const result = value.replace(/\D/g, "");
        obj[`${key} ratings`] = result; // saving the scraped data in an object
      }
    });

    // Scraping the reviews
    const reviews1 = [];
    $("div.a-section.review.aok-relative").each(async (_idx, el) => {
      const reviews = $(el);
      const name = reviews.find("span.a-profile-name").text();
      const review = reviews
        .find("span.a-size-base.review-text.review-text-content>span")
        .text();
      reviews1.push({
        name: name,
        review: review,
      });
    });
    obj["Reviews"] = numberReviews;
    obj["top10reviews"] = reviews1;
    console.log(obj);
    return obj;
  } catch (error) {
    return {};
  }
};

module.exports = { amazonfetchReviews };
