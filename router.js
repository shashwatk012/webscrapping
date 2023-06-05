"use strict";
// In this file all the api routes are defined such as /flipkartdetailsbylink,/flipkartdetails, etc

// Importing all the modules and files required
const express = require("express");
const router = new express.Router();

// Importing the file to scrap the complete products details from nykaa
const { nykaafetchIndividualDetails } = require("./nykaa/nykaadetails");
const { flipkartbylink } = require("./flipkartbylink/flipkartbylink");
const { amazon } = require("./amazon/amazon");
const { flipkart } = require("./flipkart/flipkart");
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
    res.send(await flipkartbylink(req["body"].link));
  } catch (e) {
    res.send("Check the input format");
  }
});

// Router to handle post request made by client to scrap the numver of categories product details
router.post("/flipkartdetails1", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart(req["body"]);

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
