const cheerio = require("cheerio");
const amazontext = require("./amazontext");
const scrapingbee = require("scrapingbee");
const request = require("request-promise");
const axios = require("axios");
const http = require("http");
const https = require("https");

const amazonfetchUrlDetails = async (url, num_proxies) => {
  try {
    const headers = {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9,la;q=0.8",
      "Sec-Ch-Ua":
        '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "cross-site",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
      "X-Amzn-Trace-Id": "Root=1-646baec9-23c65be55fbb54967e9160ef",
    };

    proxies_list = [
      "20.44.206.138:80",
      "185.211.57.74:4002",
      "211.138.6.37:9091",
      "168.187.72.71:80",
      "111.40.116.212:9091",
      "120.82.174.128:9091",
      "168.187.72.71:8080",
      "35.240.219.50:8080",
      "183.237.47.54:9091",
      "167.71.5.83:8080",
      "218.57.210.186:9002",
      "161.35.70.249:8080",
      "41.76.145.136:3128",
      "202.86.138.18:8080",
      "117.160.250.131:80",
      "112.19.214.109:9002",
      "183.230.162.122:9091",
      "112.35.204.111:80",
      "66.85.129.220:8080",
      "185.211.133.36:80",
      "185.211.133.108:80",
      "168.138.55.196:80",
      "109.238.208.138:21231",
      "92.63.168.248:80",
      "116.198.48.6:8080",
      "139.144.24.46:8080",
      "203.89.126.250:80",
      "110.185.164.20:9091",
      "185.211.133.110:80",
      "42.248.122.147:1080",
      "47.100.201.85:80",
      "60.12.168.114:9002",
      "103.77.60.14:80",
      "103.3.246.215:3128",
      "158.69.212.254:80",
      "117.160.250.132:8899",
      "124.131.219.94:9091",
      "112.16.127.69:9002",
      "185.211.57.74:4040",
      "117.160.250.134:80",
      "120.234.203.171:9002",
      "58.20.184.187:9091",
      "51.15.242.202:8888",
      "45.71.36.67:3128",
      "223.210.2.228:9091",
      "203.19.38.114:1080",
      "61.53.66.116:9091",
    ];

    const random = Math.floor(Math.random() * 46);
    num_proxies.num_proxies[random]++;
    const [host, port] = proxies_list[random].split(":");
    console.log(host, port);

    const targetUrl = url;

    const agent = new http.Agent({
      host: host,
      port: port,
      path: "/",
      rejectUnauthorized: false, // Set to false if the proxy server has a self-signed SSL certificate
    });

    headers.httpAgent = agent;

    const response = await axios.get(targetUrl, headers);
    const html = response.data;
    // console.log(html);
    // const agentOptions = {
    //   host: "67.205.162.65",
    //   port: "3128",
    //   path: "/",
    //   rejectUnauthorized: false,
    // };

    // const agent = new https.Agent(agentOptions);
    // const html = await request({
    //   url,
    //   method: "GET",
    //   agent,
    // });
    // const proxyHost = "67.205.162.65";
    // const proxyPort = "3128";

    // const proxyOptions = {
    //   proxy: `https://${proxyHost}:${proxyPort}`,
    //   // strictSSL: false, // Only if the proxy uses a self-signed SSL certificate
    // };
    // const targetUrl = url;

    // const html = await request.get(targetUrl, { proxy: proxyOptions });
    // console.log(html);
    // var client = new scrapingbee.ScrapingBeeClient(
    //   "I1VKMCIP31YMI7PKCT2R2WXO6D3UY5OW59GPK6IKOWYKAXIHLA585HLENJ0CZ51SFMTTYIGRAW7ONVZG"
    // );
    // var response = await client.get({
    //   url: url,
    //   params: {
    //     // premium_proxy: "True",
    //     block_ads: "True",
    //     block_resources: "True",
    //   },
    // });

    // var decoder = new TextDecoder();
    // var html = decoder.decode(response.data);
    // page = await browser.browser.newPage();

    // await page.authenticate();
    // await page.goto("http://httpbin.org/ip");

    // await page.waitForTimeout(1000);

    // let html = await page.content();
    // console.log(html);
    // await page.screenshot({
    //   path: "screenshot.jpg",
    // });

    // let $ = cheerio.load(html);

    // let captchalink = $("div.a-row.a-text-center>img").attr("src");

    // let captcha = undefined;

    // if (captchalink) {
    //   console.log(captchalink);

    //   const readline = require("readline").createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    //   });

    //   readline.question("Type the captcha", (name) => {
    //     console.log(`Captcha is ${name}!`);
    //     captcha = name;
    //     readline.close();
    //   });

    //   await page.waitForTimeout(20000);

    //   await page.type("input#captchacharacters", captcha);

    //   await page.click(
    //     "span.a-button.a-button-primary.a-span12>span.a-button-inner>button.a-button-text"
    //   );

    //   await page.waitForTimeout(5000);
    // }

    // html = await page.content();

    // await page.close();

    // cheerio nodejs module to load html
    $ = cheerio.load(html);

    const products = [];

    $(amazontext.A_ALLPRODUCTLINK_CN).each(async (_idx, el) => {
      // selecting the elements to be scrapped
      const product = $(el);

      let productlink = product // scraping the link of the product
        .find(amazontext.A_PRODUCTLINK_CN)
        .attr("href");

      let element = {
        Productlink: `${amazontext.AMAZON_PAGE_LINK}${productlink}`,
      };

      products.push(element); //storing the details in an array
    });
    return products;
  } catch (error) {
    console.log(error);
    // if (page) {
    //   await page.close();
    // }
    return [];
  }
};

module.exports = { amazonfetchUrlDetails };
