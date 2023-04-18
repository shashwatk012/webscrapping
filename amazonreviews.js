const axios = require("axios");
const cheerio = require("cheerio");
const { headers } = require("./flipkarttext");
const scrapingbee = require("scrapingbee");

const amazonfetchReviews = async (url) => {
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
    const noReviews = $(".a-row.a-spacing-base.a-size-base");
    numberReviews = noReviews.html();
    if (numberReviews) {
      numberReviews = numberReviews.trim();
    }
    const reviews1 = [];
    $("div.a-section.review.aok-relative").each(async (_idx, el) => {
      const reviews = $(el);
      const name = reviews.find("span.a-profile-name").text();
      const review = reviews
        .find("span.a-size-base.review-text.review-text-content>span")
        .text();
      reviews1.push({
        name: name,
        review: review,
      });
    });
    console.log(numberReviews, reviews1);
    return [numberReviews, reviews1];
  } catch (error) {
    throw error;
    res.send(error);
  }
};

module.exports = { amazonfetchReviews };
