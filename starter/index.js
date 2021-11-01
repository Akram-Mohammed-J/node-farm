const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");
// const message = "Hello world";
///////////////////////////////////////////////
////////////FILES/////////////////////////////
// let input = fs.readFileSync("./txt/read-this.txt", "utf-8");
// console.log(input);

// const textOut = `This is what we know about avacado ${input} \n file created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);

// non blocking asynchornus way

// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data2) => {
//     fs.writeFile("./txt/append.txt", `${data}${data2}`, (err) => {
//       console.log("file written");
//     });
//   });
// });
///////////////////////////////////////////////////
//////////////////////////////////////////////////
///////////////////SERVER/////////////////////////

let products = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
let dataObj = JSON.parse(products);
let tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
let tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
let tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const slugs = dataObj.map((el) =>
  slugify(el.productName, {
    lower: true,
  })
);
console.log(slugs);
const server = http.createServer((req, res) => {
  // let pathName = req.url;
  const { query, pathname } = url.parse(req.url, true);
  console.log(query, pathname);
  if (pathname === "/" || pathname == "/overview") {
    res.writeHead("200", {
      "content-type": "text/html",
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead("200", {
      "content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead("200", {
      "content-type": "application/json",
    });
    res.end(products);
  } else {
    res.writeHead("404", {
      "content-type": "text/html",
    });
    res.end("<h3>Page Not Found </h3>");
  }
});
server.listen("8000", "127.0.0.1", () => {
  console.log("server started successfully");
});
