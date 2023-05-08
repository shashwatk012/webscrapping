const scrapingbee = require("scrapingbee");
const cheerio = require("cheerio");
const { headers, apikey } = require("./flipkarttext");

const flipkartsellerslist = async (url) => {
  try {
    var client = new scrapingbee.ScrapingBeeClient(apikey);
    var response = await client.get({
      url: url,
      params: {
        premium_proxy: "True",
        wait_for: "div._2Y3EWJ",
      },
    });
    var decoder = new TextDecoder();
    var text = decoder.decode(response.data);
    const $ = cheerio.load(text);

    let count = 0;
    $("div._2Y3EWJ").each(async (_idx, el) => {
      count++;
    });

    return count;
  } catch (error) {
    res.send("Something wrong with sellers");
  }
};

module.exports = { flipkartsellerslist };
