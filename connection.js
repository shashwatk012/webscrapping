// This files is to make a successful connection to the database

// Importing mysql module to connect to the database
const mysql = require("mysql2");

// Connecting to the database through host,user,password,port
const connection = mysql.createConnection({
  host: "database-2.crvs0kcwplwy.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Ramlala.12",
  port: 3306,
  database: "Publiq",
});

// Promise to tell us whether the connection is successful or not
connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});

module.exports = connection;

// var sql =
//   "CREATE TABLE FLIPKART_PRODUCT_TABLE (imagelink VARCHAR(2000),Productlink VARCHAR(2000), Position INTEGER,Product VARCHAR(500), ProductName VARCHAR(500), Brand VARCHAR(255), Price INTEGER,Price_per_unit FLOAT, maxretailprice INTEGER, stars FLOAT, Num_Ratings INTEGER, Num_Reviews INTEGER, Mother_Category VARCHAR(255), Category VARCHAR(255),Sub_Category VARCHAR(500),num_1_star_ratings INTEGER,num_2_star_ratings INTEGER,num_3_star_ratings INTEGER,num_4_star_ratings INTEGER,num_5_star_ratings INTEGER,Platform VARCHAR(255),Quantity INTEGER,Quantity_unit VARCHAR(10), Num_sellers INTEGER, Description VARCHAR(5000), Num_Images INTEGER,Is_Ads VARCHAR(10),Net_Rating_Score_NRS FLOAT, Discount INTEGER,Search_Term VARCHAR(255),Min_Price INTEGER, Max_Price INTEGER, St_dev_Price FLOAT, Title_Length INTEGER, Description_Length INTEGER, Date VARCHAR(255))";
// var sql1 =
//   "CREATE TABLE FLIPKART_REVIEWS_TABLE (Title VARCHAR(1000), Summary VARCHAR(10000),Type VARCHAR(255), ProductName VARCHAR(500), Date VARCHAR(255))";
// var sql2 =
//   "CREATE TABLE FLIPKART_SELLERS_TABLE (SellersName VARCHAR(1000), Price INTEGER,Ratings FLOAT,Flipkart_Assured INTEGER, ProductName VARCHAR(500), Date VARCHAR(255))";
// connection.query(sql, function (err, result) {
//   if (err) throw err;
//   console.log("Table created");
// });
// connection.query(sql1, function (err, result) {
//   if (err) throw err;
//   console.log("Table created");
// });
// connection.query(sql2, function (err, result) {
//   if (err) throw err;
//   console.log("Table created");
// });
