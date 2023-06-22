const cheerio = require("cheerio");
const amazontext = require("./amazontext");
const scrapingbee = require("scrapingbee");
const puppeteer = require("puppeteer-extra");

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const { executablePath } = require("puppeteer");

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const amazonfetchUrlDetails = async (url) => {
  try {
    // var client = new scrapingbee.ScrapingBeeClient(
    //   "I1VKMCIP31YMI7PKCT2R2WXO6D3UY5OW59GPK6IKOWYKAXIHLA585HLENJ0CZ51SFMTTYIGRAW7ONVZG"
    // );
    // var response = await client.get({
    //   url: url,
    //   params: {
    //     // premium_proxy: "True",
    //     block_ads: "True",
    //     block_resources: "True",
    //   },
    // });

    // var decoder = new TextDecoder();
    // var html = decoder.decode(response.data);

    let browser = await puppeteer.launch({
      headless: `true`, // indicates that we want the browser visible
      defaultViewport: false, // indicates not to use the default viewport size but to adjust to the user's screen resolution instead
      // userDataDir: "./tmp", // caches previous actions for the website. Useful for remembering if we've had to solve captchas in the past so we don't have to resolve them
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: executablePath(),
    });
    let page = await browser.newPage();

    // await page.authenticate();
    await page.goto(url);

    await page.waitForTimeout(1000);

    let html = await page.content();
    console.log(html.substring(1, 100));
    await page.screenshot({
      path: "screenshot.jpg",
    });

    let $ = cheerio.load(html);

    let captchalink = $("div.a-row.a-text-center>img").attr("src");

    let captcha = undefined;

    if (captchalink) {
      console.log(captchalink);

      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      readline.question("Type the captcha", (name) => {
        console.log(`Captcha is ${name}!`);
        captcha = name;
        readline.close();
      });

      await page.waitForTimeout(20000);

      await page.type("input#captchacharacters", captcha);

      await page.click(
        "span.a-button.a-button-primary.a-span12>span.a-button-inner>button.a-button-text"
      );

      await page.waitForTimeout(5000);
    }

    html = await page.content();

    await page.close();
    await browser.close();

    // cheerio nodejs module to load html
    $ = cheerio.load(html);

    const products = [];

    $(amazontext.A_ALLPRODUCTLINK_CN).each(async (_idx, el) => {
      // selecting the elements to be scrapped
      const product = $(el);

      let productlink = product // scraping the link of the product
        .find(amazontext.A_PRODUCTLINK_CN)
        .attr("href");

      let element = {
        Productlink: `${amazontext.AMAZON_PAGE_LINK}${productlink}`,
      };

      products.push(element); //storing the details in an array
    });
    return products;
  } catch (error) {
    console.log(error);
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
    return [];
  }
};

module.exports = { amazonfetchUrlDetails };
