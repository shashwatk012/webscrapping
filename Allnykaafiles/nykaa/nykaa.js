"use strict";
const { nykaafetchIndividualDetails } = require("./nykaadetails");
const { nykaafetchUrlDetails } = require("./nykaaurldetails");
const { nykaafetchUrlDetails1 } = require("./nykaaurldetails1");
const { nykaafetchReviews } = require("./nykaareviews");
const { check } = require("./checkformat");
const { nykaasql } = require("../../text");

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
  "Date",
];

const urlmaking = (category) => {
  const url = `https://www.nykaa.com/search/result/?q=${category}&root=search&searchType=history&suggestionType=query&ssp=2&searchItem=${category}&sourcepage=home&`;
  return url;
};

const nykaa = async (Categories) => {
  try {
    console.log(Categories);
    // Declaration of an array to store all the product details
    let listofproducts = [];

    // Running a loop to scrap each product
    for (let i = 0; i < Categories.length; i++) {
      listofproducts = [];
      let browser, page;
      // Storing the number of data to be scraped in numData variable
      let numOfData = Categories[i].data;
      let category = Categories[i].category;
      //Creating the link to be scrapped
      let url = urlmaking(Categories[i].category);

      let arr = [];
      let data = [];

      const flag = await check(url, browser, page);
      if (flag === "NOT POSSIBLE") {
        continue;
      }

      //function to scrap the data from the main page
      if (flag) {
        const allProductDetails = await nykaafetchUrlDetails(
          url,
          browser,
          page
        );
        if (!allProductDetails[0].message) {
          //storing the coming data in arr
          arr = [...arr, ...allProductDetails];
        }

        allProductDetails.length = 0;
      } else {
        const allProductDetails = await nykaafetchUrlDetails1(
          url,
          browser,
          page
        );
        if (!allProductDetails[0].message) {
          //storing the coming data in arr
          arr = [...arr, ...allProductDetails];
        }
        allProductDetails.length = 0;
      }

      console.log(arr.length);

      //arr contains the whole product but we need only required number of data so pushing the required number of data in data array
      for (let j = 0; j < Math.min(arr.length, numOfData); j++) {
        data[j] = arr[j];
      }

      // looping to go inside the individual products
      for (let j = 0; j < data.length; j++) {
        // scrapping all the required details by going inside every individual products
        let details = await nykaafetchIndividualDetails(
          data[j].productlink,
          browser,
          page
        );
        if (details.message !== "NOT POSSIBLE") {
          for (let key in details) {
            data[j][key] = details[key];
          }
          let NetRatingRank =
            (data[j]["5 star ratings"] +
              data[j]["4 star ratings"] -
              (data[j]["2 star ratings"] + data[j]["1 star ratings"])) /
            (data[j]["5 star ratings"] +
              data[j]["4 star ratings"] +
              data[j]["3 star ratings"] +
              (data[j]["2 star ratings"] + data[j]["1 star ratings"]));

          data[j]["Net Rating Score (NRS)"] = NetRatingRank * 100;
        }

        // if (details.reviewsLink !== undefined) {
        //   const totalReviewsandratings = await nykaafetchReviews(
        //     data[j].reviewsLink,
        //     browser,
        //     page,
        //     data[j]["ProductName"]
        //   );
        //   if (totalReviewsandratings.message !== "NOT POSSIBLE") {
        //     for (let key in totalReviewsandratings) {
        //       data[j][key] = totalReviewsandratings[key];
        //     }
        //   }
        // }

        data[j]["Platform"] = "nykaa";

        if (data[j]["ProductName"]) {
          data[j]["Title Length"] = data[j]["ProductName"].length;
        }

        // data[j]["Description Length"] = data[j]["Description"].length;

        let date = new Date();

        data[j]["Date"] = date.toLocaleDateString();

        data[j]["Search Term"] = category;

        data[j]["Position"] = j + 1;

        // Making a new array of product with required fields
        let obj = {};
        for (let k = 0; k < fields.length; k++) {
          if (data[j][fields[k]]) {
            obj[fields[k]] = data[j][fields[k]];
          } else {
            obj[fields[k]] = null;
          }
        }
        // if (obj["MOST_USEFUL"]) {
        //   listofreviews = [...listofreviews, ...obj["MOST_USEFUL"]];
        // }
        // delete obj["MOST_USEFUL"];
        listofproducts.push(obj);
        //converting into csv file
        // convertJSONtoCSV(listofproducts, "flipkartProductdetails");
        console.log(j);
      }
      await nykaasql(listofproducts);
      numOfData = null;
      url = null;
      arr.length = 0;
      data.length = 0;
    }
    return listofproducts;
  } catch (e) {
    console.log(e);
    return [{ message: "Unable to fetch. Try again later" }];
  }
};

module.exports = { nykaa };
