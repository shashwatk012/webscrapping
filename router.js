const express = require("express");
const router = new express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const { flipkartfetchUrlDetails } = require("./flipkarturlDetails");
const { flipkartfetchReviews } = require("./flipkartreviews");
const { flipkartfetchIndividualDetails } = require("./flipkartdetails");
const { amazonfetchUrlDetails } = require("./amazonurlDetails");
const { amazonfetchReviews } = require("./amazonreviews");
const { amazonfetchIndividualDetails } = require("./amazondetails");
const { convertJSONtoCSV } = require("./csv");

//Calling middleware to identify the incoming JSON from the front end
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

//Router to serve index file
router.get("/", async (req, res) => {
  res.render("options");
});

router.get("/flipkart", async (req, res) => {
  res.render("index", {
    site: "Flipkart",
  });
});

router.get("/amazon", async (req, res) => {
  res.render("index", {
    site: "Amazon",
  });
});

router.post("/flipkartdetails", async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.link === "" && req.body.category === "select") {
      return res.send("Choose any category or provide any link");
    }
    //getting the link to be scrapped
    if (req.body.link !== "") {
      url = req.body.link;
    } else if (req.body.SubCategory === "Select") {
      url = `https://www.flipkart.com/search?q=${req.body.category}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`;
    } else {
      url = `https://www.flipkart.com/search?q=${req.body.SubCategory}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`;
    }

    //Number of products to be scrapped
    let numOfData = req.body.data;
    let arr = [],
      data = [];
    for (let i = 0; i < 100; i++) {
      //Scrapping the data from the provided url from all the pages
      let urls = url;

      //Changing the page number to scrap data from the next page
      urls += `&page=${i + 1}`;

      //function to scrap the data
      const allProductDetails = await flipkartfetchUrlDetails(urls);
      if (allProductDetails.length === 0) {
        break;
      }

      //storing the coming data in arr
      arr = [...arr, ...allProductDetails];
      if (arr.length >= numOfData) {
        break;
      }
    }
    if (numOfData > arr.length) {
      //checking whether the number of required data is more than or less than available data
      res.send("Number of required data is more than available data");
    } else {
      for (let i = 0; i < numOfData; i++) {
        //arr contains the whole product but we need only required number of data so pushing the required number of data in data array
        data = [...data, arr[i]];
      }
      const uniqueKeys = new Set();
      data.forEach((element) => {
        for (const key in element) {
          uniqueKeys.add(key);
        }
      });
      for (let i = 0; i < numOfData; i++) {
        // scrapping all the required details by going inside every individual products
        let details = await flipkartfetchIndividualDetails(data[i].productlink);
        for (const key in details) {
          uniqueKeys.add(key);
          data[i][key] = details[key];
        }
        const typesOfRatings = [
          "MOST_RECENT",
          "POSITIVE_FIRST",
          "NEGATIVE_FIRST",
        ];
        if (details.reviewsLink !== undefined) {
          const totalReviewsandratings = await flipkartfetchReviews(
            details.reviewsLink
          );
          for (const key in totalReviewsandratings) {
            uniqueKeys.add(key);
            data[i][key] = totalReviewsandratings[key];
          }
        }
        console.log(i);
      }
      for (let i = 0; i < data.length; i++) {
        uniqueKeys.forEach(function (value) {
          if (data[i][value] === undefined) {
            data[i][value] = "Not available";
          }
        });
      }
      let category = `flipkart${req.body.SubCategory}`;
      if (req.body.SubCategory === "Select") {
        category = `flipkart${req.body.category}`;
      }
      //converting into csv file
      convertJSONtoCSV(data, category);
      res.send("File has been saved");
    }
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

router.post("/amazondetails", async (req, res) => {
  try {
    if (req.body.link === "" && req.body.category === "select") {
      return res.send("Choose any category or provide any link");
    }
    //getting the link to be scrapped
    if (req.body.link !== "") {
      url = req.body.link;
      url = url.replace("nb_sb_noss_2", "sr_pg_0"); //Replacing few substrings from the url to scrap the data from more than one page
      url = url.replace("crid", "page=0&crid");
    } else if (req.body.SubCategory === "Select") {
      url = `https://www.amazon.in/s?k=${req.body.category}&page=0&crid=1EAMOLVYHA0EG&sprefix=suncream%2Caps%2C303&ref=sr_pg_0`;
    } else {
      url = `https://www.amazon.in/s?k=${req.body.SubCategory}&page=0&crid=1EAMOLVYHA0EG&sprefix=suncream%2Caps%2C303&ref=sr_pg_0`;
    }
    let numOfData = req.body.data; //Number of products to be scrapped
    let arr = [],
      data = [];
    for (let i = 0; i < 2; i++) {
      //Scrapping the data from the provided url from all the pages
      url = url.replace(`page=${i}&crid`, `page=${i + 1}&crid`); //Changing the page number to scrap data from the next page
      url = url.replace(`sr_pg_${i}`, `sr_pg_${i + 1}`);
      const allProductDetails = await amazonfetchUrlDetails(url); //function to scrap the data
      arr = [...arr, ...allProductDetails]; //storing the coming data in arr
      if (arr.length >= numOfData) {
        break;
      }
    }
    if (numOfData > arr.length) {
      //checking whether the number of required data is more than or less than available data
      res.send("Number of required data is more than available data");
    } else {
      for (let i = 0; i < numOfData; i++) {
        data = [...data, arr[i]]; //arr contains the whole product but we need only required number of data so pushing the required number of data in data array
      }
      const uniqueKeys = new Set();
      data.forEach((element) => {
        for (const key in element) {
          uniqueKeys.add(key);
        }
      });
      for (let i = 0; i < numOfData; i++) {
        let details = await amazonfetchIndividualDetails(data[i].link); // scrapping all the required details by going inside every individual products
        for (const key in details) {
          uniqueKeys.add(key);
          data[i][key] = details[key];
        }

        // const typesOfRatings = [
        //   "positive",
        //   "critical",
        //   "five_star",
        //   "four_star",
        //   "three_star",
        //   "two_star",
        //   "one_star",
        // ];
        // if (details.reviewsLink !== "https://amazon.inundefined") {
        //   const totalReviewsandratings = await amazonfetchReviews(
        //     details.reviewsLink
        //   );
        //   data[i][`total Reviews and Ratings`] = totalReviewsandratings[0];
        //   data[i][`top10reviews`] = totalReviewsandratings[1];

        // for (const element of typesOfRatings) {
        //   const str =
        //     details.reviewsLink + `&pageNumber=1&filterByStar=${element}`;
        //   const data1 = await amazonfetchReviews(str);
        //   if (data1[0]) {
        //     data[i][`${element} reviews and ratings`] = data1[0];
        //   }
        //   if (data1[1]) {
        //     data[i][`top 10 ${element} reviews`] = data1[1];
        //   }
        // }
        // }
        console.log(i);
      }
      for (let i = 0; i < data.length; i++) {
        uniqueKeys.forEach(function (value) {
          if (data[i][value] === undefined) {
            data[i][value] = "Not available";
          }
        });
      }
      let category = `amazon${req.body.SubCategory}`;
      if (req.body.SubCategory === "Select") {
        category = `amazon${req.body.category}`;
      }
      //converting into csv file
      convertJSONtoCSV(data, category);
      res.send("File has been saved");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = { router };
