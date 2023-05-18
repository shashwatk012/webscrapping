const ObjectsToCsv = require("objects-to-csv");

// If you use "await", code must be inside an asynchronous function:
const convertJSONtoCSV = async (product_table, seller_table, reviews_table) => {
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

    date = date.toLocaleString("en-IN", options);
    // Save to file:
    await csv.toDisk(`./csvfiles/product_table_dated(${date}).csv`);
    await csv1.toDisk(`./csvfiles/seller_table__dated(${date}).csv`);
    await csv2.toDisk(`./csvfiles/reviews_table__dated(${date}).csv`);
    console.log("File has been saved");
  } catch (e) {
    console.log(e);
  }
};

module.exports = { convertJSONtoCSV };
