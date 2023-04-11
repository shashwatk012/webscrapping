const ObjectsToCsv = require("objects-to-csv");

// If you use "await", code must be inside an asynchronous function:
const convertJSONtoCSV = async (arr, category) => {
  try {
    const csv = new ObjectsToCsv(arr);

    // Save to file:
    await csv.toDisk(`./csvfiles/${category}.csv`);
    console.log("File has been saved");
  } catch (e) {
    console.log(e);
  }
};

module.exports = { convertJSONtoCSV };
