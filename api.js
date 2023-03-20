const axios = require("axios");
const cheerio = require("cheerio");

const fetchBeards = async () => {
  try {
    const response = await axios.get("https://www.amazon.in/s?k=beardo");

    const html = response.data;

    const $ = cheerio.load(html);

    const beards = [];

    $(
      "div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20"
    ).each((_idx, el) => {
      const beardo = $(el);
      const title = beardo
        .find("span.a-size-base-plus.a-color-base.a-text-normal")
        .text();

      const image = beardo.find("img.s-image").attr("src");

      const link = beardo.find("a.a-link-normal.a-text-normal").attr("href");

      const reviews = beardo
        .find(
          "div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small"
        )
        .children("span")
        .last()
        .attr("aria-label");

      const stars = beardo
        .find("div.a-section.a-spacing-none.a-spacing-top-micro > div > span")
        .attr("aria-label");

      const price = beardo.find("span.a-price-whole").text();

      let element = {
        title,
        image,
        link: `https://amazon.com${link}`,
        price,
      };

      if (reviews) {
        element.reviews = reviews;
      }

      if (stars) {
        element.stars = stars;
      }
      beards.push(element);
    });
    return beards;
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchBeards };
