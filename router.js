"use strict";
const express = require("express");
const router = new express.Router();
const { flipkartfetchUrlDetails } = require("./flipkart/flipkarturlDetails");
const { flipkartfetchReviews } = require("./flipkart/flipkartreviews");
const {
  flipkartfetchIndividualDetails,
} = require("./flipkart/flipkartdetails");
const { flipkartsellerslist } = require("./flipkart/flipkartsellerslist");
const { nykaafetchIndividualDetails } = require("./nykaadetails");
// const { convertJSONtoCSV } = require("./csv");
const { typesOfRatings, urlmaking, fields } = require("./text");
const { amazon } = require("./amazon/amazon");
const { flipkart } = require("./flipkart/flipkart");
const { flipkart2 } = require("./flipkart2/flipkart");
const { flipkart3 } = require("./flipkart3/flipkart");
const { flipkart4 } = require("./flipkart4/flipkart");

// convertJSONtoCSV(arr, "flipkartProductdetails");

//Calling middleware to identify the incoming JSON from the front end
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get("/", async (req, res) => {
  try {
    res.send("HII");
  } catch {
    res.send("fuss");
  }
});

// Router to handle post request made by flipkart scraping page
router.post("/flipkartdetailsbylink", async (req, res) => {
  try {
    let browser, page;
    let flag = true;
    //Creating the link to be scrapped
    let url = req["body"].link;

    const data = {
      productlink: url,
    };

    // scrapping all the required details by going inside every individual products
    let details = await flipkartfetchIndividualDetails(
      data.productlink,
      browser,
      page
    );
    if (details.message === "Can not fetch") {
      flag = false;
    }
    for (let key in details) {
      data[key] = details[key];
    }

    if (details.sellerslink !== undefined) {
      let sellers = await flipkartsellerslist(
        details.sellerslink,
        browser,
        page
      );
      if (sellers.message === "Can not fetch") {
        flag = false;
      }
      data["NumberofSellers"] = sellers.NumberofSellers;
      data["sellerDetails"] = sellers.sellersDetails;
    }

    data["Platform"] = "Flipkart";

    // Checking whether reviews page is available on the site or not
    if (details.reviewsLink !== undefined) {
      let url1 = details.reviewsLink;
      url1 = url1.replace(
        "&marketplace=FLIPKART",
        "&aid=overall&certifiedBuyer=false&sortOrder="
      );

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
        }
        for (let key in totalReviewsandratings) {
          data[key] = totalReviewsandratings[key];
        }
      }
    }

    // Making a new array of product with required fields
    let obj = {};
    for (let k = 0; k < fields.length; k++) {
      obj[fields[k]] = data[fields[k]];
    }
    if (!flag) {
      res.send("Something went wrong! Try again");
    } else {
      res.send(obj);
    }
  } catch (e) {
    res.send("Check the input format");
  }
});

// Router to handle post request made by flipkart scraping page
router.post("/flipkartdetails1", async (req, res) => {
  try {
    const listofproducts = await flipkart(req["body"]);
    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

// Router to handle post request made by flipkart scraping page
router.post("/flipkartdetails2", async (req, res) => {
  try {
    const listofproducts = await flipkart2(req["body"]);
    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

// Router to handle post request made by flipkart scraping page
router.post("/flipkartdetails3", async (req, res) => {
  try {
    const listofproducts = await flipkart3(req["body"]);
    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

// Router to handle post request made by flipkart scraping page
router.post("/flipkartdetails4", async (req, res) => {
  try {
    const listofproducts = await flipkart4(req["body"]);
    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/amazondetails", async (req, res) => {
  try {
    const listofproducts = await amazon(req["body"]);
    res.send(listofproducts);
  } catch (e) {
    console.log("Something went wrong on router");
  }
});

router.post("/nykaadetailsbylink", async (req, res) => {
  try {
    //Creating the link to be scrapped
    let url = req["body"].link;

    const data = {
      productlink: url,
    };

    // scrapping all the required details by going inside every individual products
    let details = await nykaafetchIndividualDetails(data.productlink);
    for (let key in details) {
      data[key] = details[key];
    }

    data["Platform"] = "meesho";

    // Checking whether reviews page is available on the site or not
    // if (details.reviewsLink !== undefined) {
    //   let url1 = details.reviewsLink;

    //   // looping to scrap the different kinds of reviews such as "MOST_RECENT", "POSITIVE", "NEGATIVE"
    //   // const totalReviewsandratings = await meeshofetchReviews(urls, key);
    //   // for (let key in totalReviewsandratings) {
    //   //   data[key] = totalReviewsandratings[key];
    //   // }
    // }

    // Making a new array of product with required fields
    let obj = {};
    for (let k = 0; k < fields.length; k++) {
      obj[fields[k]] = data[fields[k]];
    }
    res.send(obj);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

module.exports = { router };
