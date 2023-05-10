const axios = require("axios");
const cheerio = require("cheerio");
const { headers, apikey } = require("./flipkarttext");
const scrapingbee = require("scrapingbee");

const amazonfetchUrlDetails = async (url, index) => {
  try {
    var client = new scrapingbee.ScrapingBeeClient(apikey[index]);
    var response = await client.get({
      url: url,
      headers,
      params: {},
    });

    var decoder = new TextDecoder();
    var text = decoder.decode(response.data);
    const $ = cheerio.load(text);

    const products = [];

    $(
      "div.s-result-item.s-asin.sg-col.s-widget-spacing-small" // selecting the elements to be scrapped
    ).each(async (_idx, el) => {
      const product = $(el);
      let ProductName = product // scraping the product name
        .find("span.a-color-base.a-text-normal")
        .text();

      const imagelink = product.find("img.s-image").attr("src"); // scraping the image

      let productlink = product // scraping the link of the product
        .find(
          "a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal"
        )
        .attr("href");

      let Ratings = product // scraping the number of global ratings
        .find(
          "div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small"
        )
        .children("span")
        .last()
        .attr("aria-label");

      let stars = product // scraping the ratings
        .find("div.a-section.a-spacing-none.a-spacing-top-micro > div > span")
        .attr("aria-label");

      let price = product.find("span.a-price-whole").text();

      let maxretailprice = product
        .find("span.a-price.a-text-price>span.a-offscreen")
        .text();

      if (maxretailprice === "") {
        maxretailprice = price;
      } else {
        maxretailprice = maxretailprice.substring(1);
      }

      let element = {
        ProductName,
        imagelink,
        productlink: `https://amazon.in${productlink}`,
        price,
        maxretailprice,
      };

      if (stars) {
        stars = stars.substring(0, 3);
        element.stars = stars;
      }

      if (Ratings) {
        const result = Ratings.replace(/\D/g, "");
        element.Ratings = result;
      }
      products.push(element); //storing the details in an array
    });
    return products;
  } catch (error) {
    return {};
  }
};

module.exports = { amazonfetchUrlDetails };
