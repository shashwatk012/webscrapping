const { amazonfetchUrlDetails } = require("./amazonurlDetails");
const { amazonfetchReviews } = require("./amazonreviews");
const { amazonfetchIndividualDetails } = require("./amazondetails");
const { typesOfRatings, urlmaking, fields } = require("../text");
const amazon = async (Categories) => {
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
        for (const element of typesOfRatings) {
          const str =
            details.reviewsLink + `&pageNumber=1&filterByStar=${element}`;
          const data1 = await amazonfetchReviews(str);
          if (data1[0]) {
            data[i][`${element} reviews and ratings`] = data1[0];
          }
          if (data1[1]) {
            data[i][`${element}`] = data1[1];
          }
        }
      }
      data[i]["Platform"] = "Amazon";

      // Number of reviews is in percentage so converting in the numbers
      for (let j = 1; j <= 5; j++) {
        data[i][`${j} star ratings`] = Math.floor(
          (Number(data[i][`${j} star ratings`]) * Number(data[i]["Ratings"])) /
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
  }
  return listofproducts;
};

module.exports = { amazon };
