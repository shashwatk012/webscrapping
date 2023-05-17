// const axios = require("axios");
// const cheerio = require("cheerio");
// const puppeteer = require("puppeteer");
// const { headers, replce } = require("./text");

// const nykaafetchIndividualDetails = async (url) => {
//   // function to scrap complete data about one product
//   try {
//     // api to get html of the required page
//     const browser = await puppeteer.launch({
//       // headless: "new",
//       headless: `true`,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//       // `headless: 'new'` enables new Headless;
//       // `headless: false` enables “headful” mode.
//     });

//     const page = await browser.newPage();
//     await page.goto(url);

//     let lastHeight = await page.evaluate("document.body.scrollHeight");

//     while (true) {
//       await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
//       await page.waitForTimeout(2000); // sleep a bit
//       let newHeight = await page.evaluate("document.body.scrollHeight");
//       if (newHeight === lastHeight) {
//         break;
//       }
//       lastHeight = newHeight;
//     }

//     const html = await page.content();

//     // cheerio nodejs module to load html
//     const $ = cheerio.load(html);

//     // Declaration of object to store the product details
//     let obj = {};

//     // Scraping the ProductName
//     const ProductName = $("h1.css-1gc4x7i").text().trim();
//     if (ProductName !== undefined) {
//       obj["ProductName"] = ProductName;
//     }

//     // scraping the number of global ratings
//     let ratings = $("div.css-ntrqan>span.css-v6hqrc").text();

//     // scraping the global rating(i.e 4.1)
//     let stars = $("strong.css-1297gf2").text();

//     obj.stars = stars;
//     obj["Ratings"] = ratings;
//     // obj["Reviews"] = review;

//     //scraping the pagelink for the reviews
//     const reviewsLink = $("div.css-1ux41ja>a").attr("href");
//     console.log(reviewsLink);
//     if (reviewsLink !== undefined) {
//       obj["reviewsLink"] = `https://www.nykaa.com${reviewsLink}`;
//     }

//     // Declaration of an array to store the highlights of products
//     let highLits = [];

//     //selecting the product details element and the looping to get the highlights of product
//     $("p.sc-eDvSVe.iMhJun.pre.pre").each(async (_idx, el) => {
//       const x = $(el);
//       const p = x.text();
//       highLits.push(p);

//       if (highLits.length !== 0) {
//         obj["HighLights"] = highLits;
//       }
//     });

//     let count = 1;
//     $("div.css-qb9x9j").each(async (_idx, el) => {
//       count++;
//     });
//     obj["Number of images"] = count;
//     console.log(obj);
//     return obj;
//   } catch (error) {
//     console.log(error);
//     res.send("something wrong with details");
//   }
// };

// module.exports = { nykaafetchIndividualDetails };
