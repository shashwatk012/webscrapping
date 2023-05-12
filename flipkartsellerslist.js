const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { headers, apikey, replce } = require("./flipkarttext");

const flipkartsellerslist = async (url) => {
  try {
    const browser = await puppeteer.launch({
      // headless: "new",
      headless: `true`,
      // `headless: 'new'` enables new Headless;
      // `headless: false` enables “headful” mode.
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });

    await page.waitForSelector("div._2Y3EWJ");

    const html = await page.content();
    const $ = cheerio.load(html);

    let count = 0;
    let sellersDetails = [];
    $("div._2Y3EWJ").each(async (_idx, el) => {
      const x = $(el);
      const sellersName = x.find("div._3enH42>span").text();
      let Ratings = x.find("div._3LWZlK._2GCNvL").text();
      Ratings = replce(Ratings);
      let price = x.find("div._25b18c>div._30jeq3").text();
      price = replce(price);
      let flipkartassured = x.find("div._3J2v2E>div>img").attr("src");
      if (flipkartassured) {
        flipkartassured = true;
      } else {
        flipkartassured = false;
      }
      sellersDetails.push({
        sellersName,
        price,
        Ratings,
        flipkartassured,
      });
      count++;
    });
    await browser.close();
    return { NumberofSellers: count, sellersDetails };
  } catch (error) {
    return { NumberofSellers: error, sellersDetails: "limitover" };
  }
};

module.exports = { flipkartsellerslist };
