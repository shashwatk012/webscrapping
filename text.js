"use strict";
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
  "ProductName",
  "Brand",
  "price",
  "maxretailprice",
  "Discount%",
  "stars",
  "Ratings",
  "Reviews",
  "Mother Category",
  "Category",
  "5 star ratings",
  "4 star ratings",
  "3 star ratings",
  "2 star ratings",
  "1 star ratings",
  "Platform",
  "Quantity",
  "NumberofSellers",
  "sellerDetails",
  "Description",
  "Number of images",
  "POSITIVE_FIRST",
  "NEGATIVE_FIRST",
];

const replce = (str) => {
  while (str.includes(",")) {
    str = str.replace(",", "");
  }
  while (str.includes("₹")) {
    str = str.replace("₹", "");
  }
  console.log(str);
  return Number(str);
};

module.exports = {
  allProducts,
  imglink,
  typesOfRatings,
  urlmaking,
  fields,
  replce,
};
