const axios = require("axios");
const cheerio = require("cheerio");

const fetchBeards = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36",
      },
    });

    const html = response.data;

    const $ = cheerio.load(html);

    const beards = [];

    $(
      "div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20"
    ).each(async (_idx, el) => {
      const beardo = $(el);
      const ProductName = beardo
        .find("span.a-size-base-plus.a-color-base.a-text-normal")
        .text();

      const image = beardo.find("img.s-image").attr("src");

      const link = beardo
        .find(
          "a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal"
        )
        .attr("href");

      const reviews = beardo
        .find(
          "div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small"
        )
        .children("span")
        .last()
        .attr("aria-label");

      let stars = beardo
        .find("div.a-section.a-spacing-none.a-spacing-top-micro > div > span")
        .attr("aria-label");

      const price = beardo.find("span.a-price-whole").text();

      let maxretailprice = beardo
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
      beards.push(element);
    });
    return beards;
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchBeards };
