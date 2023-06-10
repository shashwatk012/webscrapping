const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { headers, replce, brands } = require("../../text");

const individualdetails = (html) => {
  // cheerio nodejs module to load html
  let $ = cheerio.load(html);

  // Declaration of object to store the product details
  let obj = {};

  let a = $("div#brand_arrowUp").text();

  // Scraping the ProductName
  const ProductName = $("div.css-1d5wdox>h1.css-1gc4x7i").text().trim();
  if (ProductName !== undefined) {
    obj["ProductName"] = ProductName;
  }

  const pos = ProductName.indexOf("(");
  let pos1 = ProductName.indexOf(")");
  if (pos !== -1) {
    let Quantity = ProductName.substring(pos + 1, pos1);
    console.log(Quantity);
    const splitArray = Quantity.match(/([\d\.]+)(.*)/);
    console.log(splitArray);
    let QuantityUnit;
    if (splitArray && splitArray[2]) {
      QuantityUnit = splitArray[2].trim();
    }
    // matching all numbers
    if (splitArray && splitArray[1]) {
      Quantity = Number(splitArray[1]);
    }

    if (
      QuantityUnit === "gm" ||
      QuantityUnit === "ml" ||
      QuantityUnit === "g"
    ) {
      obj["Quantity"] = Number(Quantity);
      obj["Quantity unit"] = QuantityUnit;
    } else {
      obj["Quantity"] = 1;
      obj["Quantity unit"] = "NA";
    }
  } else {
    obj["Quantity"] = 1;
    obj["Quantity unit"] = "NA";
  }

  let imagelink = $("div.css-5n0nl4>div>img").attr("src");
  obj["imagelink"] = imagelink;

  const price = $("div.css-1d0jf8e>span.css-1jczs19").text();
  let arr = [];

  if (price) {
    arr = price.split("₹");
  }
  obj["price"] = Number(arr[1]);

  obj["Price per unit"] = obj["price"] / obj["Quantity"];

  const maxretailprice = $("div.css-1d0jf8e>span.css-u05rr>span").text();

  if (maxretailprice) {
    arr = maxretailprice.split("₹");
  }

  obj["maxretailprice"] = Number(arr[1]);

  const discount = $("div.css-1d0jf8e>span.css-bhhehx").text();

  if (discount) {
    arr = discount.split("%");
  }

  obj["Discount%"] = Number(arr[0]);

  // scraping the number of global ratings and reviews
  let ratingsandreviews = $("div.css-1hvvm95").text().trim();
  let ratings, reviews;
  if (ratingsandreviews) {
    arr = ratingsandreviews.split(" ");
    ratings = Number(arr[0]);
    reviews = Number(arr[arr.length - 2]);
  }

  // scraping the global rating(i.e 4.1)
  let stars = $("div.css-m6n3ou").text();

  if (stars) {
    arr = stars.split("/");
    obj.stars = Number(arr[0]);
  }

  obj["Ratings"] = ratings;
  obj["Reviews"] = reviews;

  // console.log($("div.css-kxc9rx>span").text());
  $("div.css-kxc9rx>span").each(async (_idx, el) => {
    const x = $(el);
    const diffratings = x.text();
    obj[`${5 - _idx} star ratings`] = Number(diffratings);
  });

  let categories = [];
  $("div.css-16kpx0l>ul.css-1uxnb1o>li").each(async (_idx, el) => {
    const x = $(el);
    const category = x.find("a.name").text();
    categories.push(category);
  });
  obj["Mother Category"] = categories[1];
  obj["Category"] = categories[2];
  obj["Sub-Category"] = categories[3];
  obj["Product"] = categories[categories.length - 1];

  //scraping the pagelink for the reviews
  const reviewsLink = $("div.css-1ux41ja>a.css-1xv8iu0").attr("href");
  if (reviewsLink !== undefined) {
    obj["reviewsLink"] = `https://www.nykaa.com${reviewsLink}`;
  }

  const posLink = $(
    "div.css-16kpx0l>ul.css-1uxnb1o>li.last-list.css-hnjjmz>a.name"
  )
    .last()
    .attr("href");
  obj["posLink"] = `https://www.nykaa.com${posLink}`;

  let count = 1;
  $("div.css-qb9x9j").each(async (_idx, el) => {
    count++;
  });
  obj["Number of images"] = count;

  if (ProductName) {
    let arr = ProductName.split(" ");
    const index = brands.findIndex((element) => element.includes(arr[0]));
    obj.Brand = brands[index];
  }
  console.log(obj);
  return obj;
};

const nykaafetchIndividualDetails = async (url, browser, page) => {
  // function to scrap complete data about one product
  try {
    // api to get html of the required page
    browser = await puppeteer.launch({
      // headless: "new",
      headless: `true`,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
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

    await page.hover("div.css-1m0y15j");

    const html = await page.content();

    await page.close();
    await browser.close();

    return individualdetails(html);
  } catch (error) {
    try {
      if (page) {
        await page.close();
      }
      if (browser) {
        await browser.close();
      }
      console.log("error");
      // api to get html of the required page
      const response = await axios.get(url, headers);

      const html = response.data;

      let obj = individualdetails(html);
      let ProductName = obj.ProductName;

      let pos = ProductName.indexOf(")");

      ProductName = ProductName.substring(0, pos + 1);
      obj.ProductName = ProductName;

      pos = ProductName.indexOf("(");
      let pos1 = ProductName.indexOf(")");
      if (pos !== -1 && pos1 !== -1) {
        let Quantity = ProductName.substring(pos + 1, pos1 - 1);
        const splitArray = Quantity.match(/([\d\.]+)(.*)/);

        let QuantityUnit = "NA";
        if (splitArray && splitArray[2]) {
          QuantityUnit = splitArray[2].trim();
        }
        // matching all numbers
        if (splitArray && splitArray[1]) {
          Quantity = Number(splitArray[1]);
        }
        if (
          QuantityUnit === "gm" ||
          QuantityUnit === "ml" ||
          QuantityUnit === "g"
        ) {
          obj["Quantity"] = Number(Quantity);
          obj["Quantity unit"] = QuantityUnit;
        } else {
          obj["Quantity"] = 1;
          obj["Quantity unit"] = "NA";
        }
      } else {
        obj["Quantity"] = 1;
        obj["Quantity unit"] = "NA";
      }
      return obj;
    } catch (e) {
      console.log(e);
      return { message: "NOT POSSIBLE" };
    }
  }
};

module.exports = { nykaafetchIndividualDetails };
