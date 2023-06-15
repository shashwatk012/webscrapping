const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const amazonfetchUrlDetails = async (url, browser, page) => {
  try {
    browser = await puppeteer.launch({
      // headless: "new",
      headless: `true`,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      // `headless: 'new'` enables new Headless;
      // `headless: false` enables “headful” mode.
    });
    page = await browser.newPage();
    await page.goto(url);

    // let lastHeight = await page.evaluate("document.body.scrollHeight");

    // while (true) {
    //   await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    //   await page.waitForTimeout(1000); // sleep a bit
    //   let newHeight = await page.evaluate("document.body.scrollHeight");
    //   if (newHeight === lastHeight) {
    //     break;
    //   }
    //   lastHeight = newHeight;
    // }

    const html = await page.content();

    await page.close();
    // await browser.close();
    const $ = cheerio.load(html);

    const products = [];

    $(
      "div.s-result-item.s-asin.sg-col.s-widget-spacing-small" // selecting the elements to be scrapped
    ).each(async (_idx, el) => {
      const product = $(el);

      let productlink = product // scraping the link of the product
        .find(
          "a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal"
        )
        .attr("href");

      let element = {
        productlink: `https://amazon.in${productlink}`,
      };

      products.push(element); //storing the details in an array
    });
    return products;
  } catch (error) {
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

// let ProductName = product // scraping the product name
//         .find("span.a-color-base.a-text-normal")
//         .text();

//       const imagelink = product.find("img.s-image").attr("src"); // scraping the image

// let Ratings = product // scraping the number of global ratings
// .find(
//   "div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small"
// )
// .children("span")
// .last()
// .attr("aria-label");

// let stars = product // scraping the ratings
// .find("div.a-section.a-spacing-none.a-spacing-top-micro > div > span")
// .attr("aria-label");

// let price = product.find("span.a-price-whole").text();
// price = Number(price);

// let maxretailprice = product
// .find("span.a-price.a-text-price>span.a-offscreen")
// .text();

// if (maxretailprice === "") {
// maxretailprice = price;
// } else {
// maxretailprice = maxretailprice.substring(1);
// maxretailprice = Number(maxretailprice);
// }

// if (stars) {
//   stars = stars.substring(0, 3);
//   stars = Number(stars);
//   element.stars = stars;
// }

// if (Ratings) {
//   let result = Ratings.replace(/\D/g, "");
//   result = Number(result);
//   element.Ratings = result;
// }
