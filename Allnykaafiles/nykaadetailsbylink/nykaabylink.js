"use strict";
const { nykaafetchIndividualDetails } = require("./nykaadetails");
const { nykaafetchReviews } = require("./nykaareviews");
const { fetchPosition } = require("./nykaafetchposition");
const { fields } = require("../../text");

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

    if (data.ProductName) {
      data["Title Length"] = data.ProductName.length;
    }

    let date = new Date();

    data["Date"] = date.toLocaleDateString();

    fields.push("MOST_USEFUL");
    // Making a new array of product with required fields and in required order
    let obj = {};
    for (let k = 0; k < fields.length; k++) {
      if (data[fields[k]]) {
        obj[fields[k]] = data[fields[k]];
      } else {
        obj[fields[k]] = null;
      }
    }
    return obj;
  } catch (e) {
    console.log(e);
    return { message: "Unable to fetch. Try again later" };
  }
};

module.exports = { nykaabylink };
