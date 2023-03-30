const express = require("express");
const router = new express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const { fetchUrlDetails } = require("./urlDetails");
const { fetchReviews } = require("./reviews");
const { fetchIndividualDetails } = require("./details");
const { convertJSONtoCSV } = require("./csv");

//Calling middleware to identify the incoming JSON from the front end
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

//Router to serve index file
router.get("/", async (req, res) => {
  res.render("index");
});

//Router to handle the post request
router.post("/details", async (req, res) => {
  try {
    let url = req.body.link; //getting the link to be scrapped
    let numOfData = req.body.data; //Number of products to be scrapped
    url = url.replace("nb_sb_noss_1", "sr_pg_0"); //Replacing few substrings from the url to scrap the data from more than one page
    url = url.replace("crid", "page=0&crid");
    let arr = [],
      data = [];
    for (let i = 0; i < 2; i++) {
      //Scrapping the data from the provided url from all the pages
      url = url.replace(`page=${i}&crid`, `page=${i + 1}&crid`); //Changing the page number to scrap data from the next page
      url = url.replace(`sr_pg_${i}`, `sr_pg_${i + 1}`);
      const allProductDetails = await fetchUrlDetails(url); //function to scrap the data
      arr = [...arr, ...allProductDetails]; //storing the coming data in arr
    }
    if (numOfData > arr.length) {
      //checking whether the number of required data is more than or less than available data
      res.send("Number of required data is more than available data");
    } else {
      for (let i = 0; i < numOfData; i++) {
        data = [...data, arr[i]]; //arr contains the whole product but we need only required number of data so pushing the required number of data in data array
      }
      const uniqueKeys = new Set();
      for (let i = 0; i < numOfData; i++) {
        let details = await fetchIndividualDetails(data[i].link); // scrapping all the required details by going inside every individual products
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
        // if (details.reviewsLink !== undefined) {
        //   const totalReviewsandratings = await fetchReviews(
        //     details.reviewsLink
        //   );
        //   data[i][`total Reviews and Ratings`] = totalReviewsandratings[0];
        //   data[i][`top10reviews`] = totalReviewsandratings[1];

        //   for (const element of typesOfRatings) {
        //     const str =
        //       details.reviewsLink + `&pageNumber=1&filterByStar=${element}`;
        //     const data1 = await fetchReviews(str);
        //     data[i][`${element} reviews and ratings`] = data1[0];
        //     data[i][`top 10 ${element} reviews`] = data1[1];
        //   }
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
      convertJSONtoCSV(data); //converting into csv file
      res.send("File has been saved");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = { router };
