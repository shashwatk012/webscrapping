"use strict";

const headers = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "X-User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 FKUA/website/42/website/Desktop",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    Referer: "https://www.flipkart.com/",
    Cookie:
      "T=TI165501360375301092230590487618855311549272530743987216924172853346; AMCVS_17EB401053DAF4840A490D4C%40AdobeOrg=1; s_sq=flipkart-prd%3D%2526pid%253Dwww.flipkart.com%25253Acoleman-sundome-4-person-camping-tent-palmetto-sleeping-bag-outdoor-camping-hiking-kit%25253Ap%25253Aitmceb47bf726cbc%2526pidt%253D1%2526oid%253Dhttps%25253A%25252F%25252Fwww.flipkart.com%25252Fsports%25252Fcamping-hiking%25252Fpr%25253Fsid%25253Dabc%25252Cfvf%252526marketplace%25253DFLIPKART%252526otracker%25253Dproduct_%2526ot%253DA; at=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNhNzdlZTgxLTRjNWYtNGU5Ni04ZmRlLWM3YWMyYjVlOTA1NSJ9.eyJleHAiOjE2ODQ3NzAwNzEsImlhdCI6MTY4NDc2ODI3MSwiaXNzIjoia2V2bGFyIiwianRpIjoiYWRmODA2NWMtMDczYy00NmQ1LTkxMmItMzRiM2E4MDc2OGYxIiwidHlwZSI6IkFUIiwiZElkIjoiVEkxNjU1MDEzNjAzNzUzMDEwOTIyMzA1OTA0ODc2MTg4NTUzMTE1NDkyNzI1MzA3NDM5ODcyMTY5MjQxNzI4NTMzNDYiLCJiSWQiOiJIWTlQVFAiLCJrZXZJZCI6IlZJMDVGMjNCRDZCRUE1NDgyMEE0MDA4QjgxNDFCQTc5QkEiLCJ0SWQiOiJtYXBpIiwiZWFJZCI6Ikg5SDNQdF9VY19vRThzN2ZTMzlpak9OZHdHNkZsZHgtR0E3bGctZGFjck5weXFualpWZWlUQT09IiwidnMiOiJMSSIsInoiOiJDSCIsIm0iOnRydWUsImdlbiI6NH0.ITuZN8TjY5gE5ZOY-wlPIEIRt6nW8YGW_fcR5DEVZgc; rt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjhlM2ZhMGE3LTJmZDMtNGNiMi05MWRjLTZlNTMxOGU1YTkxZiJ9.eyJleHAiOjE3MDA2NjU4NzEsImlhdCI6MTY4NDc2ODI3MSwiaXNzIjoia2V2bGFyIiwianRpIjoiNDE0ZDQ1YjgtZjQ4Mi00ZmM0LWJlYzktY2IzMGRhMThkNjU4IiwidHlwZSI6IlJUIiwiZElkIjoiVEkxNjU1MDEzNjAzNzUzMDEwOTIyMzA1OTA0ODc2MTg4NTUzMTE1NDkyNzI1MzA3NDM5ODcyMTY5MjQxNzI4NTMzNDYiLCJiSWQiOiJIWTlQVFAiLCJrZXZJZCI6IlZJMDVGMjNCRDZCRUE1NDgyMEE0MDA4QjgxNDFCQTc5QkEiLCJ0SWQiOiJtYXBpIiwibSI6eyJ0eXBlIjoibiJ9LCJ2IjoiN0RISDVZIn0.ZBoDiIhDsGQ5HiVdVBjQqTr-RvgDHvcDnZ3jIkyHcXw; S=d1t18P2o5Pz9xaTs/Pz8/Ez8/WN/kHzu4WwsT68TelU+MrcUtIt947/PS1ByL033Uxj/WsFnvWXwt9b+LjFjdwO9Vag==; K-ACTION=null; Network-Type=2g; SN=VI05F23BD6BEA54820A4008B8141BA79BA.TOKD815D4423AA34B48B8AFEAD6FCC8661A.1684768298.LI; AMCV_17EB401053DAF4840A490D4C%40AdobeOrg=-227196251%7CMCIDTS%7C19499%7CMCMID%7C28120188878141037630890531005542756672%7CMCAID%7CNONE%7CMCOPTOUT-1684775643s%7CNONE",
    Authorization: "Bearer your_token",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  },
};
const allProducts =
  "div._1YokD2._2GoDe3>div._1YokD2._3Mn1Gg>div._1AtVbE.col-12-12>div._13oc-S>div";
const imglink = "img._396cs4";

const typesOfRatings = ["POSITIVE_FIRST", "NEGATIVE_FIRST"];
const urlmaking = (category) => {
  const url = `https://www.flipkart.com/search?q=${category}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`;
  return url;
};

const fields = [
  "imagelink",
  "productlink",
  "Position",
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
  "NumberofSellers",
  "sellerDetails",
  "Description",
  "Number of images",
  "POSITIVE_FIRST",
  "NEGATIVE_FIRST",
  "Net Rating Score (NRS)",
  "Discount%",
  "Search Term",
  "Min Price",
  "Max Price",
  "St-dev-Price",
  "Title Length",
  "Description Length",
  "Date",
];

const replce = (str) => {
  while (str.includes(",")) {
    str = str.replace(",", "");
  }
  while (str.includes("₹")) {
    str = str.replace("₹", "");
  }
  return Number(str);
};

module.exports = {
  headers,
  allProducts,
  imglink,
  typesOfRatings,
  urlmaking,
  fields,
  replce,
};
