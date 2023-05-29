"use strict";
const { fields } = require("../text");
const { nykaafetchIndividualDetails } = require("./nykaadetails");
const { nykaafetchUrlDetails } = require("./nykaaurldetails");

const urlmaking = (category) => {
  const url = `https://www.nykaa.com/search/result/?q=${category}&root=search&searchType=history&suggestionType=query&ssp=2&searchItem=${category}&sourcepage=home&`;
  return url;
};

const nykaa = async (Categories) => {
  try {
    console.log(Categories);
    // Declaration of an array to store all the product details
    let listofproducts = [];

    // Running a loop to scrap each product
    for (let i = 0; i < Categories.length; i++) {
      let browser, page;
      // Storing the number of data to be scraped in numData variable
      let numOfData = Categories[i].data;
      let category = Categories[i].category;
      //Creating the link to be scrapped
      let url = urlmaking(Categories[i].category);

      let arr = [];
      let data = [];
      let check = 0;

      //function to scrap the data from the main page
      const allProductDetails = await nykaafetchUrlDetails(url, browser, page);

      //storing the coming data in arr
      arr = [...arr, ...allProductDetails];
      allProductDetails.length = 0;
      console.log(arr.length);

      //arr contains the whole product but we need only required number of data so pushing the required number of data in data array
      for (let j = 0; j < Math.min(arr.length, numOfData); j++) {
        data[j] = arr[j];
      }

      // looping to go inside the individual products
      for (let j = 0; j < data.length; j++) {
        // scrapping all the required details by going inside every individual products
        let details = await nykaafetchIndividualDetails(
          data[j].productlink,
          browser,
          page
        );
        for (let key in details) {
          data[j][key] = details[key];
        }

        data[j]["Platform"] = "nykaa";

        data[j]["Title Length"] = data[j]["ProductName"].length;

        // data[j]["Description Length"] = data[j]["Description"].length;

        let date = new Date();
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
    // console.log(e);
    return [{ message: "Unable to fetch. Try again later" }];
  }
};

module.exports = { nykaa };
