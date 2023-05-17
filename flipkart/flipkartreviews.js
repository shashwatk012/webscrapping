const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { headers, replce } = require("../text");
let browser, page;
const flipkartfetchReviews = async (url, typeofreviews) => {
  try {
    let review = [];
    let obj = {};
    for (let i = 0; i < 1; i++) {
      let urls = url + `&page=${i + 1}`;
      browser = await puppeteer.launch({
        headless: `true`,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      page = await browser.newPage();
      await page.goto(urls);

      // await page.waitForSelector(
      //   "div._1AtVbE>div._27M-vq>div.col>div.col._2wzgFH.K0kLPL"
      // );
      await page.evaluate(() => {
        document
          .querySelector(
            "div._1AtVbE>div._27M-vq>div.col>div.col._2wzgFH.K0kLPL"
          )
          .scrollIntoView();
      });

      await page.waitForTimeout(3000);

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

      // Scraping the Global number of reviews
      let globalReviews = $("div.col-4-12._17ETNY>div.col")
        .children("div")
        .last()
        .text();

      obj.globalReviews = globalReviews;
      globalReviews = null;

      // Scraping the number of all type of ratings such as 5 star, 4 star
      $("div._13sFCC.miQW6D>ul._36LmXx>li._28Xb_u>div._1uJVNT").each(
        async (_idx, el) => {
          const x = $(el);
          obj[`${5 - _idx} star ratings`] = replce(x.text());
        }
      );

      // Scraping the reviews
      let flag = true;
      $("div._1AtVbE>div._27M-vq>div.col>div.col._2wzgFH.K0kLPL").each(
        async (_idx, el) => {
          const x = $(el);
          let title = x.find("p._2-N8zT").text();
          let summary = x.find("div.t-ZTKy>div>div").text();
          review.push({
            title: title,
            summary: summary,
          });
          title = null;
          summary = null;
          flag = false;
        }
      );
      // if (flag) {
      //   break;
      // }
      if (review.length > 10) {
        break;
      }
    }
    obj[typeofreviews] = review;

    return obj;
  } catch (error) {
    await page.close();
    await browser.close();
    return { message: "Can not fetch" };
  }
};

module.exports = { flipkartfetchReviews };
