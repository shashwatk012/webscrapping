const axios = require("axios");
const cheerio = require("cheerio");

const fetchReviews = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36",
      },
    });
    const html = response.data;

    const $ = cheerio.load(html);
    const noReviews = $(".a-row.a-spacing-base.a-size-base");
    numberReviews = noReviews.html().trim();
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
    return [numberReviews, reviews1];
  } catch (error) {
    console.log("jbhjg");
    // throw error;
  }
};

module.exports = { fetchReviews };
