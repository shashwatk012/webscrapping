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

const typesOfRatings = ["POSITIVE_FIRST", "NEGATIVE_FIRST"];
const urlmaking = (category) => {
  const url = `https://www.flipkart.com/search?q=${category}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`;
  return url;
};
const apikey = [
  "BS9S9SWX40Q89398KUPHGVK0VJBPS26ZJ70PWE22WUV987FF5CC8WT1AL8CWRBRN4FFSK3GQZIQOTTXS",
  "V5WWNC5YS2J0XB0QDBGS1YJYLLAISKYAOV96MNSMH5MMH8PWWXCE20S7I32D5WOTHIQCLNNRQARV4NYD",
  "VADZ57VNJ1EIJDK6FKVG154JJUQ22QR2FUTZ87YEKXXLQPCGEYA8MRKLIYACCNUMR6OQ2G8MBDPY84V9",
  "D6IHE402MLAG202MD2GUBENJJRBT5L5ZT8LXE8O8RUFL7RO87XHFBT6HQY2LXATXLZPW0OOCR42C37FF",
  "66KLRB3USB0V9KTMA850Q0NYT58KCGINTKDPF8456TH2SIRHQUBY5AQB2TMRIMFCH9NRZLAV2D3PRHV4",
  "SNMSB09GH4YDDIYUNAQQ0SJ9DNITPD9A4NFN7CMQP1L9VV8RRWRCD6D3F7TPDQT65SZKXXIN7T5NYNPH",
  "P6FOOX8K36J5KIIWGZZIXP1UZO5M55S87WPHVSB801VC4PDK6PUOK0JQYHL6LFI8OPUU3LU56RTYJS9F",
  "CATL0AF860ITAJC64TYC4ZE64IU4UG4G5MXOLBD1YDMUV637I2I0OO0FWETG1SPJI3EHYKBB4MEHSIV2",
  "PI1PFPUURD5J7JSJBXWJNOE0RS6W6V092CP7HPN0KB29UF76H757I0QMCDX4Z793HS7Y26948CY8JZ3U",
  "O33AV370Y4MFTKP27C0NH4A1GT72JN29IUBZOWK4VP43GMO42A9Z6RNSL6DO08RFCICBVT5U80JFKAKC",
  "VAKGFLNBTQ4UZV4LOADR41G9PLU1C49S8FA59P376741UJOMCKB4VSR7XHV5TJU0VN1BBDCTKIAI7TFQ",
];

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
  "NumberofSellers",
  "sellerDetails",
  "Description",
  "Number of images",
  "POSITIVE_FIRST",
  "NEGATIVE_FIRST",
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
