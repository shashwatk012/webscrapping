"use strict";
// In this file all the reusable code are put together so that they can be called as per need.

// Importing the cheerio module to load the html
const cheerio = require("cheerio");

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

// Saving the data to the database
let sql = async (listofproducts) => {
  let listofsellers = [],
    listofreviews = [];

  //Separating the sellersdetails from productDetails
  if (listofproducts.sellerDetails && listofproducts.sellerDetails.length > 0) {
    listofsellers = listofproducts.sellerDetails;
  }
  delete listofproducts.sellerDetails;

  //Separating the Reviews from productDetails
  if (
    listofproducts["POSITIVE_FIRST"] &&
    listofproducts["POSITIVE_FIRST"].length > 0
  ) {
    listofreviews = [...listofreviews, ...listofproducts["POSITIVE_FIRST"]];
  }
  if (
    listofproducts["NEGATIVE_FIRST"] &&
    listofproducts["NEGATIVE_FIRST"].length > 0
  ) {
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
    "INSERT INTO FLIPKART_REVIEWS_TABLE (Title,Summary,Type,ProductName,Date) VALUES ?";

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
    let keys1 = [];

    for (let value in listofsellers[i]) {
      keys1.push(listofsellers[i][value]);
    }
    values1.push(keys1);
  }
  for (let i = 0; i < listofreviews.length; i++) {
    let keys1 = [];

    for (let value in listofreviews[i]) {
      keys1.push(listofreviews[i][value]);
    }
    values2.push(keys1);
  }
  //Execute the SQL statement, with the value array:
  if (values.length > 0) {
    connection.query(Product, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of reco rds inserted: " + result.affectedRows);
    });
  }
  if (values1.length > 0) {
    connection.query(Seller, [values1], function (err, result) {
      if (err) throw err;
      console.log("Number of reco rds inserted: " + result.affectedRows);
    });
  }
  if (values2.length > 0) {
    connection.query(Reviews, [values2], function (err, result) {
      if (err) throw err;
      console.log("Number of reco rds inserted: " + result.affectedRows);
    });
  }

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
};
