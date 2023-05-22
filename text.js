"use strict";

const headers = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,la;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    Referer: "https://www.google.com",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  },
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
  "ProductName",
  "Brand",
  "price",
  "maxretailprice",
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

module.exports = {
  headers,
  allProducts,
  imglink,
  typesOfRatings,
  urlmaking,
  fields,
  replce,
};
