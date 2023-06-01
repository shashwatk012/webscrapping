"use strict";
// Importing all the required modules
const { flipkartfetchUrlDetails } = require("./flipkarturlDetails");
const { flipkartfetchReviews } = require("./flipkartreviews");
const { flipkartfetchIndividualDetails } = require("./flipkartdetails");
const { flipkartsellerslist } = require("./flipkartsellerslist");
const { typesOfRatings, fields, urlmaking } = require("../text");
// Module to convert JSON into CSV
const { convertJSONtoCSV } = require("../csv");

// Establishing the connection to database
const connection = require("../connection");

// Saving the data to the database
let sql = async (listofproducts) => {
  let listofsellers = [],
    listofreviews = [];

  //Separating the sellersdetails from productDetails
  if (listofproducts.sellerDetails && listofproducts.sellerDetails.length > 0) {
    listofsellers = listofproducts.sellerDetails;
  }
  delete listofproducts.sellerDetails;

  //Separating the Reviews from productDetails
  if (
    listofproducts["POSITIVE_FIRST"] &&
    listofproducts["POSITIVE_FIRST"].length > 0
  ) {
    listofreviews = [...listofreviews, ...listofproducts["POSITIVE_FIRST"]];
  }
  if (
    listofproducts["NEGATIVE_FIRST"] &&
    listofproducts["NEGATIVE_FIRST"].length > 0
  ) {
    listofreviews = [...listofreviews, ...listofproducts["NEGATIVE_FIRST"]];
  }

  delete listofproducts["POSITIVE_FIRST"];
  delete listofproducts["NEGATIVE_FIRST"];

  // // Converting the JSON into csv file
  // convertJSONtoCSV(listofproducts, listofsellers, listofreviews, num);

  // Inserting the data into database
  let Product =
    "INSERT INTO FLIPKART_PRODUCT_TABLE (imagelink,Productlink, Position,Product, ProductName , Brand , Price ,Price_per_unit, maxretailprice , stars, Num_Ratings , Num_Reviews , Mother_Category , Category ,Sub_Category,num_1_star_ratings ,num_2_star_ratings ,num_3_star_ratings ,num_4_star_ratings ,num_5_star_ratings ,Platform,Quantity ,Quantity_unit, Num_sellers , Description, Num_Images ,Is_Ads,Net_Rating_Score_NRS, Discount ,Search_Term ,Min_Price , Max_Price , St_dev_Price, Title_Length , Description_Length , Date) VALUES ?";

  let Seller =
    "INSERT INTO FLIPKART_SELLERS_TABLE (SellersName , Price,Ratings,Flipkart_Assured , ProductName , Date ) VALUES ?";

  let Reviews =
    "INSERT INTO FLIPKART_REVIEWS_TABLE (Title,Summary,Type,ProductName,Date) VALUES ?";

  let values = [],
    values1 = [],
    values2 = [];
  //Make an array of values:
  let keys = [];

  for (let value in listofproducts) {
    keys.push(listofproducts[value]);
  }
  values.push(keys);

  for (let i = 0; i < listofsellers.length; i++) {
    let keys1 = [];

    for (let value in listofsellers[i]) {
      keys1.push(listofsellers[i][value]);
    }
    values1.push(keys1);
  }
  for (let i = 0; i < listofreviews.length; i++) {
    let keys1 = [];

    for (let value in listofreviews[i]) {
      keys1.push(listofreviews[i][value]);
    }
    values2.push(keys1);
  }
  //Execute the SQL statement, with the value array:
  if (values.length > 0) {
    connection.query(Product, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of reco rds inserted: " + result.affectedRows);
    });
  }
  if (values1.length > 0) {
    connection.query(Seller, [values1], function (err, result) {
      if (err) throw err;
      console.log("Number of reco rds inserted: " + result.affectedRows);
    });
  }
  if (values2.length > 0) {
    connection.query(Reviews, [values2], function (err, result) {
      if (err) throw err;
      console.log("Number of reco rds inserted: " + result.affectedRows);
    });
  }

  // connection.query(
  //   "SELECT * FROM PRODUCT_TABLE",
  //   function (err, result, fields) {
  //     if (err) throw err;
  //     console.log(result);
  //   }
  // );
};

const flipkart = async (Categories) => {
  try {
    console.log(Categories);
    if (!Categories.length) {
      Categories = [Categories];
    }
    // Declaration of an array to store all the product details
    let listofproducts = [],
      listofsellers = [],
      listofreviews = [];

    // Running a loop to scrap each product
    for (let i = 0; i < Categories.length; i++) {
      // Storing the number of data to be scraped in numData variable
      let numOfData = Categories[i].data;
      let category = Categories[i].category;

      //Creating the link to be scrapped
      let url = urlmaking(Categories[i].category);

      let arr = [];
      let data = [];
      let check = 0;
      for (let i = 0; i < 100; i++) {
        //Scrapping the data from the provided url from all the pages
        let urls = url;

        //Changing the page number to scrap data from the next page
        urls += `&page=${i + 1}`;

        //function to scrap the data from the main page
        const allProductDetails = await flipkartfetchUrlDetails(urls);

        if (check < 3 && allProductDetails.length === 0) {
          i--;
          check++;
        } else if (allProductDetails.length === 0) {
          break;
        }
        //storing the coming data in arr
        arr = [...arr, ...allProductDetails];
        allProductDetails.length = 0;
        if (arr.length >= numOfData) {
          break;
        }
      }
      console.log(arr.length);

      //arr contains the whole product but we need only required number of data so pushing the required number of data in data array
      for (let j = 0; j < Math.min(arr.length, numOfData); j++) {
        data[j] = arr[j];
      }

      // looping to go inside the individual products
      for (let j = 0; j < data.length; j++) {
        let browser, page;
        // scrapping all the required details by going inside every individual products
        let details = await flipkartfetchIndividualDetails(
          data[j].productlink,
          browser,
          page
        );
        for (let key in details) {
          data[j][key] = details[key];
        }

        // Scrapping the sellers details
        if (details.sellerslink !== undefined) {
          const sellers = await flipkartsellerslist(
            details.sellerslink,
            browser,
            page,
            data[j]["ProductName"]
          );
          if (sellers.message === "Can not fetch") {
            continue;
          }
          data[j]["NumberofSellers"] = sellers.NumberofSellers;
          data[j]["sellerDetails"] = sellers.sellersDetails;
          data[j]["Max Price"] = sellers["Max Price"];
          data[j]["Min Price"] = sellers["Min Price"];
          data[j]["St-dev-Price"] = sellers["St-dev-Price"];
        }

        data[j]["Platform"] = "Flipkart";

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
              page,
              data[j]["ProductName"]
            );
            for (let key in totalReviewsandratings) {
              data[j][key] = totalReviewsandratings[key];
            }
            urls = null;
          }
          url1 = null;

          let NetRatingRank =
            (data[j]["5 star ratings"] +
              data[j]["4 star ratings"] -
              (data[j]["2 star ratings"] + data[j]["1 star ratings"])) /
            (data[j]["5 star ratings"] +
              data[j]["4 star ratings"] +
              data[j]["3 star ratings"] +
              (data[j]["2 star ratings"] + data[j]["1 star ratings"]));

          data[j]["Net Rating Score (NRS)"] = NetRatingRank * 100;
        }

        data[j]["Title Length"] = data[j]["ProductName"].length;

        data[j]["Description Length"] = data[j]["Description"].length;

        let date = new Date();

        data[j]["Date"] = date.toLocaleDateString();

        data[j]["Search Term"] = category;
        console.log(category);

        data[j]["Position"] = j + 1;

        // Separating the amount and unit from the quantity (i.e.,100ml->100 and ml)
        if (data[j].Quantity) {
          const quantity = data[j].Quantity;
          const ar = quantity.split(" ");
          data[j].Quantity = Number(ar[0]);
          data[j]["Quantity unit"] = ar[1];
          data[j]["Price per unit"] = data[j].price / data[j].Quantity;
        } else {
          data[j].Quantity = 1;
          data[j]["Price per unit"] = data[j].price / data[j].Quantity;
          data[j]["Quantity unit"] = "NA";
        }

        // Making a new array of product with required fields and in required order
        let obj = {};
        for (let k = 0; k < fields.length; k++) {
          if (data[j][fields[k]]) {
            obj[fields[k]] = data[j][fields[k]];
          } else {
            obj[fields[k]] = null;
          }
        }
        // await sql(obj);
        if (obj.sellerDetails) {
          listofsellers = [...listofsellers, ...obj.sellerDetails];
        }
        if (obj["POSITIVE_FIRST"]) {
          listofreviews = [...listofreviews, ...obj["POSITIVE_FIRST"]];
        }
        if (obj["NEGATIVE_FIRST"]) {
          listofreviews = [...listofreviews, ...obj["NEGATIVE_FIRST"]];
        }

        delete obj.sellerDetails;
        delete obj["POSITIVE_FIRST"];
        delete obj["NEGATIVE_FIRST"];

        listofproducts.push(obj);
        //converting into csv file
        convertJSONtoCSV(listofproducts, listofsellers, listofreviews, 1);
        console.log(j);
      }
      numOfData = null;
      url = null;
      arr.length = 0;
      data.length = 0;
    }
    return listofproducts;
  } catch (e) {
    console.log(e);
    return [{ message: "Unable to fetch. Try again later" }];
  }
};

module.exports = { flipkart };
