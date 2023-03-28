const axios = require("axios");
const cheerio = require("cheerio");

const fetchLink = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36",
      },
    });

    const html = response.data;

    const $ = cheerio.load(html);
    let obj = {};

    $("tr.a-histogram-row.a-align-center").each(async (_idx, el) => {
      const x = $(el);
      let key = x.find("td.aok-nowrap>span.a-size-base>a.a-link-normal").text();
      let value = x
        .find("td.a-text-right.a-nowrap>span.a-size-base>a.a-link-normal")
        .text();
      key = key.trim();
      value = value.trim();
      if (key !== "" && value !== "") {
        obj[`${key} ratings`] = value;
      }
    });

    const reviewsLink = $("a.a-link-emphasis.a-text-bold").attr("href");
    obj["reviewsLink"] = `https://amazon.in${reviewsLink}`;

    const packageSize = $(
      "div.a-row.a-spacing-micro.singleton>span.selection"
    ).html();
    obj["packageSize"] = packageSize !== null ? packageSize : "Not available";

    $("tr.a-spacing-small").each(async (_idx, el) => {
      const x = $(el);
      const key = x.find("td.a-span3>span.a-size-base.a-text-bold").text();
      const value = x.find("td.a-span9>span.a-size-base.po-break-word").text();
      if (key !== "" && value !== "") {
        obj[key] = value;
      }
    });
    $(
      ".a-section.feature.detail-bullets-wrapper.bucket>div#detailBullets_feature_div>ul.a-unordered-list.a-nostyle.a-vertical.a-spacing-none.detail-bullet-list"
    )
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

module.exports = { fetchLink };
