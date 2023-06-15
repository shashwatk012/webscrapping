const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { replce } = require("../text");
const math = require("mathjs");

const amazonfetchIndividualDetails = async (url, browser, page) => {
  // function to scrap complete data about one product
  try {
    page = await browser.browser.newPage();
    await page.goto(url);

    let lastHeight = await page.evaluate("document.body.scrollHeight");

    while (true) {
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForTimeout(1000); // sleep a bit
      let newHeight = await page.evaluate("document.body.scrollHeight");
      if (newHeight === lastHeight) {
        break;
      }
      lastHeight = newHeight;
    }

    const html = await page.content();

    await page.close();
    // await browser.browser.close();

    // cheerio nodejs module to load html
    const $ = cheerio.load(html);

    // Declaration of object to store the product details
    let obj = {};

    // ProductName
    let ProductName = $("span#productTitle").text();

    // stars
    let star = $(
      "a.a-popover-trigger.a-declarative>span.a-size-base.a-color-base"
    ).text();

    // number of ratings
    let numratings = $("span#acrCustomerReviewText").text();

    // Link for the images
    let imagelink = $("div.imgTagWrapper>img").attr("src");
    if (!imagelink) {
      imagelink = $("div.imgTagWrapper>div#unrolledImgNo0>div>img").attr("src");
    }

    // price
    let price = $(
      "span.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay>span.a-offscreen"
    ).text();
    price = replce(price);

    if (!price) {
      price = $(
        "span.a-price.a-text-price.a-size-medium.apexPriceToPay>span.a-offscreen"
      ).text();
      price = replce(price);
    }

    // maxretailprice
    let maxretailprice = $(
      "div.a-section.a-spacing-small.aok-align-center>span>span>span>span.a-price.a-text-price>span.a-offscreen"
    ).text();
    maxretailprice = replce(maxretailprice);

    if (!maxretailprice) {
      maxretailprice = $(
        "td.a-span12.a-color-secondary.a-size-base>span.a-price.a-text-price.a-size-base>span.a-offscreen"
      ).text();
      maxretailprice = replce(maxretailprice);
    }

    if (ProductName) {
      obj["ProductName"] = ProductName.trim();
    }

    if (star) {
      let stararr = star.split(" ");
      obj["stars"] = Number(stararr[1]);
    }

    if (numratings) {
      numratings = numratings.replace(/\D/g, "");
      let size = numratings.length;
      const st = numratings.substring(0, size / 2);
      // const st1 = numratings.substring(size / 2, size);
      obj["Ratings"] = Number(st);
    }

    if (imagelink) {
      obj["imagelink"] = imagelink;
    }

    if (price) {
      obj["price"] = price;
    }

    if (maxretailprice) {
      obj["maxretailprice"] = maxretailprice;
    } else {
      obj["maxretailprice"] = price;
    }

    //Scraping the Best Sellers Rank in different Sub-Categories
    $(
      ".a-section.feature.detail-bullets-wrapper.bucket>ul.a-unordered-list.a-nostyle.a-vertical.a-spacing-none.detail-bullet-list"
    ).each(async (_idx, el) => {
      const x = $(el);
      if (_idx === 0) {
        let p = x.find("span.a-list-item").text();
        if (p) {
          p = p.trim();
        }
        let ranks,
          num = [];
        if (p) {
          ranks = p.replace("Best Sellers Rank:", "");
          ranks = ranks.trim();
          ranks = ranks.split(" ");
          ranks = ranks.filter((item) => {
            if (item !== " ") return item;
          });
          ranks = ranks.join(" ");
          ranks = ranks.replaceAll("#", " ");

          num = ranks.split("  ");
        }

        // console.log(num);
        let st = [],
          rank = [];
        for (let i = 0; i < num.length; i++) {
          let q = num[i].split(" ");
          let s = "";
          if (!st.length) {
            let idx = q.indexOf("(See");
            for (let j = 3; j < idx; j++) {
              s += q[j];
            }
            if (q && q.length > 1) {
              q[1] = replce(q[1]);
              rank.push(q[1]);
            }
          } else {
            for (let j = 2; j < q.length; j++) {
              s += q[j];
            }
            if (q && q.length > 0) {
              q[0] = replce(q[0]);
              rank.push(q[0]);
            }
          }
          if (i == num.length - 1) {
            obj["Position"] = q[0];
          }
          st.push(s);
        }
        console.log(st);

        // saving the scraped data in an object
        if (st.length > 1) {
          obj["Mother Category"] = st[0];
          obj["Category"] = st[1];
          obj["BSR in Mother Category"] = rank[0];
          obj["BSR in Category"] = rank[1];
          if (st.length > 2) {
            obj["Sub-Category"] = st[2];
            obj["Product"] = st[2];
          } else {
            obj["Product"] = st[1];
          }
        }
      }
    });

    // Number of images
    let count = 1;
    $("li.a-spacing-small.item.imageThumbnail.a-declarative").each(
      async (_idx, el) => {
        const x = $(el);
        count++;
      }
    );
    obj["Number of images"] = count;

    // Sellerdetails
    count = 1;
    let mn = price,
      mx = price,
      pricearr = [price],
      sellerdetails = [];
    $("div.a-box.mbc-offer-row.pa_mbc_on_amazon_offer").each(
      async (_idx, el) => {
        const x = $(el);
        let price = x.find(`span#mbc-price-${_idx + 1}`).text();
        let deliveryCharges = x.find(`span#mbc-delivery-${_idx + 1}`).text();
        let soldBy = x
          .find(`div#mbc-sold-by-${_idx + 1}>span.mbcMerchantName`)
          .text();

        price = replce(price);
        pricearr.push(price);

        mx = Math.max(mx, price);
        mn = Math.min(mn, price);

        // matching all numbers
        deliveryCharges = deliveryCharges.match(/[.0-9]+/);

        if (!deliveryCharges || !deliveryCharges.length) {
          deliveryCharges = [0];
        }

        sellerdetails.push({
          SoldBy: soldBy,
          Price: price,
          "Delivery charges": Number(deliveryCharges[0]),
        });
        count++;
      }
    );
    let stDev;
    if (pricearr.length) {
      stDev = math.std(pricearr);
    }
    obj["St-dev-Price"] = stDev;
    obj["Min Price"] = mn;
    obj["Max Price"] = mx;
    obj["NumberofSellers"] = count;
    obj["sellerDetails"] = sellerdetails;

    // Product description
    const description = $("div#productDescription>p").text();
    obj["Description"] = description;

    // Scraping the brand
    let brand = $("a#bylineInfo").text();
    let brandarr = [];
    console.log(brand);
    if (brand) {
      brandarr = brand.split(":");
      obj["Brand"] = brandarr[1];
    }

    // selecting the ratings element and the looping to get the different ratings percentage
    $("tr.a-histogram-row.a-align-center").each(async (_idx, el) => {
      const x = $(el);
      let key = x.find("td.aok-nowrap>span.a-size-base>a.a-link-normal").text();
      let value = x
        .find("td.a-text-right.a-nowrap>span.a-size-base>a.a-link-normal")
        .text();
      if (key) {
        key = key.trim();
      }
      if (value) {
        value = value.trim(); // triming to trim the spaces in the string
      }

      if (key !== "" && value !== "") {
        const result = value.replace(/\D/g, "");
        obj[`${key} ratings`] = result; // saving the scraped data in an object
      }
    });

    //scraping the pagelink for the reviews
    const reviewsLink = $("a.a-link-emphasis.a-text-bold").attr("href");
    obj["reviewsLink"] = `https://amazon.in${reviewsLink}`;

    // Scraping the package size
    const packageSize = $(
      "div.a-row.a-spacing-micro.singleton>span.selection"
    ).html();
    if (packageSize) {
      obj["packageSize"] = packageSize;
    } else {
      obj["packageSize"] = "Not available";
    }

    //selecting the product details element and the looping to get the complete product details
    $("tr.a-spacing-small").each(async (_idx, el) => {
      const x = $(el);
      const key = x.find("td.a-span3>span.a-size-base.a-text-bold").text();
      const value = x.find("td.a-span9>span.a-size-base.po-break-word").text();
      if (key && value) {
        obj[key] = value;
      }
    });

    //selecting the product details element and the looping to get the complete product details
    $(
      ".a-section.feature.detail-bullets-wrapper.bucket>div#detailBullets_feature_div>ul.a-unordered-list.a-nostyle.a-vertical.a-spacing-none.detail-bullet-list"
    )
      .children()
      .each(async (_idx, el) => {
        const x = $(el);
        let key = x.find("span.a-text-bold").text();
        for (let i = 0; i < key.length - 1; i++) {
          if (key[i] === " " && key[i + 1] === " ") {
            key = key.substring(0, i - 1);
            break;
          }
        }
        const value = x.find("span.a-list-item").children("span").last().text();
        if (key && value) {
          obj[key] = value;
        }
      });

    //selecting the product details element and the looping to get the complete product details in case of electronics
    $("table#productDetails_detailBullets_sections1>tbody>tr").each(
      async (_idx, el) => {
        const x = $(el);
        let key = x.find("th").text();
        for (let i = 0; i < key.length - 1; i++) {
          if (key[i] === " " && key[i + 1] === " ") {
            key = key.substring(0, i - 1);
            break;
          }
        }
        const value = x.find("td").text();
        if (key && value) {
          obj[key.trim()] = value.trim();
        }
      }
    );

    if (!obj["Mother Category"]) {
      let p = obj["Best Sellers Rank"];
      let ranks,
        num = [];
      if (p) {
        ranks = p.replace("Best Sellers Rank:", "");
        ranks = ranks.trim();
        ranks = ranks.split(" ");
        ranks = ranks.filter((item) => {
          if (item !== " ") return item;
        });
        ranks = ranks.join(" ");
        ranks = ranks.replaceAll("#", " ");

        num = ranks.split("  ");
      }

      let st = [],
        rank = [];
      for (let i = 0; i < num.length; i++) {
        let q = num[i].split(" ");
        let s = "";
        if (!st.length) {
          let idx = q.indexOf("(See");
          for (let j = 3; j < idx; j++) {
            s += q[j];
          }
          if (q && q.length > 1) {
            q[1] = replce(q[1]);
            rank.push(q[1]);
          }
        } else {
          for (let j = 2; j < q.length; j++) {
            s += q[j];
          }
          if (q && q.length > 0) {
            q[0] = replce(q[0]);
            rank.push(q[0]);
          }
        }
        if (i == num.length - 1) {
          obj["Position"] = Number(q[0]);
        }
        st.push(s);
      }
      console.log(st);

      // saving the scraped data in an object
      if (st.length > 1) {
        obj["Mother Category"] = st[0];
        obj["Category"] = st[1];
        obj["BSR in Mother Category"] = rank[0];
        obj["BSR in Category"] = rank[1];
        if (st.length > 2) {
          obj["Sub-Category"] = st[2];
          obj["Product"] = st[2];
        } else {
          obj["Product"] = st[1];
        }
      }
    }

    // sellerdetails

    return obj;
  } catch (error) {
    try {
      console.log(error);
      if (page) {
        await page.close();
      }
      // if (browser) {
      //   await browser.close();
      // }
      console.log("Some thing Went Wrong on details.js");
      return {};
    } catch (e) {
      console.log(e);
      console.log("Some thing Went Wrong on details1.js");
      return {};
    }
  }
};

module.exports = { amazonfetchIndividualDetails };
