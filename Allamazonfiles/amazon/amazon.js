const puppeteer = require("puppeteer");
const { amazonfetchUrlDetails } = require("./amazonurlDetails");
const { amazonfetchReviews } = require("./amazonreviews");
const { amazonfetchIndividualDetails } = require("./amazondetails");
const { typesOfRatings, fields, save } = require("../text");

const amazon = async (Categories) => {
  try {
    console.log(Categories);
    // Declaration of an array to store all the product details
    let listofproducts = [];

    // Running a loop to scrap each product
    for (let i = 0; i < Categories.length; i++) {
      listofproducts = [];
      let page;
      let browser = await puppeteer.launch({
        headless: false, // indicates that we want the browser visible
        defaultViewport: false, // indicates not to use the default viewport size but to adjust to the user's screen resolution instead
        userDataDir: "./tmp", // caches previous actions for the website. Useful for remembering if we've had to solve captchas in the past so we don't have to resolve them
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        // devtools: true,
      });
      //Creating the link to be scrapped
      let url = `https://www.amazon.in/s?k=${Categories[i].category}&page=0&crid=1EAMOLVYHA0EG&sprefix=suncream%2Caps%2C303&ref=sr_pg_0`;

      // Storing the number of data to be scraped in numData variable
      let numOfData = Categories[i].data;
      let category = Categories[i].category;
      let arr = [],
        data = [];

      //Scrapping the data from the provided url from all the pages
      for (let j = 0; j < 10; j++) {
        //Changing the page number to scrap data from the next page
        url = url.replace(`page=${j}&crid`, `page=${j + 1}&crid`);
        url = url.replace(`sr_pg_${j}`, `sr_pg_${j + 1}`);

        //function to scrap the data from the main page
        const allProductDetails = await amazonfetchUrlDetails(
          url,
          { browser },
          page
        );

        //storing the coming data in arr
        if (allProductDetails && allProductDetails.length) {
          arr = [...arr, ...allProductDetails];
        }
        console.log(arr.length);

        if (arr.length >= numOfData) {
          break;
        }
      }

      //arr contains the whole product but we need only required number of data so pushing the required number of data in data array
      for (let j = 0; j < Math.min(arr.length, numOfData); j++) {
        data = [...data, arr[j]];
      }

      // looping to go inside the individual products
      for (let j = 0; j < data.length; j++) {
        // scrapping all the required details by going inside every individual products
        let details = await amazonfetchIndividualDetails(
          data[j].productlink,
          { browser },
          page
        );
        for (const key in details) {
          data[j][key] = details[key];
        }

        // Checking whether reviews page is available on the site or not
        if (details.reviewsLink !== "https://amazon.inundefined") {
          const totalReviewsandratings = await amazonfetchReviews(
            details.reviewsLink,
            { browser },
            page
          );
          for (const key in totalReviewsandratings) {
            data[j][key] = totalReviewsandratings[key];
          }

          //   // looping to scrap the different kinds of reviews such as "MOST_RECENT", "POSITIVE", "NEGATIVE"
          //   for (const element of typesOfRatings) {
          //     const str =
          //       details.reviewsLink + `&pageNumber=1&filterByStar=${element}`;
          //     const data1 = await amazonfetchReviews(str);
          //     if (data1[0]) {
          //       data[j][`${element} reviews and ratings`] = data1[0];
          //     }
          //     if (data1[1]) {
          //       data[j][`${element}`] = data1[1];
          //     }
          //   }
        }
        data[j]["Platform"] = "Amazon";

        // Number of reviews is in percentage so converting in the numbers
        for (let k = 1; k <= 5; k++) {
          if (data[j][`${k} star ratings`]) {
            data[j][`${k} star ratings`] = Math.floor(
              (Number(data[j][`${k} star ratings`]) *
                Number(data[j]["Ratings"])) /
                100
            );
          } else {
            data[j][`${k} star ratings`] = 0;
          }
        }

        let NetRatingRank =
          (data[j]["5 star ratings"] +
            data[j]["4 star ratings"] -
            (data[j]["2 star ratings"] + data[j]["1 star ratings"])) /
          (data[j]["5 star ratings"] +
            data[j]["4 star ratings"] +
            data[j]["3 star ratings"] +
            (data[j]["2 star ratings"] + data[j]["1 star ratings"]));

        data[j]["Net Rating Score (NRS)"] = NetRatingRank * 100;

        if (data[j].ProductName) {
          data[j]["Title Length"] = data[j]["ProductName"].length;
        }

        if (data[j]["Description"]) {
          data[j]["Description Length"] = data[j]["Description"].length;
        }

        let date = new Date();

        data[j]["Date"] = date.toLocaleDateString();

        data[j]["Search Term"] = category;
        console.log(category);

        data[j]["Position"] = j + 1;

        let discount =
          (data[j].maxretailprice - data[j].price) / data[j].maxretailprice;
        data[j]["Discount%"] = Math.floor(discount * 100);

        data[j]["Quantity"] = data[j]["Net Quantity"];

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

        // Making a new array of product with required fields
        let obj = {};
        for (let k = 0; k < fields.length; k++) {
          if (data[j][fields[k]]) {
            obj[fields[k]] = data[j][fields[k]];
          } else {
            obj[fields[k]] = null;
          }
        }
        delete obj["sellerDetails"];
        delete obj["POSITIVE_FIRST"];
        delete obj["NEGATIVE_FIRST"];

        console.log(await save(obj));
        listofproducts.push(obj);
        console.log(j);
      }
      await browser.close();
    }
    return listofproducts;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { amazon };
