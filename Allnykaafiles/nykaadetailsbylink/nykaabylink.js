"use strict";
const { nykaafetchIndividualDetails } = require("./nykaadetails");
const { nykaafetchReviews } = require("./nykaareviews");
const { fetchPosition } = require("./nykaafetchposition");

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
  "Number of images",
  "Discount%",
  "Search Term",
  "Title Length",
  "Net Rating Score (NRS)",
  "MOST_USEFUL",
  "Date",
];

const nykaabylink = async (body) => {
  try {
    let browser, page;
    //Creating the link to be scrapped
    let url = body.link;

    const data = {
      productlink: url,
    };

    // scrapping all the required details by going inside every individual products
    let details = await nykaafetchIndividualDetails(
      data.productlink,
      browser,
      page
    );
    if (details.message !== "NOT POSSIBLE") {
      for (let key in details) {
        data[key] = details[key];
      }
      let NetRatingRank =
        (data["5 star ratings"] +
          data["4 star ratings"] -
          (data["2 star ratings"] + data["1 star ratings"])) /
        (data["5 star ratings"] +
          data["4 star ratings"] +
          data["3 star ratings"] +
          (data["2 star ratings"] + data["1 star ratings"]));

      data["Net Rating Score (NRS)"] = NetRatingRank * 100;
    }

    if (details.reviewsLink !== undefined) {
      const totalReviewsandratings = await nykaafetchReviews(
        data.reviewsLink,
        browser,
        page,
        data["ProductName"]
      );
      if (totalReviewsandratings.message !== "NOT POSSIBLE") {
        for (let key in totalReviewsandratings) {
          data[key] = totalReviewsandratings[key];
        }
      }
    }

    if (details.posLink !== undefined) {
      const pos = await fetchPosition(details.posLink, browser, page, url);
      data["Position"] = pos;
    }

    data["Platform"] = "nykaa";

    // Making a new array of product with required fields and in required order
    let obj = {};
    for (let k = 0; k < fields.length; k++) {
      obj[fields[k]] = data[fields[k]];
    }
    return obj;
  } catch (e) {
    console.log(e);
    return { message: "Unable to fetch. Try again later" };
  }
};

module.exports = { nykaabylink };
