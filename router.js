const express = require("express");
const router = new express.Router();
const { flipkartfetchUrlDetails } = require("./flipkarturlDetails");
const { flipkartfetchReviews } = require("./flipkartreviews");
const { flipkartfetchIndividualDetails } = require("./flipkartdetails");
const { flipkartsellerslist } = require("./flipkartsellerslist");
const { amazonfetchUrlDetails } = require("./amazonurlDetails");
const { amazonfetchReviews } = require("./amazonreviews");
const { amazonfetchIndividualDetails } = require("./amazondetails");
const { convertJSONtoCSV } = require("./csv");
const { typesOfRatings, urlmaking, fields } = require("./flipkarttext");

let index = 0;

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
    //Creating the link to be scrapped
    let url = req["body"].link;

    const data = {
      productLink: url,
    };

    // scrapping all the required details by going inside every individual products
    let details = await flipkartfetchIndividualDetails(data.productLink);
    for (let key in details) {
      data[key] = details[key];
    }

    if (details.sellerslink !== undefined) {
      let sellers = await flipkartsellerslist(details.sellerslink);
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
        const totalReviewsandratings = await flipkartfetchReviews(urls, key);
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
    res.send(obj);
  } catch (e) {
    res.send("Something went wrong on router");
  }
});

// Router to handle post request made by flipkart scraping page
router.post("/flipkartdetails", async (req, res) => {
  try {
    console.log(req.body);
    // Storing the category to be scraped in Categories variable
    const Categories = req["body"];
    // Declaration of an array to store all the product details
    let listofproducts = [];

    // Running a loop to scrap each product
    for (let i = 0; i < Categories.length; i++) {
      // Storing the number of data to be scraped in numData variable
      let numOfData = Categories[i].data;

      //Creating the link to be scrapped
      let url = urlmaking(Categories[i].category);

      let arr = [],
        data = [];
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

        //storing the coming data in arr
        arr = [...arr, ...allProductDetails];
        if (arr.length >= numOfData) {
          break;
        }
      }

      //arr contains the whole product but we need only required number of data so pushing the required number of data in data array
      for (let j = 0; j < Math.min(arr.length, numOfData); j++) {
        data[j] = arr[j];
      }

      // Declaration of set to take records of all the scrapped fields
      const uniqueKeys = new Set();
      data.forEach((element) => {
        for (let key in element) {
          uniqueKeys.add(key);
        }
      });

      // looping to go inside the individual products
      for (let i = 0; i < data.length; i++) {
        // scrapping all the required details by going inside every individual products
        let details = await flipkartfetchIndividualDetails(data[i].productlink);
        for (let key in details) {
          uniqueKeys.add(key);
          data[i][key] = details[key];
        }

        if (details.sellerslink !== undefined) {
          const sellers = await flipkartsellerslist(details.sellerslink);
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

          // looping to scrap the different kinds of reviews such as "MOST_RECENT", "POSITIVE", "NEGATIVE"
          for (let key of typesOfRatings) {
            let urls = url1 + `${key}`;
            const totalReviewsandratings = await flipkartfetchReviews(
              urls,
              key
            );
            for (let key in totalReviewsandratings) {
              uniqueKeys.add(key);
              data[i][key] = totalReviewsandratings[key];
            }
          }
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
      for (let i = 0; i < data.length; i++) {
        uniqueKeys.forEach(function (value) {
          if (data[i][value] === undefined) {
            data[i][value] = "Not available";
          }
        });
      }
    }
    //converting into csv file
    // convertJSONtoCSV(listofproducts, "flipkartProductdetails");
    res.send(listofproducts);
  } catch (e) {
    res.send("Something went wrong on router");
  }
});

router.post("/amazondetails", async (req, res) => {
  try {
    // Storing the category to be scraped in Categories variable
    const Categories = req["body"];

    // Declaration of an array to store all the product details
    let listofproducts = [];

    // Running a loop to scrap each product
    for (let i = 0; i < Categories.length; i++) {
      //Creating the link to be scrapped
      let url = `https://www.amazon.in/s?k=${Categories[i].category}&page=0&crid=1EAMOLVYHA0EG&sprefix=suncream%2Caps%2C303&ref=sr_pg_0`;

      // Storing the number of data to be scraped in numData variable
      let numOfData = Categories[i].data;
      let arr = [],
        data = [];

      //Scrapping the data from the provided url from all the pages
      for (let i = 0; i < 100; i++) {
        //Changing the page number to scrap data from the next page
        url = url.replace(`page=${i}&crid`, `page=${i + 1}&crid`);
        url = url.replace(`sr_pg_${i}`, `sr_pg_${i + 1}`);

        //function to scrap the data from the main page
        const allProductDetails = await amazonfetchUrlDetails(url);

        //storing the coming data in arr
        arr = [...arr, ...allProductDetails];
        if (arr.length >= numOfData) {
          break;
        }
      }

      //arr contains the whole product but we need only required number of data so pushing the required number of data in data array
      for (let i = 0; i < Math.min(arr.length, numOfData); i++) {
        data = [...data, arr[i]];
      }

      // Declaration of set to take records of all the scrapped fields
      const uniqueKeys = new Set();
      data.forEach((element) => {
        for (const key in element) {
          uniqueKeys.add(key);
        }
      });

      // looping to go inside the individual products
      for (let i = 0; i < data.length; i++) {
        // scrapping all the required details by going inside every individual products
        let details = await amazonfetchIndividualDetails(data[i].productlink);
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

        // Checking whether reviews page is available on the site or not
        if (details.reviewsLink !== "https://amazon.inundefined") {
          const totalReviewsandratings = await amazonfetchReviews(
            details.reviewsLink
          );
          for (const key in totalReviewsandratings) {
            uniqueKeys.add(key);
            data[i][key] = totalReviewsandratings[key];
          }

          // looping to scrap the different kinds of reviews such as "MOST_RECENT", "POSITIVE", "NEGATIVE"
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
        }
        data[i]["Platform"] = "Amazon";

        // Number of reviews is in percentage so converting in the numbers
        for (let j = 1; j <= 5; j++) {
          data[i][`${j} star ratings`] = Math.floor(
            (Number(data[i][`${j} star ratings`]) *
              Number(data[i]["Ratings"])) /
              100
          );
          if (data[i][`${j} star ratings`] === NaN) {
            data[i][`${j} star ratings`] = "0";
          }
        }

        // Making a new array of product with required fields
        let obj = {};
        for (let k = 0; k < fields.length; k++) {
          if (fields[k] === "Quantity") {
            obj[fields[k]] = data[i]["Net Quantity"];
          } else {
            obj[fields[k]] = data[i][fields[k]];
          }
        }
        listofproducts.push(obj);
        console.log(i);
      }
      for (let i = 0; i < data.length; i++) {
        uniqueKeys.forEach(function (value) {
          if (data[i][value] === undefined) {
            data[i][value] = "Not available";
          }
        });
      }
    }
    res.send(listofproducts);
  } catch (e) {
    console.log("Something went wrong on router");
  }
});

module.exports = { router };
