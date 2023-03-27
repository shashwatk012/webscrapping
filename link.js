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
    const starLink = [];
    const reviewsLink = $("a.a-link-emphasis.a-text-bold").attr("href");
    starLink.push(`https://amazon.in${reviewsLink}`);
    return starLink;
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchLink };
