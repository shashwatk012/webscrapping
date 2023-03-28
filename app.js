const axios = require("axios");
const cheerio = require("cheerio");
const { fetchBeards } = require("./beardsList");
const { fetchReviews } = require("./reviews");
const { fetchLink } = require("./link");
const { convertJSONtoCSV } = require("./csv");

const data = async () => {
  try {
    let url =
      "https://www.amazon.in/s?k=beardo&page=1&crid=1GEOQD3CN5U5L&qid=1679935172&sprefix=beardo%2Caps%2C228&ref=sr_pg_1";
    let arr = [];
    for (let i = 0; i < 1; i++) {
      url = `https://www.amazon.in/s?k=beardo&page=${
        i + 1
      }&crid=1GEOQD3CN5U5L&qid=1679935172&sprefix=beardo%2Caps%2C228&ref=sr_pg_${
        i + 1
      }`;
      const result = await fetchBeards(url);
      arr = [...arr, ...result];
    }
    console.log(arr.length);
    const uniqueKeys = new Set();
    for (let i = 0; i < arr.length; i++) {
      let links = await fetchLink(arr[i].link);
      for (const key in links) {
        uniqueKeys.add(key);
        arr[i][key] = links[key];
      }

      //   //   // const arr1 = [
      //   //   //   "positive",
      //   //   //   "critical",
      //   //   //   "five_star",
      //   //   //   "four_star",
      //   //   //   "three_star",
      //   //   //   "two_star",
      //   //   //   "one_star",
      //   //   // ];
      //   //   // if (links.length !== 0) {
      //   //   //   const totalReviewsandratings = await fetchReviews(links[0]);
      //   //   //   arr[i][`total Reviews and Ratings`] = totalReviewsandratings[0];
      //   //   //   arr[i][`top10reviews`] = totalReviewsandratings[1];

      //   //   //   for (const element of arr1) {
      //   //   //     const str = links[0] + `&pageNumber=1&filterByStar=${element}`;
      //   //   //     const data = await fetchReviews(str);
      //   //   //     arr[i][`${element} reviews and ratings`] = data[0];
      //   //   //     arr[i][`top 10 ${element} reviews`] = data[1];
      //   //   //   }
      //   //   // }
      console.log(i);
    }
    for (let i = 0; i < arr.length; i++) {
      uniqueKeys.forEach(function (value) {
        if (arr[i][value] === undefined) {
          arr[i][value] = "Not available";
        }
      });
    }
    convertJSONtoCSV(arr);
  } catch (e) {
    console.log(e);
  }
};
setTimeout(data, 5000);
