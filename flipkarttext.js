const headers = {
  headers: {
    authority: "www.amazon.com",
    pragma: "no-cache",
    "cache-control": "no-cache",
    dnt: "1",
    "upgrade-insecure-requests": "1",
    "user-agent":
      "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36",
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "sec-fetch-site": "none",
    "sec-fetch-mode": "navigate",
    "sec-fetch-dest": "document",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
  },
};
const allProducts =
  "div._1YokD2._2GoDe3>div._1YokD2._3Mn1Gg>div._1AtVbE.col-12-12>div._13oc-S>div";
const imglink = "img._396cs4";

const typesOfRatings = [
  "MOST_RECENT",
  "MOST_HELPFUL",
  "POSITIVE_FIRST",
  "NEGATIVE_FIRST",
];
const urlmaking = (category) => {
  const url = `https://www.flipkart.com/search?q=${category}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`;
  return url;
};
const apikey =
  "7C8IRHI1B3TTAEEIW3EBXXX698NT9DUT8F0MRVPHM43O5C0LMJXHUCLAOB9W4M2Z2FBHHRLDCF1Q8YN3";

const fields = [
  "imagelink",
  "productlink",
  "ProductName",
  "Brand",
  "price",
  "maxretailprice",
  "stars",
  "Ratings",
  "Reviews",
  "Mother Category",
  "Category",
  "5 star ratings",
  "4 star ratings",
  "3 star ratings",
  "2 star ratings",
  "1 star ratings",
  "Platform",
  "Quantity",
  "SellersNumbers",
];

module.exports = {
  headers,
  allProducts,
  imglink,
  typesOfRatings,
  urlmaking,
  apikey,
  fields,
};
