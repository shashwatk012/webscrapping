const cheerio = require("cheerio");
const scrapingbee = require("scrapingbee");
const puppeteer = require("puppeteer");

const amazonfetchReviews = async (url, browser, page) => {
  try {
    page = await browser.browser.newPage();
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

    const html = await page.content();

    await page.close();
    // await browser.close();

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
    // const reviews1 = [];
    // $("div.a-section.review.aok-relative").each(async (_idx, el) => {
    //   const reviews = $(el);
    //   const name = reviews.find("span.a-profile-name").text();
    //   const review = reviews
    //     .find("span.a-size-base.review-text.review-text-content>span")
    //     .text();
    //   reviews1.push({
    //     name: name,
    //     review: review,
    //   });
    // });
    obj["Reviews"] = Number(numberReviews);
    // obj["top10reviews"] = reviews1;
    return obj;
  } catch (error) {
    try {
      if (page) {
        await page.close();
      }
      // if (browser) {
      //   await browser.close();
      // }
      return {};
    } catch (e) {
      return {};
    }
  }
};

module.exports = { amazonfetchReviews };
