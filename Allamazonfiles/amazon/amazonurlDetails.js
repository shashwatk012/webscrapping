const cheerio = require("cheerio");
const amazontext = require("./amazontext");

const amazonfetchUrlDetails = async (url, browser, page) => {
  try {
    page = await browser.browser.newPage();
    await page.goto(url);

    await page.waitForTimeout(1000);

    const html = await page.content();

    await page.close();

    const $ = cheerio.load(html);

    const products = [];

    $(amazontext.A_ALLPRODUCTLINK_CN).each(async (_idx, el) => {
      // selecting the elements to be scrapped
      const product = $(el);

      let productlink = product // scraping the link of the product
        .find(amazontext.A_PRODUCTLINK_CN)
        .attr("href");

      let element = {
        productlink: `${amazontext.AMAZON_PAGE_LINK}${productlink}`,
      };

      products.push(element); //storing the details in an array
    });
    return products;
  } catch (error) {
    if (page) {
      await page.close();
    }
    return [];
  }
};

module.exports = { amazonfetchUrlDetails };
