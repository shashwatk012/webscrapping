const fs = require("fs");

const ObjectsToCsv = require("objects-to-csv");

// If you use "await", code must be inside an asynchronous function:
const convertJSONtoCSV = async (arr) => {
  try {
    const csv = new ObjectsToCsv(arr);

    // Save to file:
    await csv.toDisk("./saved-beardo.csv");
    console.log("File has been saved");
  } catch (e) {
    console.log(e);
  }
  // let csvContent = arr
  //   .map((element) => {
  //     return Object.values(element)
  //       .map((item) => `"${item}"`)
  //       .join(",");
  //   })
  //   .join("\n");

  // fs.writeFile(
  //   "saved-beardo.csv",
  //   "Title, Image, Link, Price,Maxretailprice, Reviews, Stars, Total Reviews and  Ratings, Positive Reviews and ratings, Negative Reviews and Ratings, 5star Reviews and Ratings, 4star Reviews and ratings, 3starReviews and Ratings, 2starReviews and Ratings, 1starReviews and ratings" +
  //     "\n" +
  //     csvContent,
  //   "utf8",
  //   function (err) {
  //     if (err) {
  //       console.log(
  //         "Some error occurred - file either not saved or corrupted."
  //       );
  //     } else {
  //       console.log("File has been saved!");
  //     }
  //   }
  // );
};

module.exports = { convertJSONtoCSV };
