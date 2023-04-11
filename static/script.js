const wait = () => {
  const p = document.querySelector(".hidden");
  const link = document.getElementById("links").value;
  const category = document.getElementById("category").value;
  const data = document.getElementById("daTa").value;
  if ((link !== "" || category !== "select") && data !== "") {
    p.innerHTML = `<h4>Please wait...it may take few minutes</h4>`;
  }
};

const select = (platform) => {
  console.log(platform + "ygyjh");
  if (platform === "Amazon") {
    location.href = "/amazon";
  } else {
    location.href = "/flipkart";
  }
};

let html = "";

const Category = {
  Mobiles: ["Select", "mi", "samsung", "apple", "motorola"],
  Laptops: ["Select", "Gaming Laptops", "hp", "dell", "lenovo"],
  "Mobile Accessories": [
    "Select",
    "Mobile cases",
    "Headphones & Headsets",
    "Power Bank",
  ],
  Television: ["Select", "Lg", "Panasonic", "Sony"],
  Footwear: ["Select", "Sports Shoes", "casual Shoes", "Formal Shoes"],
  "Baby Care": [
    "Select",
    "Remote Control Toys",
    "Educational Toys",
    "Soft Toys",
  ],
  "Men Clothing": ["Select", "T-shirts", "Formal Shirts", "Jeans"],
  "Washing Machine": [
    "Select",
    "Fully automatic front load",
    "Semi automatic Top Load",
  ],
  "Men's grooming": [
    "Select",
    "Deodorants",
    "Perfumes",
    "Shaving & Aftershave",
    "Beard Care & Grooming",
    "Sexual Wellness",
  ],
};
const change = () => {
  html = "";
  const category = document.getElementById("category").value;
  if (category === "Enter your own category or sub-category") {
    html += `
        <label for="Enter">Enter your own category or sub-category:</label>
        <input type="text" id="Enter" name="SubCategory" />`;
  } else {
    Category[category].forEach((element) => {
      html += `
        <option value="${element}">${element}</option>`;
    });
    html =
      `<label for="SubCategory">Choose a Sub-Category:</label>
    <select name="SubCategory" id="SubCategory">` +
      html +
      `</select>;`;
  }

  document.getElementById("select").innerHTML = html;
};

// let arr = [
//   "ProductName",
//   "imagelink",
//   "productlink",
//   "price",
//   "maxretailprice",
//   "stars",
//   "GlobalRatings",
//   "globalReviews",
//   "Highlights",
//   "Pack Of",
//   "Brand",
//   "Model Name",
//   "Type",
//   "Ideal For",
//   "Quantity",
//   "Maximum Shelf Life",
//   "5 star ratings",
//   "4 star ratings",
//   "3 star ratings",
//   "2 star ratings",
//   "1 star ratings",
// ];
// for (let i = 0; i < arr.length; i++) {
//   html += `<div class="div"><input type="checkbox" id=${arr[i]} name=${arr[i]} value=${arr[i]}>
//   <label for=${arr[i]}>${arr[i]}</label></div>`;
// }
// document.getElementById("bigger").innerHTML = html;
