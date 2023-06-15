const { amazonfetchReviews } = require("./amazonreviews");
const { amazonfetchIndividualDetails } = require("./amazondetails");
const { typesOfRatings, fields } = require("../../text");

const amazonbylink = async (url) => {
  try {
    let browser, page;
    console.log(url);
    let data = {
      productlink: url,
    };

    // scrapping all the required details by going inside the given url
    let details = await amazonfetchIndividualDetails(
      data.productlink,
      data.price,
      browser,
      page
    );
    for (const key in details) {
      data[key] = details[key];
    }

    // Checking whether reviews page is available on the site or not
    if (details.reviewsLink !== "https://amazon.inundefined") {
      const totalReviewsandratings = await amazonfetchReviews(
        details.reviewsLink,
        browser,
        page
      );
      for (const key in totalReviewsandratings) {
        data[key] = totalReviewsandratings[key];
      }

      // looping to scrap the different kinds of reviews such as "MOST_RECENT", "POSITIVE", "NEGATIVE"
      for (const element of typesOfRatings) {
        const str =
          details.reviewsLink + `&pageNumber=1&filterByStar=${element}`;
        const data1 = await amazonfetchReviews(str);
        console.log(element);
        if (data1.Reviews) {
          data[`${element} reviews and ratings`] = data1.Reviews;
        }
        if (data1.top10reviews) {
          data[`${element}`] = data1.top10reviews;
        }
      }
    }
    data["Platform"] = "Amazon";

    // Number of reviews is in percentage so converting in the numbers
    for (let k = 1; k <= 5; k++) {
      if (data[`${k} star ratings`]) {
        data[`${k} star ratings`] = Math.floor(
          (Number(data[`${k} star ratings`]) * Number(data["Ratings"])) / 100
        );
      } else {
        data[`${k} star ratings`] = 0;
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

    if (data.ProductName) {
      data["Title Length"] = data["ProductName"].length;
    }

    if (data["Description"]) {
      data["Description Length"] = data["Description"].length;
    }

    let date = new Date();

    data["Date"] = date.toLocaleDateString();

    let discount = (data.maxretailprice - data.price) / data.maxretailprice;
    data["Discount%"] = Math.floor(discount * 100);

    data["Quantity"] = data["Net Quantity"];

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

    // Making a new array of product with required fields
    let obj = {};
    for (let k = 0; k < fields.length; k++) {
      if (data[fields[k]]) {
        obj[fields[k]] = data[fields[k]];
      } else {
        obj[fields[k]] = "NA";
      }
    }

    return obj;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { amazonbylink };
