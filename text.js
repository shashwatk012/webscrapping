"use strict";
const { convertJSONtoCSV } = require("./csv");
const connection = require("./connection");

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

const typesOfRatings = ["POSITIVE_FIRST", "NEGATIVE_FIRST"];
const urlmaking = (category) => {
  const url = `https://www.flipkart.com/search?q=${category}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`;
  return url;
};

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

const replce = (str) => {
  while (str.includes(",")) {
    str = str.replace(",", "");
  }
  while (str.includes("₹")) {
    str = str.replace("₹", "");
  }
  return Number(str);
};

let sql = async (listofproducts, num) => {
  const listofsellers = [],
    listofreviews = [];
  for (let i = 0; i < listofproducts.length; i++) {
    if (listofproducts[i].sellerDetails) {
      for (let j = 0; j < listofproducts[i].sellerDetails.length; j++) {
        listofsellers.push(listofproducts[i].sellerDetails[j]);
      }
    }
    delete listofproducts[i].sellerDetails;
  }

  for (let i = 0; i < listofproducts.length; i++) {
    if (listofproducts[i]["POSITIVE_FIRST"]) {
      for (let j = 0; j < listofproducts[i]["POSITIVE_FIRST"].length; j++) {
        listofreviews.push(listofproducts[i]["POSITIVE_FIRST"][j]);
      }
    }
    if (listofproducts[i]["NEGATIVE_FIRST"]) {
      for (let j = 0; j < listofproducts[i]["NEGATIVE_FIRST"].length; j++) {
        listofreviews.push(listofproducts[i]["NEGATIVE_FIRST"][j]);
      }
    }
    delete listofproducts[i]["POSITIVE_FIRST"];
    delete listofproducts[i]["NEGATIVE_FIRST"];
  }
  convertJSONtoCSV(listofproducts, listofsellers, listofreviews, num);
  // let Product =
  //   "INSERT INTO PRODUCT_TABLE (imagelink, productlink, Position, ProductName, Brand, price, maxretailprice, stars, Num_Ratings, Num_Reviews, Mother_Category, Category,num_1_star_ratings,num_2_star_ratings,num_3_star_ratings,num_4_star_ratings,num_5_star_ratings,Platform,Quantity, Num_sellers, Description, Num_Images,Net_Rating_Score_NRS, Discount,Search_Term,Min_Price, Max_Price, St_dev_Price, Title_Length, Description_Length, Date) VALUES ?";

  // let Seller =
  //   "INSERT INTO SELLER_TABLE (Seller_Name, price, Ratings,Flipkart_Assured, ProductName ) VALUES ?";

  // let Reviews =
  //   "INSERT INTO Reviews_TABLE (Title, Summary, Type, ProductName ) VALUES ?";

  // let values = [],
  //   values1 = [],
  //   values2 = [];
  // //Make an array of values:
  // for (let i = 0; i < listofproducts.length; i++) {
  //   let keys = [];

  //   for (let value in listofproducts[i]) {
  //     keys.push(listofproducts[i][value]);
  //   }
  //   values.push(keys);
  // }
  // for (let i = 0; i < listofsellers.length; i++) {
  //   let keys = [];

  //   for (let value in listofsellers[i]) {
  //     keys.push(listofsellers[i][value]);
  //   }
  //   values1.push(keys);
  // }
  // for (let i = 0; i < listofreviews.length; i++) {
  //   let keys = [];

  //   for (let value in listofreviews[i]) {
  //     keys.push(listofreviews[i][value]);
  //   }
  //   values2.push(keys);
  // }
  // //Execute the SQL statement, with the value array:
  // connection.query(Product, [values], function (err, result) {
  //   if (err) throw err;
  //   console.log("Number of reco rds inserted: " + result.affectedRows);
  // });
  // connection.query(Seller, [values1], function (err, result) {
  //   if (err) throw err;
  //   console.log("Number of reco rds inserted: " + result.affectedRows);
  // });
  // connection.query(Reviews, [values2], function (err, result) {
  //   if (err) throw err;
  //   console.log("Number of reco rds inserted: " + result.affectedRows);
  // });
  // // connection.query(
  // //   "SELECT * FROM PRODUCT_TABLE",
  // //   function (err, result, fields) {
  // //     if (err) throw err;
  // //     console.log(result);
  // //   }
  // // );
  return listofproducts;
};

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
