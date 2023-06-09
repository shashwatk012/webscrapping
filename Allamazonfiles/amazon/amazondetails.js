// const cheerio = require("cheerio");
// const puppeteer = require("puppeteer");
// const { headers, apikey } = require("../text");

// const amazonfetchIndividualDetails = async (url, index) => {
//   // function to scrap complete data about one product
//   try {
//     // fetching the html page through scraping bee
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

//     //Scraping the Best Sellers Rank in different Sub-Categories
//     $(
//       ".a-section.feature.detail-bullets-wrapper.bucket>ul.a-unordered-list.a-nostyle.a-vertical.a-spacing-none.detail-bullet-list"
//     ).each(async (_idx, el) => {
//       const x = $(el);
//       if (_idx === 0) {
//         let p = x.find("span.a-list-item").text();
//         if (p) {
//           p = p.trim();
//         }
//         let ranks = p.replace("Best Sellers Rank:", "");
//         ranks = ranks.replace("(See Top 100 in Beauty)", "");
//         const num = ranks.split("  ");
//         let st = [];
//         for (let i = 0; i < num.length; i++) {
//           if (num[i] != "") {
//             let q = num[i].split(" ");
//             let s = "";
//             if (!st.length) {
//               for (let j = 2; j < q.length; j++) {
//                 s += q[j];
//               }
//             } else {
//               for (let j = 3; j < q.length; j++) {
//                 s += q[j];
//               }
//             }
//             st.push(s);
//           }
//         }
//         console.log(st);

//         // saving the scraped data in an object
//         if (st.length) {
//           obj["Mother Category"] = st[0];
//           obj["Category"] = st[1];
//         }
//       }
//     });

//     // selecting the ratings element and the looping to get the different ratings percentage
//     $("tr.a-histogram-row.a-align-center").each(async (_idx, el) => {
//       const x = $(el);
//       let key = x.find("td.aok-nowrap>span.a-size-base>a.a-link-normal").text();
//       let value = x
//         .find("td.a-text-right.a-nowrap>span.a-size-base>a.a-link-normal")
//         .text();
//       if (key) {
//         key = key.trim();
//       }
//       if (value) {
//         value = value.trim(); // triming to trim the spaces in the string
//       }

//       if (key !== "" && value !== "") {
//         const result = value.replace(/\D/g, "");
//         obj[`${key} ratings`] = result; // saving the scraped data in an object
//       }
//     });

//     //scraping the pagelink for the reviews
//     const reviewsLink = $("a.a-link-emphasis.a-text-bold").attr("href");
//     obj["reviewsLink"] = `https://amazon.in${reviewsLink}`;

//     // Scraping the package size
//     const packageSize = $(
//       "div.a-row.a-spacing-micro.singleton>span.selection"
//     ).html();
//     if (packageSize) {
//       obj["packageSize"] = packageSize;
//     } else {
//       obj["packageSize"] = "Not available";
//     }

//     //selecting the product details element and the looping to get the complete product details
//     $("tr.a-spacing-small").each(async (_idx, el) => {
//       const x = $(el);
//       const key = x.find("td.a-span3>span.a-size-base.a-text-bold").text();
//       const value = x.find("td.a-span9>span.a-size-base.po-break-word").text();
//       if (key && value) {
//         obj[key] = value;
//       }
//     });

//     //selecting the product details element and the looping to get the complete product details
//     $(
//       ".a-section.feature.detail-bullets-wrapper.bucket>div#detailBullets_feature_div>ul.a-unordered-list.a-nostyle.a-vertical.a-spacing-none.detail-bullet-list"
//     )
//       .children()
//       .each(async (_idx, el) => {
//         const x = $(el);
//         let key = x.find("span.a-text-bold").text();
//         for (let i = 0; i < key.length - 1; i++) {
//           if (key[i] === " " && key[i + 1] === " ") {
//             key = key.substring(0, i - 1);
//             break;
//           }
//         }
//         const value = x.find("span.a-list-item").children("span").last().text();
//         if (key && value) {
//           obj[key] = value;
//         }
//       });
//     console.log(obj);
//     return obj;
//   } catch (error) {
//     console.log("Some thing Went Wrong on details.js");
//     return {};
//   }
// };

// module.exports = { amazonfetchIndividualDetails };
