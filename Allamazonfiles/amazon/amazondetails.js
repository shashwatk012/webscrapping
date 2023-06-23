const cheerio = require("cheerio");
// const puppeteer = require("puppeteer");
const { replce, headers } = require("../text");
const math = require("mathjs");
const amazontext = require("./amazontext");
const request = require("request-promise");
const axios = require("axios");
const http = require("http");
const https = require("https");
// const puppeteer = require("puppeteer-extra");

// // Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// puppeteer.use(StealthPlugin());

// const { executablePath } = require("puppeteer");

// // Add adblocker plugin to block all ads and trackers (saves bandwidth)
// const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
// puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const amazonfetchIndividualDetails = async (url, num_proxies) => {
  // function to scrap complete data about one product
  try {
    const headers = {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9,la;q=0.8",
      "Sec-Ch-Ua":
        '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "cross-site",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
      "X-Amzn-Trace-Id": "Root=1-646baec9-23c65be55fbb54967e9160ef",
    };

    proxies_list = [
      "20.44.206.138:80",
      "185.211.57.74:4002",
      "211.138.6.37:9091",
      "168.187.72.71:80",
      "111.40.116.212:9091",
      "120.82.174.128:9091",
      "168.187.72.71:8080",
      "35.240.219.50:8080",
      "183.237.47.54:9091",
      "167.71.5.83:8080",
      "218.57.210.186:9002",
      "161.35.70.249:8080",
      "41.76.145.136:3128",
      "202.86.138.18:8080",
      "117.160.250.131:80",
      "112.19.214.109:9002",
      "183.230.162.122:9091",
      "112.35.204.111:80",
      "66.85.129.220:8080",
      "185.211.133.36:80",
      "185.211.133.108:80",
      "168.138.55.196:80",
      "109.238.208.138:21231",
      "92.63.168.248:80",
      "116.198.48.6:8080",
      "139.144.24.46:8080",
      "203.89.126.250:80",
      "110.185.164.20:9091",
      "185.211.133.110:80",
      "42.248.122.147:1080",
      "47.100.201.85:80",
      "60.12.168.114:9002",
      "103.77.60.14:80",
      "103.3.246.215:3128",
      "158.69.212.254:80",
      "117.160.250.132:8899",
      "124.131.219.94:9091",
      "112.16.127.69:9002",
      "185.211.57.74:4040",
      "117.160.250.134:80",
      "120.234.203.171:9002",
      "58.20.184.187:9091",
      "51.15.242.202:8888",
      "45.71.36.67:3128",
      "223.210.2.228:9091",
      "203.19.38.114:1080",
      "61.53.66.116:9091",
    ];

    const random = Math.floor(Math.random() * 46);
    num_proxies.num_proxies[random]++;
    const [host, port] = proxies_list[random].split(":");
    console.log(host, port);

    const targetUrl = url;

    const agent = new http.Agent({
      host: host,
      port: port,
      path: "/",
      rejectUnauthorized: false, // Set to false if the proxy server has a self-signed SSL certificate
    });

    headers.httpAgent = agent;

    const response = await axios.get(targetUrl, headers);
    const html = response.data;
    // console.log(html);
    // const agentOptions = {
    //   host: "103.231.78.36",
    //   port: 80,
    //   path: "/",
    //   rejectUnauthorized: false,
    // };

    // const agent = new http.Agent(agentOptions);
    // const html = await request({
    //   url: "http://amazon.in/Pampers-Diapers-Pants-Medium-Count/dp/B07DP24NSR/ref=sr_1_1?crid=1EAMOLVYHA0EG&keywords=Diaper&qid=1687527727&sprefix=suncream%2Caps%2C303&sr=8-1",
    //   method: "GET",
    //   agent,
    // });
    // const html = await request.get({
    //   url: "http://httpbin.org/ip",
    //   proxy: "191.102.157.91:8080",
    //   tunnel: false,
    //   Accept:
    //     "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    //   "Accept-Encoding": "gzip, deflate, br",
    //   "Accept-Language": "en-US,en;q=0.9,la;q=0.8",
    //   "Sec-Ch-Ua":
    //     '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
    //   "Sec-Ch-Ua-Mobile": "?0",
    //   "Sec-Ch-Ua-Platform": '"Windows"',
    //   "Sec-Fetch-Dest": "document",
    //   "Sec-Fetch-Mode": "navigate",
    //   "Sec-Fetch-Site": "cross-site",
    //   "Sec-Fetch-User": "?1",
    //   "Upgrade-Insecure-Requests": "1",
    //   "User-Agent":
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    //   "X-Amzn-Trace-Id": "Root=1-646baec9-23c65be55fbb54967e9160ef",
    // });
    // console.log(response);
    // console.log(html);
    // let browser = await puppeteer.launch({
    //   headless: `true`, // indicates that we want the browser visible
    //   defaultViewport: false, // indicates not to use the default viewport size but to adjust to the user's screen resolution instead
    //   userDataDir: "./tmp", // caches previous actions for the website. Useful for remembering if we've had to solve captchas in the past so we don't have to resolve them
    //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
    //   executablePath: executablePath(),
    // });

    // let page = await browser.newPage();

    // await page.goto(url);

    // await page.waitForTimeout(1000);

    // let html = await page.content();

    // let $ = cheerio.load(html);

    // let captchalink = $("div.a-row.a-text-center>img").attr("src");

    // let captcha = undefined;

    // if (captchalink) {
    //   console.log(captchalink);

    //   const readline = require("readline").createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    //   });

    //   readline.question("Type the captcha", (name) => {
    //     console.log(`Captcha is ${name}!`);
    //     captcha = name;
    //     readline.close();
    //   });

    //   await page.waitForTimeout(20000);

    //   await page.type("input#captchacharacters", captcha);

    //   await page.click(
    //     "span.a-button.a-button-primary.a-span12>span.a-button-inner>button.a-button-text"
    //   );

    //   await page.waitForTimeout(5000);
    // }

    // let lastHeight = await page.evaluate("document.body.scrollHeight");

    // while (true) {
    //   await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    //   await page.waitForTimeout(1000); // sleep a bit
    //   let newHeight = await page.evaluate("document.body.scrollHeight");
    //   if (newHeight === lastHeight) {
    //     break;
    //   }
    //   lastHeight = newHeight;
    // }

    // html = await page.content();

    // await page.close();
    // await browser.close();

    // cheerio nodejs module to load html
    $ = cheerio.load(html);

    // Declaration of object to store the product details
    let obj = {};

    // ProductName
    let ProductName = $(amazontext.A_PRODUCTNAME_CN).text();
    console.log(ProductName);

    // stars
    let star = $(amazontext.A_STARS_CN).text();

    // number of ratings
    let numratings = $(amazontext.A_RATINGS_CN).text();

    // Link for the images
    let imagelink = $(amazontext.A_IMAGELINK_CN).attr("src");
    if (!imagelink) {
      imagelink = $(amazontext.A_IMAGELINK_ALTERNATIVE_CN).attr("src");
    }

    // price
    let price = $(amazontext.A_PRICE_CN).text();
    price = replce(price);

    if (!price) {
      price = $(amazontext.A_PRICE_ALTERNATIVE_CN).text();
      price = replce(price);
    }

    // maxretailprice
    let maxretailprice = $(amazontext.A_MAXRETAILPRICE_CN).text();
    maxretailprice = replce(maxretailprice);

    if (!maxretailprice) {
      maxretailprice = $(amazontext.A_MAXRETAILPRICE_ALTERNATIVE_CN).text();
      maxretailprice = replce(maxretailprice);
    }

    if (ProductName) {
      obj[amazontext.A_PRODUCTNAME_FD] = ProductName.trim();
    }

    if (star) {
      let stararr = star.split(" ");
      obj[amazontext.A_STARS_FD] = Number(stararr[1]);
    }

    if (numratings) {
      numratings = numratings.replace(/\D/g, "");
      let size = numratings.length;
      const st = numratings.substring(0, size / 2);
      // const st1 = numratings.substring(size / 2, size);
      obj[amazontext.A_RATINGS_FD] = Number(st);
    }

    if (imagelink) {
      obj[amazontext.A_IMAGELINK_FD] = imagelink;
    }

    if (price) {
      obj[amazontext.A_PRICE_FD] = price;
    }

    if (maxretailprice) {
      obj[amazontext.A_MAXRETAILPRICE_FD] = maxretailprice;
    } else {
      obj[amazontext.A_MAXRETAILPRICE_FD] = price;
    }

    //Scraping the Best Sellers Rank in different Sub-Categories
    $(amazontext.A_LISTOFCATEGORIES_CN).each(async (_idx, el) => {
      const x = $(el);
      if (_idx === 0) {
        let p = x.find(amazontext.A_CATEGORY_CN).text();
        if (p) {
          p = p.trim();
        }
        let ranks,
          num = [];
        if (p) {
          ranks = p.replace("Best Sellers Rank:", "");
          ranks = ranks.trim();
          ranks = ranks.split(" ");
          ranks = ranks.filter((item) => {
            if (item !== " ") return item;
          });
          ranks = ranks.join(" ");
          ranks = ranks.replaceAll("#", " ");

          num = ranks.split("  ");
        }

        let st = [],
          rank = [];
        for (let i = 0; i < num.length; i++) {
          let q = num[i].split(" ");
          let s = "";
          if (!st.length) {
            let idx = q.indexOf("(See");
            for (let j = 3; j < idx; j++) {
              s += q[j];
            }
            if (q && q.length > 1) {
              q[1] = replce(q[1]);
              rank.push(q[1]);
            }
          } else {
            for (let j = 2; j < q.length; j++) {
              s += q[j];
            }
            if (q && q.length > 0) {
              q[0] = replce(q[0]);
              rank.push(q[0]);
            }
          }
          if (i == num.length - 1) {
            obj[amazontext.A_POSITION_FD] = q[0];
          }
          st.push(s);
        }

        // saving the scraped data in an object
        if (st.length > 1) {
          obj[amazontext.A_MOTHER_CATEGORY_FD] = st[0];
          obj[amazontext.A_CATEGORY_FD] = st[1];
          obj[amazontext.A_BSR_IN_MOTHER_CATEGORY] = rank[0];
          obj[amazontext.A_BSR_IN_CATEGORY] = rank[1];
          if (st.length > 2) {
            obj[amazontext.A_SUB_CATEGORY_FD] = st[2];
            obj[amazontext.A_PRODUCT_FD] = st[2];
          } else {
            obj[amazontext.A_PRODUCT_FD] = st[1];
          }
        }
      }
    });

    // Number of images
    let count = 1;
    $(amazontext.A_NUMBEROFIMAGES_CN).each(async (_idx, el) => {
      const x = $(el);
      count++;
    });
    obj[amazontext.A_NUMBEROFIMAGES_FD] = count;

    // Sellerdetails
    count = 1;
    let mn = price,
      mx = price,
      pricearr = [price],
      sellerdetails = [];
    $(amazontext.A_SELLERS_CN).each(async (_idx, el) => {
      const x = $(el);
      let price = x.find(`${amazontext.A_SELLERSPRICE_CN}${_idx + 1}`).text();
      let deliveryCharges = x
        .find(`${amazontext.A_SELLERSDELIVERYCHARGES_CN}${_idx + 1}`)
        .text();
      let soldBy = x
        .find(`div#mbc-sold-by-${_idx + 1}>span.mbcMerchantName`)
        .text();

      price = replce(price);
      pricearr.push(price);

      mx = Math.max(mx, price);
      mn = Math.min(mn, price);

      // matching all numbers
      deliveryCharges = deliveryCharges.match(/[.0-9]+/);

      if (!deliveryCharges || !deliveryCharges.length) {
        deliveryCharges = [0];
      }

      sellerdetails.push({
        SoldBy: soldBy,
        Price: price,
        "Delivery charges": Number(deliveryCharges[0]),
      });
      count++;
    });
    let stDev;
    if (pricearr.length) {
      stDev = math.std(pricearr);
    }
    obj[amazontext.A_ST_DEV_PRICE_FD] = stDev;
    obj[amazontext.A_MIN_PRICE_FD] = mn;
    obj[amazontext.A_MAX_PRICE_FD] = mx;
    obj[amazontext.A_NUMBEROFSELLERS_FD] = count;
    obj[amazontext.A_SELLERDETAILS_FD] = sellerdetails;

    // Product description
    const description = $(amazontext.A_DESCRIPTION_CN).text();
    obj[amazontext.A_DESCRIPTION_FD] = description;

    // Scraping the brand
    let brand = $(amazontext.A_BRAND_CN).text();
    let brandarr = [];

    if (brand) {
      brandarr = brand.split(":");
      obj[amazontext.A_BRAND_FD] = brandarr[1];
    }

    // selecting the ratings element and the looping to get the different ratings percentage
    $(amazontext.A_ALLRATINGS_CN).each(async (_idx, el) => {
      const x = $(el);
      let key = x.find(amazontext.A_ALLRATINGS_key_CN).text();
      let value = x.find(amazontext.A_ALLRATINGS_value_CN).text();
      if (key) {
        key = key.trim();
      }
      if (value) {
        value = value.trim(); // triming to trim the spaces in the string
      }

      if (key !== "" && value !== "") {
        const result = value.replace(/\D/g, "");
        obj[`Num_${5 - _idx}_${amazontext.A_STARRATINGS1_FD}`] = result; // saving the scraped data in an object
      }
    });

    //scraping the pagelink for the reviews
    const reviewsLink = $(amazontext.A_REVIEWSLINK_CN).attr("href");
    obj[
      amazontext.A_REVIEWSLINK_FD
    ] = `${amazontext.AMAZON_PAGE_LINK}${reviewsLink}`;

    //selecting the product details element and the looping to get the complete product details
    $(amazontext.A_PRODUCTDETAILS1_CN).each(async (_idx, el) => {
      const x = $(el);
      const key = x.find(amazontext.A_PRODUCTDETAILS_KEY_CN).text();
      const value = x.find(amazontext.A_PRODUCTDETAILS_VALUE_CN).text();
      if (key && value) {
        obj[key] = value;
      }
    });

    //selecting the product details element and the looping to get the complete product details
    $(amazontext.A_PRODUCTDETAILS2_CN)
      .children()
      .each(async (_idx, el) => {
        const x = $(el);
        let key = x.find(amazontext.A_PRODUCTDETAILS2_KEY_CN).text();
        for (let i = 0; i < key.length - 1; i++) {
          if (key[i] === " " && key[i + 1] === " ") {
            key = key.substring(0, i - 1);
            break;
          }
        }
        const value = x
          .find(amazontext.A_PRODUCTDETAILS2_VALUE_CN)
          .children("span")
          .last()
          .text();
        if (key && value) {
          obj[key] = value;
        }
      });

    //selecting the product details element and the looping to get the complete product details in case of electronics
    $(amazontext.A_PRODUCTDETAILS3_CN).each(async (_idx, el) => {
      const x = $(el);
      let key = x.find("th").text();
      for (let i = 0; i < key.length - 1; i++) {
        if (key[i] === " " && key[i + 1] === " ") {
          key = key.substring(0, i - 1);
          break;
        }
      }
      const value = x.find("td").text();
      if (key && value) {
        obj[key.trim()] = value.trim();
      }
    });

    if (!obj[amazontext.A_MOTHER_CATEGORY_FD]) {
      let p = obj["Best Sellers Rank"];
      let ranks,
        num = [];
      if (p) {
        ranks = p.replace("Best Sellers Rank:", "");
        ranks = ranks.trim();
        ranks = ranks.split(" ");
        ranks = ranks.filter((item) => {
          if (item !== " ") return item;
        });
        ranks = ranks.join(" ");
        ranks = ranks.replaceAll("#", " ");

        num = ranks.split("  ");
      }

      let st = [],
        rank = [];
      for (let i = 0; i < num.length; i++) {
        let q = num[i].split(" ");
        let s = "";
        if (!st.length) {
          let idx = q.indexOf("(See");
          for (let j = 3; j < idx; j++) {
            s += q[j];
          }
          if (q && q.length > 1) {
            q[1] = replce(q[1]);
            rank.push(q[1]);
          }
        } else {
          for (let j = 2; j < q.length; j++) {
            s += q[j];
          }
          if (q && q.length > 0) {
            q[0] = replce(q[0]);
            rank.push(q[0]);
          }
        }
        if (i == num.length - 1) {
          obj[amazontext.A_POSITION_FD] = Number(q[0]);
        }
        st.push(s);
      }

      // saving the scraped data in an object
      if (st.length > 1) {
        obj[amazontext.A_MOTHER_CATEGORY_FD] = st[0];
        obj[amazontext.A_CATEGORY_FD] = st[1];
        obj[amazontext.A_BSR_IN_MOTHER_CATEGORY] = rank[0];
        obj[amazontext.A_BSR_IN_CATEGORY] = rank[1];
        if (st.length > 2) {
          obj[amazontext.A_SUB_CATEGORY_FD] = st[2];
          obj[amazontext.A_PRODUCT_FD] = st[2];
        } else {
          obj[amazontext.A_PRODUCT_FD] = st[1];
        }
      }
    }

    if (!obj[amazontext.A_MOTHER_CATEGORY_FD]) {
      let Categories = [];
      $("div#wayfinding-breadcrumbs_feature_div>ul>li").each(
        async (_idx, el) => {
          const x = $(el);
          let category = x.find("a").text();
          if (category && category != "") {
            Categories.push(category.trim());
          }
        }
      );
      // saving the scraped data in an object
      if (Categories.length) {
        obj[amazontext.A_MOTHER_CATEGORY_FD] = Categories[0];
        obj[amazontext.A_CATEGORY_FD] = Categories[1];
        obj[amazontext.A_PRODUCT_FD] = Categories[Categories.length - 1];
        if (Categories.length > 2) {
          obj[amazontext.A_SUB_CATEGORY_FD] = Categories[2];
        }
      }
    }

    return obj;
  } catch (error) {
    try {
      // console.log(error);
      console.log("Some thing Went Wrong on details.js");
      return {};
    } catch (e) {
      console.log("Some thing Went Wrong on details1.js");
      return {};
    }
  }
};

module.exports = { amazonfetchIndividualDetails };
