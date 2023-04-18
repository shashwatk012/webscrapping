const axios = require("axios");
const cheerio = require("cheerio");
const { headers } = require("./flipkarttext");

const flipkartfetchReviews = async (url, typeofreviews) => {
  try {
    let review = [];
    let obj = {};
    for (let i = 0; i < 50; i++) {
      let urls = url + `&page=${i + 1}`;
      const response = await axios.get(urls, headers);
      const html = response.data;

      const $ = cheerio.load(html);
      const globalReviews = $("div.col-4-12._17ETNY>div.col")
        .children("div")
        .last()
        .text();
      $("div._13sFCC.miQW6D>ul._36LmXx>li._28Xb_u>div._1uJVNT").each(
        async (_idx, el) => {
          const x = $(el);
          obj[`${5 - _idx} star ratings`] = x.text();
        }
      );
      obj.globalReviews = globalReviews;
      let flag = true;
      $("div._1AtVbE>div._27M-vq>div.col>div.col._2wzgFH.K0kLPL").each(
        async (_idx, el) => {
          const x = $(el);
          const title = x.find("p._2-N8zT").text();
          const summary = x.find("div.t-ZTKy>div>div").text();
          review.push({
            title: title,
            summary: summary,
          });
          flag = false;
        }
      );
      if (flag) {
        break;
      }
      obj[typeofreviews] = review;
    }
    return obj;
  } catch (error) {
    console.log("review");
    throw error;
  }
};

module.exports = { flipkartfetchReviews };
