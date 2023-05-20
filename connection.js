const mysql = require("mysql2");

const connection = mysql.createConnection({
  // host: "sql12.freesqldatabase.com",
  // user: "sql12600706",
  // password: "vixAVtHvyx",
  // port: 3306,
  // database: "sql12600706",
  host: "database-2.crvs0kcwplwy.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Ramlala.12",
  port: 3306,
  database: "demo",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
    // var sql =
    //   "CREATE TABLE PRODUCT_TABLE (imagelink VARCHAR(2000), productlink VARCHAR(2000), Position INTEGER, ProductName VARCHAR(500) PRIMARY KEY, Brand VARCHAR(255), price INTEGER, maxretailprice INTEGER, stars FLOAT, Num_Ratings INTEGER, Num_Reviews INTEGER, Mother_Category VARCHAR(255), Category VARCHAR(255),num_1_star_ratings INTEGER,num_2_star_ratings INTEGER,num_3_star_ratings INTEGER,num_4_star_ratings INTEGER,num_5_star_ratings INTEGER,Platform VARCHAR(255),Quantity VARCHAR(255), Num_sellers INTEGER, Description VARCHAR(5000), Num_Images INTEGER,Net_Rating_Score_NRS FLOAT, Discount INTEGER,Search_Term VARCHAR(255),Min_Price INTEGER, Max_Price INTEGER, St_dev_Price INTEGER, Title_Length INTEGER, Description_Length INTEGER, Date VARCHAR(255))";
    // var sql =
    //   "CREATE TABLE Reviews_TABLE (Title VARCHAR(1000), Summary VARCHAR(10000),Type VARCHAR(255), ProductName VARCHAR(500), FOREIGN KEY(ProductName) REFERENCES PRODUCT_TABLE(ProductName))";
    // connection.query(sql, function (err, result) {
    //   if (err) throw err;
    //   console.log("Table created");
    // });
  }
});

module.exports = connection;
