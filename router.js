"use strict";
// In this file all the api routes are defined such as /flipkartdetailsbylink,/flipkartdetails, etc

// Importing all the modules and files required
const express = require("express");
const router = new express.Router();

// Importing the file to scrap the complete products details from nykaa and flipkart
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
const { nykaa2 } = require("./Allnykaafiles/nykaa2/nykaa");
const { nykaa3 } = require("./Allnykaafiles/nykaa3/nykaa");
const { nykaa4 } = require("./Allnykaafiles/nykaa4/nykaa");
const { nykaa5 } = require("./Allnykaafiles/nykaa5/nykaa");
const { nykaa6 } = require("./Allnykaafiles/nykaa6/nykaa");
const { nykaa7 } = require("./Allnykaafiles/nykaa7/nykaa");
const { nykaa8 } = require("./Allnykaafiles/nykaa8/nykaa");
const { nykaa9 } = require("./Allnykaafiles/nykaa9/nykaa");
const { nykaa10 } = require("./Allnykaafiles/nykaa10/nykaa");
const { nykaa11 } = require("./Allnykaafiles/nykaa11/nykaa");
const { nykaa12 } = require("./Allnykaafiles/nykaa12/nykaa");
const { nykaa13 } = require("./Allnykaafiles/nykaa13/nykaa");
const { nykaa14 } = require("./Allnykaafiles/nykaa14/nykaa");
const { nykaa15 } = require("./Allnykaafiles/nykaa15/nykaa");
const { nykaa16 } = require("./Allnykaafiles/nykaa16/nykaa");
const { nykaa17 } = require("./Allnykaafiles/nykaa17/nykaa");
const { nykaa18 } = require("./Allnykaafiles/nykaa18/nykaa");
const { nykaa19 } = require("./Allnykaafiles/nykaa19/nykaa");
const { nykaa20 } = require("./Allnykaafiles/nykaa20/nykaa");
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

router.post("/nykaadetails2", async (req, res) => {
  try {
    let listofproducts = await nykaa2(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails3", async (req, res) => {
  try {
    let listofproducts = await nykaa3(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails4", async (req, res) => {
  try {
    let listofproducts = await nykaa4(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails5", async (req, res) => {
  try {
    let listofproducts = await nykaa5(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails6", async (req, res) => {
  try {
    let listofproducts = await nykaa6(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails7", async (req, res) => {
  try {
    let listofproducts = await nykaa7(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails8", async (req, res) => {
  try {
    let listofproducts = await nykaa8(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails9", async (req, res) => {
  try {
    let listofproducts = await nykaa9(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails10", async (req, res) => {
  try {
    let listofproducts = await nykaa10(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails11", async (req, res) => {
  try {
    let listofproducts = await nykaa11(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails12", async (req, res) => {
  try {
    let listofproducts = await nykaa12(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails13", async (req, res) => {
  try {
    let listofproducts = await nykaa13(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails14", async (req, res) => {
  try {
    let listofproducts = await nykaa14(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails15", async (req, res) => {
  try {
    let listofproducts = await nykaa15(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails16", async (req, res) => {
  try {
    let listofproducts = await nykaa16(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails17", async (req, res) => {
  try {
    let listofproducts = await nykaa17(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails18", async (req, res) => {
  try {
    let listofproducts = await nykaa18(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails19", async (req, res) => {
  try {
    let listofproducts = await nykaa19(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

router.post("/nykaadetails20", async (req, res) => {
  try {
    let listofproducts = await nykaa20(req["body"]);
    // listofproducts = await sql(listofproducts, 5);
    res.send(listofproducts);
  } catch (e) {
    console.log("jh");
    res.send("Something went wrong on router");
  }
});

module.exports = { router };
