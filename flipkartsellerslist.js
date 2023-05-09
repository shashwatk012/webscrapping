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
    let sellersDetails = [];
    $("div._2Y3EWJ").each(async (_idx, el) => {
      // const x = $(el);
      // const sellersName = x.find("div._3enH42>span").text();
      // const Ratings = x.find("div._3LWZlK._2GCNvL").text();
      // const price = x.find("div._25b18c>div._30jeq3").text();
      // let flipkartassured = x.find("div._3J2v2E>div>img").attr("src");
      // if (flipkartassured) {
      //   flipkartassured = true;
      // } else {
      //   flipkartassured = false;
      // }
      // sellersDetails.push({
      //   sellersName,
      //   price,
      //   Ratings,
      //   flipkartassured,
      // });
      count++;
    });
    return { NumberofSellers: count, sellersDetails };
  } catch (error) {
    res.send("Something wrong with sellers");
  }
};

module.exports = { flipkartsellerslist };
