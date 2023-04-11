const axios = require("axios");
const cheerio = require("cheerio");
const { headers } = require("./text");

const flipkartfetchReviews = async (url) => {
  try {
    const response = await axios.get(url, headers);
    const html = response.data;

    const $ = cheerio.load(html);
    let review = [];
    const globalReviews = $("div.col-4-12._17ETNY>div.col")
      .children("div")
      .last()
      .text();
    let obj = {};
    $("div._13sFCC.miQW6D>ul._36LmXx>li._28Xb_u>div._1uJVNT").each(
      async (_idx, el) => {
        const x = $(el);
        obj[`${5 - _idx} star ratings`] = x.text();
      }
    );
    obj.globalReviews = globalReviews;
    $("div._1AtVbE>div._27M-vq>div.col>div.col._2wzgFH.K0kLPL").each(
      async (_idx, el) => {
        const x = $(el);
        const title = x.find("p._2-N8zT").text();
        const summary = x.find("div.t-ZTKy>div>div").text();
        review.push({
          title: title,
          summary: summary,
        });
      }
    );
    obj["reviews"] = review;
    return obj;
  } catch (error) {
    console.log("review");
    throw error;
  }
};

module.exports = { flipkartfetchReviews };
