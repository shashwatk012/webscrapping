// Importing the file to scrap the given products positive and negative reviews from flipkart
const { flipkartfetchReviews } = require("./flipkartreviews");

// Importing the file to scrap the given complete products details from flipkart
const { flipkartfetchIndividualDetails } = require("./flipkartdetails");

// Importing the file to scrap the given products sellers details from flipkart
const { flipkartsellerslist } = require("./flipkartsellerslist");

// Importing text.js file to use the reusable codes
const { typesOfRatings, fields } = require("../text");

const { flipkartPosition } = require("./flipkartposition");

const flipkartbylink = async (url) => {
  try {
    let browser, page;
    let flag = true;

    // Creating an object which is going to be the response of the coming request
    const data = {
      productlink: url,
    };

    // scrapping all the required details by going inside every individual products
    let details = await flipkartfetchIndividualDetails(url, browser, page);
    if (details.message === "Can not fetch") {
      flag = false;
    }

    // Inserting all the data into data object
    for (let key in details) {
      data[key] = details[key];
    }

    if (details.mainPagelink) {
      let res = 0;
      for (let i = 0; i < 5; i++) {
        //Scrapping the data from the provided url from all the pages
        let urls = details.mainPagelink;

        //Changing the page number to scrap data from the next page
        urls += `&page=${i + 1}`;

        //function to scrap the data from the main page
        const pos = await flipkartPosition(
          urls,
          browser,
          page,
          details.ProductName
        );
        if (pos.Position) {
          data.Position = res + pos.Position;
          break;
        }
        res += pos.totalproducts;
      }
      if (!data.Position) {
        data.Position = "100+";
      }
    }

    // Checking whether sellers details are present on the page or not
    if (details.sellerslink !== undefined) {
      const sellers = await flipkartsellerslist(
        details.sellerslink,
        browser,
        page,
        data["ProductName"]
      );
      data["NumberofSellers"] = sellers.NumberofSellers;
      data["sellerDetails"] = sellers.sellersDetails;
      data["Max Price"] = sellers["Max Price"];
      data["Min Price"] = sellers["Min Price"];
      data["St-dev-Price"] = sellers["St-dev-Price"];
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
          page,
          data["ProductName"]
        );
        for (let key in totalReviewsandratings) {
          data[key] = totalReviewsandratings[key];
        }
      }
      let NetRatingRank =
        (data["5 star ratings"] +
          data["4 star ratings"] -
          (data["2 star ratings"] + data["1 star ratings"])) /
        (data["5 star ratings"] +
          data["4 star ratings"] +
          data["3 star ratings"] +
          (data["2 star ratings"] + data["1 star ratings"]));

      data["Net Rating Score (NRS)"] = NetRatingRank * 100;
    }
    data["Title Length"] = data["ProductName"].length;

    data["Description Length"] = data["Description"].length;

    let date = new Date();

    data["Date"] = date.toLocaleDateString();

    // Separating the amount and unit from the quantity (i.e.,100ml->100 and ml)
    if (data.Quantity) {
      const quantity = data.Quantity;
      const ar = quantity.split(" ");
      data.Quantity = Number(ar[0]);
      data["Quantity unit"] = ar[1];
      data["Price per unit"] = data.price / data.Quantity;
    } else {
      data.Quantity = 1;
      data["Price per unit"] = data.price / data.Quantity;
      data["Quantity unit"] = "NA";
    }

    // Making a new array of product details with required fields and in required order
    let obj = {};
    for (let k = 0; k < fields.length; k++) {
      if (data[fields[k]]) {
        obj[fields[k]] = data[fields[k]];
      } else {
        obj[fields[k]] = "NA";
      }
    }

    if (!flag) {
      return "Something went wrong! Try again";
    } else {
      return obj;
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = { flipkartbylink };
