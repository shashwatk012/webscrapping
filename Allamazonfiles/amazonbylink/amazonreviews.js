const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const amazonfetchReviews = async (url, browser, page) => {
  try {
    browser = await puppeteer.launch({
      // headless: "new",
      headless: `true`,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9,la;q=0.8",
      Host: "httpbin.org",
      "Sec-Ch-Ua":
        '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "cross-site",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      "X-Amzn-Trace-Id": "Root=1-648c640d-4b4b06d0031cf89a458ca171",
      // `headless: 'new'` enables new Headless;
      // `headless: false` enables “headful” mode.
    });

    page = await browser.newPage();
    await page.goto(url);

    let lastHeight = await page.evaluate("document.body.scrollHeight");

    while (true) {
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForTimeout(1000); // sleep a bit
      let newHeight = await page.evaluate("document.body.scrollHeight");
      if (newHeight === lastHeight) {
        break;
      }
      lastHeight = newHeight;
    }

    const html = await page.content();

    await page.close();
    await browser.close();

    const $ = cheerio.load(html);

    let obj = {};
    // Scraping the Global number of reviews
    const noReviews = $(".a-row.a-spacing-base.a-size-base");
    numberReviews = noReviews.html();
    if (numberReviews) {
      numberReviews = numberReviews.trim();
      let sp = numberReviews.split(",");
      numberReviews = sp[1].replace(/\D/g, "");
    }

    //Scraping the number of all type of ratings such as 5 star, 4 star
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
        const result = value.replace(/\D/g, "");
        obj[`${key} ratings`] = result; // saving the scraped data in an object
      }
    });

    // Scraping the reviews
    const reviews1 = [];
    $("div.a-section.review.aok-relative").each(async (_idx, el) => {
      const reviews = $(el);
      const name = reviews.find("span.a-profile-name").text();
      const review = reviews
        .find("span.a-size-base.review-text.review-text-content>span")
        .text();
      reviews1.push({
        name: name,
        review: review,
      });
    });
    obj["Reviews"] = Number(numberReviews);
    obj["top10reviews"] = reviews1;
    return obj;
  } catch (error) {
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
    return {};
  }
};

module.exports = { amazonfetchReviews };
