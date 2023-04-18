const axios = require("axios");
const cheerio = require("cheerio");
const { headers } = require("./flipkarttext");
const scrapingbee = require("scrapingbee");

const amazonfetchUrlDetails = async (url) => {
  try {
    // const response = await axios.get(url, headers);

    // const html = response.data;

    // const $ = cheerio.load(html);
    var client = new scrapingbee.ScrapingBeeClient(
      "XBILYKDTAJTJB46IRUBREAX4QQ6M1746J3N4MM6JCDZKWSRDSWWVST7KTS63B48NDYM06TGLT3XLCB21"
    );
    var response = await client.get({
      url: url,
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

      const image = product.find("img.s-image").attr("src"); // scraping the image

      let link = product // scraping the link of the product
        .find(
          "a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal"
        )
        .attr("href");

      let reviews = product // scraping the number of global ratings
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
        image,
        link: `https://amazon.in${link}`,
        price,
        maxretailprice,
      };

      if (stars) {
        stars = stars.substring(0, 3);
        element.stars = stars;
      }

      if (reviews) {
        element.GlobalRatings = reviews;
      }
      products.push(element); //storing the details in an array
    });
    return products;
  } catch (error) {
    throw error;
  }
};

module.exports = { amazonfetchUrlDetails };
