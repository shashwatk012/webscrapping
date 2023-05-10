const axios = require("axios");
const cheerio = require("cheerio");
const { headers, apikey } = require("./flipkarttext");
const scrapingbee = require("scrapingbee");

const amazonfetchReviews = async (url, index) => {
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

    let obj = {};
    // Scraping the Global number of reviews
    const noReviews = $(".a-row.a-spacing-base.a-size-base");
    numberReviews = noReviews.html();
    if (numberReviews) {
      numberReviews = numberReviews.trim();
      let sp = numberReviews.split(",");
      numberReviews = sp[1].replace(/\D/g, "");
    }

    //Scraping the number of all type of ratings such as 5 star, 4 star
    $("tr.a-histogram-row.a-align-center").each(async (_idx, el) => {
      // selecting the ratings element and the looping to get the different ratings
      const x = $(el);
      let key = x.find("td.aok-nowrap>span.a-size-base>a.a-link-normal").text();
      let value = x
        .find("td.a-text-right.a-nowrap>span.a-size-base>a.a-link-normal")
        .text();
      if (key) {
        key = key.trim();
      }
      if (value) {
        value = value.trim(); // triming to trim the spaces in the string
      }

      if (key !== "" && value !== "") {
        const result = value.replace(/\D/g, "");
        obj[`${key} ratings`] = result; // saving the scraped data in an object
      }
    });

    // Scraping the reviews
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
    obj["Reviews"] = numberReviews;
    obj["top10reviews"] = reviews1;
    console.log(obj);
    return obj;
  } catch (error) {
    return {};
  }
};

module.exports = { amazonfetchReviews };
