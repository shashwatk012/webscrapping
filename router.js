"use strict";
// In this file all the api routes are defined such as /flipkartdetailsbylink,/flipkartdetails, etc

// Importing all the modules and files required
const express = require("express");
const router = new express.Router();

// Importing the file to scrap the given category products link from flipkart
const { flipkartfetchUrlDetails } = require("./flipkart/flipkarturlDetails");

// Importing the file to scrap the given products positive and negative reviews from flipkart
const { flipkartfetchReviews } = require("./flipkart/flipkartreviews");

// Importing the file to scrap the given complete products details from flipkart
const {
  flipkartfetchIndividualDetails,
} = require("./flipkart/flipkartdetails");

// Importing the file to scrap the given products sellers details from flipkart
const { flipkartsellerslist } = require("./flipkart/flipkartsellerslist");

// Importing the file to scrap the complete products details from nykaa
const { nykaafetchIndividualDetails } = require("./nykaa/nykaadetails");

// Importing module to convert json to csv
const { convertJSONtoCSV } = require("./csv");

// Importing text.js file to use the reusable codes
const { typesOfRatings, urlmaking, fields, sql } = require("./text");

const { amazon } = require("./amazon/amazon");
const { flipkart } = require("./flipkart/flipkart");
const { flipkart2 } = require("./flipkart2/flipkart");
const { flipkart3 } = require("./flipkart3/flipkart");
const { flipkart4 } = require("./flipkart4/flipkart");
const { flipkart5 } = require("./flipkart5/flipkart");
const { flipkart6 } = require("./flipkart6/flipkart");
const { flipkart7 } = require("./flipkart7/flipkart");
const { flipkart8 } = require("./flipkart8/flipkart");
const { flipkart9 } = require("./flipkart9/flipkart");
const { flipkart10 } = require("./flipkart10/flipkart");
const { nykaa } = require("./nykaa/nykaa");

//Calling middleware to identify the incoming JSON from the front end
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// Router to handle get request made by client
router.get("/", async (req, res) => {
  try {
    res.status(200).send("hii");
  } catch {
    res.send("fuss");
  }
});

// Router to handle post request made by client to scrap the particular product details from a link
router.post("/flipkartdetailsbylink", async (req, res) => {
  try {
    let browser, page;
    let flag = true;

    //Creating the link to be scrapped
    let url = req["body"].link;

    // Creating an object which is going to be the response of the coming request
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

    // Inserting all the data into data object
    for (let key in details) {
      data[key] = details[key];
    }

    // Checking whether sellers details are present on the page or not
    if (details.sellerslink !== undefined) {
      // Scrapping the sellers details
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

    // Making a new array of product details with required fields and in required order
    let obj = {};
    for (let k = 0; k < fields.length; k++) {
      obj[fields[k]] = data[fields[k]];
    }
    if (!flag) {
      res.send("Something went wrong! Try again");
    } else {
      console.log(obj);
      res.send(obj);
    }
  } catch (e) {
    res.send("Check the input format");
  }
});

// Router to handle post request made by client to scrap the numver of categories product details
router.post("/flipkartdetails1", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart(req["body"]);

    // Calling the sql function to sae the data into database
    listofproducts = await sql(listofproducts, 1);
    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails2", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart2(req["body"]);

    // Calling the sql function to sae the data into database
    listofproducts = await sql(listofproducts, 2);
    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails3", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart3(req["body"]);

    // Calling the sql function to sae the data into database
    listofproducts = await sql(listofproducts, 3);
    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails4", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart4(req["body"]);

    // Calling the sql function to sae the data into database
    listofproducts = await sql(listofproducts, 4);
    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails5", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart5(req["body"]);

    // Calling the sql function to sae the data into database
    listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails6", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart6(req["body"]);

    // Calling the sql function to sae the data into database
    listofproducts = await sql(listofproducts, 6);
    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails7", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart7(req["body"]);

    // Calling the sql function to sae the data into database
    listofproducts = await sql(listofproducts, 7);
    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails8", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart8(req["body"]);

    // Calling the sql function to sae the data into database
    listofproducts = await sql(listofproducts, 8);
    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails9", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart9(req["body"]);

    // Calling the sql function to sae the data into database
    listofproducts = await sql(listofproducts, 9);
    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails10", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart10(req["body"]);

    // Calling the sql function to sae the data into database
    listofproducts = await sql(listofproducts, 10);
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

// Route to scrap the the data of an individual product through link
router.post("/nykaadetailsbylink", async (req, res) => {
  try {
    let browser, page;
    //Creating the link to be scrapped
    let url = req["body"].link;

    const data = {
      productlink: url,
    };

    // scrapping all the required details by going inside every individual products
    let details = await nykaafetchIndividualDetails(
      data.productlink,
      browser,
      page
    );
    for (let key in details) {
      data[key] = details[key];
    }

    data["Platform"] = "nykaa";

    // Making a new array of product with required fields and in required order
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

// Route to scrap the data of multiple products through given category
router.post("/nykaadetails", async (req, res) => {
  try {
    let listofproducts = await nykaa(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

module.exports = { router };
