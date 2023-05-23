"use strict";

const { flipkartfetchUrlDetails } = require("./flipkarturlDetails");
const { flipkartfetchReviews } = require("./flipkartreviews");
const { flipkartfetchIndividualDetails } = require("./flipkartdetails");
const { flipkartsellerslist } = require("./flipkartsellerslist");
const { typesOfRatings, fields } = require("../text");
let wait = require("wait-for-stuff");

const urlmaking = (category) => {
  const url = `https://www.flipkart.com/search?q=${category}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`;
  return url;
};

const flipkart = async (Categories) => {
  try {
    console.log(Categories);
    // Declaration of an array to store all the product details
    let listofproducts = [];

    // Running a loop to scrap each product
    for (let i = 0; i < Categories.length; i++) {
      // Storing the number of data to be scraped in numData variable
      let numOfData = Categories[i].data;
      let category = Categories[i].category;
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
        wait.for.time(0.5);

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
      console.log(arr.length);

      //arr contains the whole product but we need only required number of data so pushing the required number of data in data array
      for (let j = 0; j < Math.min(arr.length, numOfData); j++) {
        data[j] = arr[j];
      }

      // looping to go inside the individual products
      for (let j = 0; j < data.length; j++) {
        let browser, page;
        // scrapping all the required details by going inside every individual products
        let details = await flipkartfetchIndividualDetails(
          data[j].productlink,
          browser,
          page
        );
        for (let key in details) {
          data[j][key] = details[key];
        }
        wait.for.time(0.5);

        if (details.sellerslink !== undefined) {
          const sellers = await flipkartsellerslist(
            details.sellerslink,
            browser,
            page,
            data[j]["ProductName"]
          );
          if (sellers.message === "Can not fetch") {
            continue;
          }
          data[j]["NumberofSellers"] = sellers.NumberofSellers;
          data[j]["sellerDetails"] = sellers.sellersDetails;
          data[j]["Max Price"] = sellers["Max Price"];
          data[j]["Min Price"] = sellers["Min Price"];
          data[j]["St-dev-Price"] = sellers["St-dev-Price"];
        }

        data[j]["Platform"] = "Flipkart";

        // Checking whether reviews page is available on the site or not
        if (details.reviewsLink !== undefined) {
          let url1 = details.reviewsLink;
          url1 = url1.replace(
            "&marketplace=FLIPKART",
            "&aid=overall&certifiedBuyer=false&sortOrder="
          );

          // looping to scrap the different kinds of reviews such as "MOST_RECENT", "POSITIVE", "NEGATIVE"
          for (let key of typesOfRatings) {
            wait.for.time(0.5);
            let urls = url1 + `${key}`;
            const totalReviewsandratings = await flipkartfetchReviews(
              urls,
              key,
              browser,
              page,
              data[j]["ProductName"]
            );
            for (let key in totalReviewsandratings) {
              data[j][key] = totalReviewsandratings[key];
            }
            urls = null;
          }
          url1 = null;

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

        data[j]["Title Length"] = data[j]["ProductName"].length;

        data[j]["Description Length"] = data[j]["Description"].length;

        const date = new Date();
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };

        data[j]["Date"] = date.toLocaleString("en-IN", options);

        data[j]["Search Term"] = category;

        data[j]["Position"] = j + 1;

        // Making a new array of product with required fields
        let obj = {};
        for (let k = 0; k < fields.length; k++) {
          obj[fields[k]] = data[j][fields[k]];
        }
        listofproducts.push(obj);
        //converting into csv file
        // convertJSONtoCSV(listofproducts, "flipkartProductdetails");
        console.log(j);
      }
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

module.exports = { flipkart };
