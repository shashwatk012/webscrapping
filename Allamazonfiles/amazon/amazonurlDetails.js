const cheerio = require("cheerio");
const amazontext = require("./amazontext");

const amazonfetchUrlDetails = async (url, browser, page) => {
  try {
    page = await browser.browser.newPage();
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
    return [];
  }
};

module.exports = { amazonfetchUrlDetails };
