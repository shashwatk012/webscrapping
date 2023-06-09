"use strict";
// In this file all the api routes are defined such as /flipkartdetailsbylink,/flipkartdetails, etc

// Importing all the modules and files required
const express = require("express");
const router = new express.Router();

// Importing the file to scrap the complete products details from nykaa
const {
  flipkartbylink,
} = require("./Allflipkartfiles/flipkartbylink/flipkartbylink");
const { amazon } = require("./Allamazonfiles/amazon/amazon");
const { flipkart } = require("./Allflipkartfiles/flipkart/flipkart");
const { flipkart2 } = require("./Allflipkartfiles/flipkart2/flipkart");
const { flipkart3 } = require("./Allflipkartfiles/flipkart3/flipkart");
const { flipkart4 } = require("./Allflipkartfiles/flipkart4/flipkart");
const { flipkart5 } = require("./Allflipkartfiles/flipkart5/flipkart");
const { flipkart6 } = require("./Allflipkartfiles/flipkart6/flipkart");
const { flipkart7 } = require("./Allflipkartfiles/flipkart7/flipkart");
const { flipkart8 } = require("./Allflipkartfiles/flipkart8/flipkart");
const { flipkart9 } = require("./Allflipkartfiles/flipkart9/flipkart");
const { flipkart10 } = require("./Allflipkartfiles/flipkart10/flipkart");
const { flipkart11 } = require("./Allflipkartfiles/flipkart11/flipkart");
const { flipkart12 } = require("./Allflipkartfiles/flipkart12/flipkart");
const { flipkart13 } = require("./Allflipkartfiles/flipkart13/flipkart");
const { flipkart14 } = require("./Allflipkartfiles/flipkart14/flipkart");
const { flipkart15 } = require("./Allflipkartfiles/flipkart15/flipkart");
const { flipkart16 } = require("./Allflipkartfiles/flipkart16/flipkart");
const { flipkart17 } = require("./Allflipkartfiles/flipkart17/flipkart");
const { flipkart18 } = require("./Allflipkartfiles/flipkart18/flipkart");
const { flipkart19 } = require("./Allflipkartfiles/flipkart19/flipkart");
const { flipkart20 } = require("./Allflipkartfiles/flipkart20/flipkart");
const { nykaa } = require("./Allnykaafiles/nykaa/nykaa");
const {
  nykaabylink,
} = require("./Allnykaafiles/nykaadetailsbylink/nykaabylink");

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

router.post("/flipkartdetails2", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart2(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails3", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart3(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails4", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart4(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails5", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart5(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails6", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart6(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails7", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart7(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails8", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart8(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails9", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart9(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails10", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart10(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails11", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart11(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails12", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart12(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails13", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart13(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails14", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart14(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails15", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart15(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails16", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart16(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails17", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart17(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails18", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart18(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails19", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart19(req["body"]);

    res.send(listofproducts);
  } catch (e) {
    res.send("Check the input format");
  }
});

router.post("/flipkartdetails20", async (req, res) => {
  try {
    // Calling the flipkart function to scrap the all categories details
    let listofproducts = await flipkart20(req["body"]);

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
    const obj = await nykaabylink(req.body);
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
