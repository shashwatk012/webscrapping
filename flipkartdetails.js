const axios = require("axios");
const cheerio = require("cheerio");
const { headers } = require("./text");

const flipkartfetchIndividualDetails = async (url) => {
  // function to scrap complete data about ane product
  try {
    const response = await axios.get(url, headers); // api to get html of the required page

    const html = response.data;

    const $ = cheerio.load(html); // cheerio nodejs module to load html
    let obj = {};

    const ProductName = $(
      "div._1AtVbE.col-12-12>div.aMaAEs>div>h1.yhB1nd>span.B_NuCI"
    )
      .text()
      .trim();
    if (ProductName !== undefined) {
      obj["ProductName"] = ProductName;
    }
    let ratings = $("span._2_R_DZ._2IRzS8").text(); // scraping the number of global ratings
    let stars = $("div._3LWZlK._138NNC").text(); // scraping the ratings
    if (stars && ratings) {
      obj.stars = stars;
      obj.GlobalRatings = ratings;
    } else {
      ratings = $("div.row._2afbiS>div.col-12-12>span").text(); // scraping the number of global ratings
      stars = $("div._2d4LTz").text();
      obj.stars = stars;
      obj.GlobalRatings = ratings;
    }

    $("div._1MR4o5>div._3GIHBu").each(async (_idx, el) => {
      //selecting the category element and the looping to get the category and sub-category
      const x = $(el);
      if (_idx !== 0) {
        if (_idx === 1) {
          const category = x.find("a._2whKao").text();
          obj[`Category`] = category;
        } else {
          const category = x.find("a._2whKao").text();
          if (category !== "") {
            obj[`Sub-category-${_idx - 1}`] = category;
          }
        }
      }
    });
    const reviewsLink = $("div.col.JOpGWq>a").attr("href");
    if (reviewsLink !== undefined) {
      obj["reviewsLink"] = `https://www.flipkart.com${reviewsLink}`; //scraping the link for the reviews
    }
    let highLits = [];
    $("div._2418kt>ul>li._21Ahn-").each(async (_idx, el) => {
      //selecting the product details element and the looping to get the complete product details
      const x = $(el);
      const p = x.text();
      highLits.push(p);

      if (highLits.length !== 0) {
        obj["HighLights"] = highLits;
      }
    });
    $("table._14cfVK>tbody>tr._1s_Smc.row").each(async (_idx, el) => {
      //selecting the product details element and the looping to get the complete product details
      const x = $(el);
      const key = x.find("td._1hKmbr.col.col-3-12").text();
      const value = x.find("li._21lJbe").text();
      if (key !== "" && value !== "") {
        obj[key] = value;
      }
    });
    return obj;
  } catch (error) {
    throw error;
  }
};

module.exports = { flipkartfetchIndividualDetails };
