"use strict";

const { flipkartfetchUrlDetails } = require("./flipkarturlDetails");
const { flipkartfetchReviews } = require("./flipkartreviews");
const { flipkartfetchIndividualDetails } = require("./flipkartdetails");
const { flipkartsellerslist } = require("./flipkartsellerslist");
const { typesOfRatings, fields } = require("../text");

const urlmaking = (category) => {
  const url = `https://www.flipkart.com/search?q=${category}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`;
  return url;
};

const flipkart2 = async (Categories) => {
  try {
    console.log(Categories);
    // Declaration of an array to store all the product details
    let listofproducts = [];

    // Running a loop to scrap each product
    for (let i = 0; i < Categories.length; i++) {
      // Storing the number of data to be scraped in numData variable
      let numOfData = Categories[i].data;

      //Creating the link to be scrapped
      let url = urlmaking(Categories[i].category);

      let arr = [];
      let data = [];
      for (let i = 0; i < 100; i++) {
        //Scrapping the data from the provided url from all the pages
        let urls = url;

        //Changing the page number to scrap data from the next page
        urls += `&page=${i + 1}`;
        //function to scrap the data from the main page
        const allProductDetails = await flipkartfetchUrlDetails(urls);

        if (allProductDetails.length === 0) {
          break;
        }
        if (allProductDetails[0].message === "Can not fetch") {
          continue;
        }
        //storing the coming data in arr
        arr = [...arr, ...allProductDetails];
        allProductDetails.length = 0;
        if (arr.length >= numOfData) {
          break;
        }
      }

      //arr contains the whole product but we need only required number of data so pushing the required number of data in data array
      for (let j = 0; j < Math.min(arr.length, numOfData); j++) {
        data[j] = arr[j];
      }

      // looping to go inside the individual products
      for (let i = 0; i < data.length; i++) {
        let browser, page;
        // scrapping all the required details by going inside every individual products
        let details = await flipkartfetchIndividualDetails(
          data[i].productlink,
          browser,
          page
        );
        if (details.message === "Can not fetch") {
          continue;
        }
        for (let key in details) {
          data[i][key] = details[key];
        }

        if (details.sellerslink !== undefined) {
          const sellers = await flipkartsellerslist(
            details.sellerslink,
            browser,
            page
          );
          if (sellers.message === "Can not fetch") {
            continue;
          }
          data[i]["NumberofSellers"] = sellers.NumberofSellers;
          data[i]["sellerDetails"] = sellers.sellersDetails;
        }

        data[i]["Platform"] = "Flipkart";

        // Checking whether reviews page is available on the site or not
        if (details.reviewsLink !== undefined) {
          let url1 = details.reviewsLink;
          url1 = url1.replace(
            "&marketplace=FLIPKART",
            "&aid=overall&certifiedBuyer=false&sortOrder="
          );

          let flag = true;
          // looping to scrap the different kinds of reviews such as "MOST_RECENT", "POSITIVE", "NEGATIVE"
          for (let key of typesOfRatings) {
            let urls = url1 + `${key}`;
            const totalReviewsandratings = await flipkartfetchReviews(
              urls,
              key,
              browser,
              page
            );
            if (totalReviewsandratings.message === "Can not fetch") {
              flag = false;
              break;
            }
            for (let key in totalReviewsandratings) {
              data[i][key] = totalReviewsandratings[key];
            }
            urls = null;
          }
          if (!flag) {
            continue;
          }
          flag = null;
          url1 = null;
        }

        // Making a new array of product with required fields
        let obj = {};
        for (let k = 0; k < fields.length; k++) {
          obj[fields[k]] = data[i][fields[k]];
        }
        listofproducts.push(obj);
        //converting into csv file
        // convertJSONtoCSV(listofproducts, "flipkartProductdetails");
        console.log(i);
      }
      numOfData = null;
      url = null;
      arr.length = 0;
      data.length = 0;
    }
    return listofproducts;
  } catch (e) {
    return [{ message: "Unable to fetch. Try again later" }];
  }
};

module.exports = { flipkart2 };
