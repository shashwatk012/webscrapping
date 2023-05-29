"use strict";
// In this file all the reusable code are put together so that they can be called as per need.

// Importing the cheerio module to load the html
const cheerio = require("cheerio");

// Module to convert JSON into CSV
const { convertJSONtoCSV } = require("./csv");

// Establishing the connection to database
const connection = require("./connection");

// headers to send with api request to sites to avoid blockage
const headers = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9,la;q=0.8",
  Host: "httpbin.org",
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

const allProducts =
  "div._1YokD2._2GoDe3>div._1YokD2._3Mn1Gg>div._1AtVbE.col-12-12>div._13oc-S>div";
const imglink = "img._396cs4";

// Types of rating we want to scrap
const typesOfRatings = ["POSITIVE_FIRST", "NEGATIVE_FIRST"];

// function to convert the given category into url in order to scrap the data.
const urlmaking = (category) => {
  const url = `https://www.flipkart.com/search?q=${category}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`;
  return url;
};

//Order of fields we want in the final output
const fields = [
  "imagelink",
  "productlink",
  "Position",
  "Product",
  "ProductName",
  "Brand",
  "price",
  "Price per unit",
  "maxretailprice",
  "stars",
  "Ratings",
  "Reviews",
  "Mother Category",
  "Category",
  "Sub-Category",
  "5 star ratings",
  "4 star ratings",
  "3 star ratings",
  "2 star ratings",
  "1 star ratings",
  "Platform",
  "Quantity",
  "Quantity unit",
  "NumberofSellers",
  "sellerDetails",
  "Description",
  "Number of images",
  "IsAds",
  "POSITIVE_FIRST",
  "NEGATIVE_FIRST",
  "Net Rating Score (NRS)",
  "Discount%",
  "Search Term",
  "Min Price",
  "Max Price",
  "St-dev-Price",
  "Title Length",
  "Description Length",
  "Date",
];

// function to convert the string into Number by removing the unwanted symbols.
const replce = (str) => {
  while (str.includes(",")) {
    str = str.replace(",", "");
  }
  while (str.includes("₹")) {
    str = str.replace("₹", "");
  }
  return Number(str);
};

const scrapreviews = (html, typeofreviews, ProductName) => {
  const $ = cheerio.load(html);

  console.log(typeofreviews);
  let review = [];
  let obj = {};

  // Scraping the number of all type of ratings such as 5 star, 4 star
  $("div._13sFCC.miQW6D>ul._36LmXx>li._28Xb_u>div._1uJVNT").each(
    async (_idx, el) => {
      const x = $(el);
      obj[`${5 - _idx} star ratings`] = replce(x.text());
    }
  );
  let date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  date = date.toLocaleString("en-IN", options);

  // Scraping the reviewS
  $("div._1AtVbE>div._27M-vq>div.col>div.col._2wzgFH.K0kLPL").each(
    async (_idx, el) => {
      const x = $(el);
      let title = x.find("p._2-N8zT").text();
      let summary = x.find("div.t-ZTKy>div>div").last().text();
      let type;
      if (typeofreviews === "POSITIVE_FIRST") {
        type = "POSITIVE";
      } else {
        type = "NEGATIVE";
      }
      if (title && summary) {
        review.push({
          title: title,
          summary: summary,
          type: type,
          ProductName,
          date,
        });
      } else if (title) {
        review.push({
          title: title,
          type: type,
          ProductName,
          date,
        });
      } else {
        review.push({
          summary: summary,
          type: type,
          ProductName,
          date,
        });
      }
      title = null;
      summary = null;
    }
  );
  obj[typeofreviews] = review;

  return obj;
};

const scrapdetails = (html) => {
  // cheerio nodejs module to load html
  const $ = cheerio.load(html);

  // Declaration of object to store the product details
  let obj = {};

  // Scraping the ProductName
  let ProductName = $(
    "div._1AtVbE.col-12-12>div.aMaAEs>div>h1.yhB1nd>span.B_NuCI"
  )
    .text()
    .trim();
  if (ProductName !== undefined) {
    obj["ProductName"] = ProductName;
  }

  ProductName = null;

  let price = $("div._30jeq3._16Jk6d").text();
  price = replce(price);
  obj["price"] = price;

  let maxprice = $("div._3I9_wc._2p6lqe").text();
  if (maxprice === "") {
    maxprice = price;
  } else {
    maxprice = replce(maxprice);
  }
  obj["maxretailprice"] = maxprice;

  let discount = (maxprice - price) / maxprice;
  obj["Discount%"] = Math.floor(discount * 100);

  let image = $("div.CXW8mj._3nMexc>img").attr("src");
  if (image === undefined) {
    image = $("img._2r_T1I._396QI4").attr("src");
  }
  obj["imagelink"] = image;

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
    let ratings = $("div.row._2afbiS>div.col-12-12>span").text();

    // scraping the global ratings(i.e 4.1)
    let stars = $("div._2d4LTz").text();
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
  ratings = null;
  stars = null;

  // Declaration of an array to store the Category and Sub-Categories
  let Categories = [];

  //selecting the category element and the looping to get the category and sub-category
  $("div._1MR4o5>div._3GIHBu").each(async (_idx, el) => {
    const x = $(el);
    let category = x.find("a._2whKao").text();
    if (category) {
      Categories.push(category);
    }
    category = null;
  });
  obj["Mother Category"] = Categories[1];
  obj["Category"] = Categories[2];
  obj["Sub-Category"] = Categories[3];
  obj["Product"] = Categories[Categories.length - 2];
  console.log(Categories);
  if (Categories.length) {
    const product = obj["Product"].split(" ");
    const Brand = Categories[Categories.length - 1].split(" ");
    let pos = Brand[Brand.length - 1];
    for (let i = 0; i < Brand.length; i++) {
      if (Brand[i] === product[0]) {
        pos = i;
        break;
      }
    }
    let st = "";
    for (let i = 0; i < pos; i++) {
      st += Brand[i];
    }
    obj["Brand"] = st;
  }

  Categories.length = 0;

  //scraping the pagelink for the reviews
  let reviewsLink = $("div.col.JOpGWq>a").attr("href");
  if (reviewsLink !== undefined) {
    obj["reviewsLink"] = `https://www.flipkart.com${reviewsLink}`;
  }
  reviewsLink = null;

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
  highLits.length = 0;

  //selecting the product details element and the looping to get the complete product details
  $("table._14cfVK>tbody>tr._1s_Smc.row").each(async (_idx, el) => {
    const x = $(el);
    let key = x.find("td._1hKmbr.col.col-3-12").text();
    let value = x.find("li._21lJbe").text();
    if (key !== "" && value !== "") {
      obj[key] = value;
    }
    key = null;
    value = null;
  });

  // Scraping the sellers page link
  let sellerslink = $("li._38I6QT>a").attr("href");
  if (sellerslink) {
    obj["sellerslink"] = `https://www.flipkart.com${sellerslink}`;
  }
  sellerslink = null;
  let description = $("div._1mXcCf").text();

  let count = 1;
  $("li._20Gt85._1Y_A6W").each(async (_idx, el) => {
    count++;
  });
  obj["Number of images"] = count;
  if (description === "") {
    description = "NA";
  }
  obj["Description"] = description;
  count = null;
  description = null;

  return obj;
};

// Saving the data to the database
let sql = async (listofproducts) => {
  let listofsellers = [],
    listofreviews = [];

  //Separating the sellersdetails from productDetails
  if (listofproducts.sellerDetails) {
    listofsellers = listofproducts.sellerDetails;
  }
  delete listofproducts.sellerDetails;

  //Separating the Reviews from productDetails
  if (listofproducts["POSITIVE_FIRST"]) {
    listofreviews = [...listofreviews, ...listofproducts["POSITIVE_FIRST"]];
  }
  if (listofproducts["NEGATIVE_FIRST"]) {
    listofreviews = [...listofreviews, ...listofproducts["NEGATIVE_FIRST"]];
  }

  delete listofproducts["POSITIVE_FIRST"];
  delete listofproducts["NEGATIVE_FIRST"];

  // // Converting the JSON into csv file
  // convertJSONtoCSV(listofproducts, listofsellers, listofreviews, num);

  // Inserting the data into database
  let Product =
    "INSERT INTO FLIPKART_PRODUCT_TABLE (imagelink,Productlink, Position,Product, ProductName , Brand , Price ,Price_per_unit, maxretailprice , stars, Num_Ratings , Num_Reviews , Mother_Category , Category ,Sub_Category,num_1_star_ratings ,num_2_star_ratings ,num_3_star_ratings ,num_4_star_ratings ,num_5_star_ratings ,Platform,Quantity ,Quantity_unit, Num_sellers , Description, Num_Images ,Is_Ads,Net_Rating_Score_NRS, Discount ,Search_Term ,Min_Price , Max_Price , St_dev_Price, Title_Length , Description_Length , Date) VALUES ?";

  let Seller =
    "INSERT INTO FLIPKART_SELLERS_TABLE (SellersName , Price,Ratings,Flipkart_Assured , ProductName , Date ) VALUES ?";

  let Reviews =
    "INSERT INTO FLIPKART_REVIEWS_TABLE (Title , Summary ,Type , ProductName , Date ) VALUES ?";

  let values = [],
    values1 = [],
    values2 = [];
  //Make an array of values:
  let keys = [];

  for (let value in listofproducts) {
    keys.push(listofproducts[value]);
  }
  values.push(keys);

  for (let i = 0; i < listofsellers.length; i++) {
    let keys = [];

    for (let value in listofsellers[i]) {
      keys.push(listofsellers[i][value]);
    }
    values1.push(keys);
  }
  for (let i = 0; i < listofreviews.length; i++) {
    let keys = [];

    for (let value in listofreviews[i]) {
      keys.push(listofreviews[i][value]);
    }
    values2.push(keys);
  }
  //Execute the SQL statement, with the value array:
  connection.query(Product, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of reco rds inserted: " + result.affectedRows);
  });
  connection.query(Seller, [values1], function (err, result) {
    if (err) throw err;
    console.log("Number of reco rds inserted: " + result.affectedRows);
  });
  connection.query(Reviews, [values2], function (err, result) {
    if (err) throw err;
    console.log("Number of reco rds inserted: " + result.affectedRows);
  });
  // connection.query(
  //   "SELECT * FROM PRODUCT_TABLE",
  //   function (err, result, fields) {
  //     if (err) throw err;
  //     console.log(result);
  //   }
  // );
};

// Exporting all the fields so that they can be accessed from other files whenever neccessary
module.exports = {
  headers,
  allProducts,
  imglink,
  typesOfRatings,
  urlmaking,
  fields,
  replce,
  sql,
  scrapdetails,
  scrapreviews,
};
