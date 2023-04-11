const axios = require("axios");
const cheerio = require("cheerio");
const { headers, allProducts, imglink } = require("./text");

const flipkartfetchUrlDetails = async (url) => {
  try {
    const response = await axios.get(url, headers);

    const html = response.data;

    const $ = cheerio.load(html);

    const beards = [];
    $(allProducts).each(async (_idx, el) => {
      // selecting the elements to be scrapped
      const beardo = $(el);
      const imagelink = beardo.find(imglink).attr("src"); // scraping the image

      const link = beardo // scraping the link of the product
        .find("a")
        .attr("href");

      let price = beardo.find("div._30jeq3").text();
      for (let i = 0; i < price.length; i++) {
        if (price[i] < "0" || price[i] > "9") {
          price = price.replace(price[i], "");
        }
      }

      let maxretailprice = beardo.find("div._3I9_wc").text();

      if (maxretailprice === "") {
        maxretailprice = price;
      } else {
        for (let i = 0; i < maxretailprice.length; i++) {
          if (maxretailprice[i] < "0" || maxretailprice[i] > "9") {
            maxretailprice = maxretailprice.replace(maxretailprice[i], "");
          }
        }
      }
      let element = {
        imagelink,
        productlink: `https://www.flipkart.com${link}`,
        price,
        maxretailprice,
      };
      beards.push(element); //storing the details in an array
    });
    return beards;
  } catch (error) {
    throw error;
  }
};

module.exports = { flipkartfetchUrlDetails };
