const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { headers, replce } = require("./flipkarttext");

const flipkartfetchIndividualDetails = async (url) => {
  // function to scrap complete data about one product
  try {
    // api to get html of the required page
    const browser = await puppeteer.launch({
      // headless: "new",
      headless: `true`,
      // `headless: 'new'` enables new Headless;
      // `headless: false` enables “headful” mode.
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("div.col.JOpGWq", { timeout: 30000 });
    const html = await page.content();

    // cheerio nodejs module to load html
    const $ = cheerio.load(html);

    // Declaration of object to store the product details
    let obj = {};

    // Scraping the ProductName
    const ProductName = $(
      "div._1AtVbE.col-12-12>div.aMaAEs>div>h1.yhB1nd>span.B_NuCI"
    )
      .text()
      .trim();
    if (ProductName !== undefined) {
      obj["ProductName"] = ProductName;
    }

    // scraping the number of global ratings
    let ratings = $("span._2_R_DZ._2IRzS8").text();

    // scraping the global rating(i.e 4.1)
    let stars = $("div._3LWZlK._138NNC").text();

    if (stars && ratings) {
      stars = replce(stars);
      obj.stars = stars;
      let p = ratings.indexOf("and");
      if (p === -1) {
        p = ratings.indexOf("&");
      }
      let rating = ratings.substring(0, p);
      let review = ratings.substring(p);
      rating = rating.replace(/\D/g, "");
      review = review.replace(/\D/g, "");

      rating = replce(rating);
      review = replce(review);
      obj["Ratings"] = rating;
      obj["Reviews"] = review;
    } else {
      // scraping the number of global ratings
      ratings = $("div.row._2afbiS>div.col-12-12>span").text();

      // scraping the global ratings(i.e 4.1)
      stars = $("div._2d4LTz").text();
      stars = replce(stars);
      obj.stars = stars;
      let p = ratings.indexOf("and");
      if (p === -1) {
        p = ratings.indexOf("&");
      }
      let rating = ratings.substring(0, p);
      let review = ratings.substring(p);
      rating = rating.replace(/\D/g, "");
      review = review.replace(/\D/g, "");
      rating = replce(rating);
      review = replce(review);
      obj["Ratings"] = rating;
      obj["Reviews"] = review;
    }

    // Declaration of an array to store the Category and Sub-Categories
    let Categories = [];

    //selecting the category element and the looping to get the category and sub-category
    $("div._1MR4o5>div._3GIHBu").each(async (_idx, el) => {
      const x = $(el);
      const category = x.find("a._2whKao").text();
      if (category) {
        Categories.push(category);
      }
    });
    obj["Mother Category"] = Categories[1];
    obj["Category"] = Categories[2];
    obj["Brand"] = Categories[Categories.length - 1];

    //scraping the pagelink for the reviews
    const reviewsLink = $("div.col.JOpGWq>a").attr("href");
    if (reviewsLink !== undefined) {
      obj["reviewsLink"] = `https://www.flipkart.com${reviewsLink}`;
    }

    // Declaration of an array to store the highlights of products
    let highLits = [];

    //selecting the product details element and the looping to get the highlights of product
    $("div._2418kt>ul>li._21Ahn-").each(async (_idx, el) => {
      const x = $(el);
      const p = x.text();
      highLits.push(p);

      if (highLits.length !== 0) {
        obj["HighLights"] = highLits;
      }
    });

    //selecting the product details element and the looping to get the complete product details
    $("table._14cfVK>tbody>tr._1s_Smc.row").each(async (_idx, el) => {
      const x = $(el);
      const key = x.find("td._1hKmbr.col.col-3-12").text();
      const value = x.find("li._21lJbe").text();
      if (key !== "" && value !== "") {
        obj[key] = value;
      }
    });

    // Scraping the sellers page link
    const sellerslink = $("li._38I6QT>a").attr("href");
    if (sellerslink) {
      obj["sellerslink"] = `https://www.flipkart.com${sellerslink}`;
    }
    const description = $("div._1mXcCf.RmoJUa").text();

    let count = 0;
    $("li._20Gt85._1Y_A6W").each(async (_idx, el) => {
      count++;
    });
    obj["Number of images"] = count;
    obj["Description"] = description;
    await browser.close();
    return obj;
  } catch (error) {
    console.log("wnjkhd");
    res.send("something wrong with details");
  }
};

module.exports = { flipkartfetchIndividualDetails };
