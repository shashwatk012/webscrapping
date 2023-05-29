// This file is to convert the json into csv file
const ObjectsToCsv = require("objects-to-csv");

// If you use "await", code must be inside an asynchronous function:
const convertJSONtoCSV = async (
  product_table,
  seller_table,
  reviews_table,
  res
) => {
  try {
    const csv = new ObjectsToCsv(product_table);
    const csv1 = new ObjectsToCsv(seller_table);
    const csv2 = new ObjectsToCsv(reviews_table);
    let date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    month++;
    // Save to file:

    // Converting product details into csv
    await csv.toDisk(
      `./csvfiles/product_table_dated${day}-${month}-${year}_${res}.csv`
    );

    // Converting sellers details into csv
    await csv1.toDisk(
      `./csvfiles/seller_table__dated${day}-${month}-${year}_${res}.csv`
    );

    // Converting Reviews details into csv
    await csv2.toDisk(
      `./csvfiles/reviews_table__dated${day}-${month}-${year}_${res}.csv`
    );
    console.log("File has been saved");
  } catch (e) {
    console.log(e);
  }
};

module.exports = { convertJSONtoCSV };
