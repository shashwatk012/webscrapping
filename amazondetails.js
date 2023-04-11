const axios = require("axios");
const cheerio = require("cheerio");
const { headers } = require("./text");

const amazonfetchIndividualDetails = async (url) => {
  // function to scrap complete data about ane product
  try {
    const response = await axios.get(url, headers); // api to get html of the required page

    const html = response.data;

    const $ = cheerio.load(html); // cheerio nodejs module to load html
    let obj = {};

    $(
      ".a-section.feature.detail-bullets-wrapper.bucket>ul.a-unordered-list.a-nostyle.a-vertical.a-spacing-none.detail-bullet-list"
    ).each(async (_idx, el) => {
      const x = $(el);
      if (_idx === 0) {
        let p = x.find("span.a-list-item").text();
        if (p) {
          p = p.trim();
        }
        let ranks = p.replace("Best Sellers Rank:", "");
        ranks = ranks.replace("(See Top 100 in Beauty)", "");
        if (ranks) {
          obj["Best Sellers Rank"] = ranks;
        }
      }
    });

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
        obj[`${key} ratings`] = value; // saving the scraped data in an object
      }
    });

    const reviewsLink = $("a.a-link-emphasis.a-text-bold").attr("href");
    obj["reviewsLink"] = `https://amazon.in${reviewsLink}`; //scraping the link for the reviews

    const packageSize = $(
      "div.a-row.a-spacing-micro.singleton>span.selection"
    ).html();
    obj["packageSize"] = packageSize !== null ? packageSize : "Not available"; //scraping the package size

    $("tr.a-spacing-small").each(async (_idx, el) => {
      //selecting the product details element and the looping to get the complete product details
      const x = $(el);
      const key = x.find("td.a-span3>span.a-size-base.a-text-bold").text();
      const value = x.find("td.a-span9>span.a-size-base.po-break-word").text();
      if (key !== "" && value !== "") {
        obj[key] = value;
      }
    });
    $(
      ".a-section.feature.detail-bullets-wrapper.bucket>div#detailBullets_feature_div>ul.a-unordered-list.a-nostyle.a-vertical.a-spacing-none.detail-bullet-list"
    ) //selecting the product details element and the looping to get the complete product details
      .children()
      .each(async (_idx, el) => {
        const x = $(el);
        let key = x.find("span.a-text-bold").text();
        for (let i = 0; i < key.length - 1; i++) {
          if (key[i] === " " && key[i + 1] === " ") {
            key = key.substring(0, i - 1);
            break;
          }
        }
        const value = x.find("span.a-list-item").children("span").last().text();
        if (key !== "" && value !== "") {
          obj[key] = value;
        }
      });
    return obj;
  } catch (error) {
    throw error;
  }
};

module.exports = { amazonfetchIndividualDetails };
