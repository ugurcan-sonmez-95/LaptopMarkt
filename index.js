// Requires file system, http, and url module
const fs = require('fs');
const http = require('http');
const url = require('url');
// Reads the file and parses it as a Javascript object
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);
// Creates a server
const server = http.createServer((req, res) => {
  // Gets and stores the pathname and id
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;

  // ROUTING

  // Products overview
  if (pathName === '/products' || pathName === '/') {
    res.writeHead(200, {'Content-type': 'text/html'});

    fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
      let overviewOutput = data;

      fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {

        const cards = laptopData.map(cur => replaceTemp(data, cur)).join('');
        overviewOutput = overviewOutput.replace('{%CARDS%}', cards);

        res.end(overviewOutput);
      });
    });
  }
  // Laptop details
  else if (pathName === '/laptop' && id < laptopData.length) {
    res.writeHead(200, {'Content-type': 'text/html'});
    // Reads the 'template-laptop' and changes the data with the actual one
    fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
      const laptopInfo = laptopData[id];
      const output = replaceTemp(data, laptopInfo);
      res.end(output);
    });
  }
  // Images
  else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      res.writeHead(200, {'Content-type': 'image/jpg'});
      res.end(data);
    });
  }

  // THE URL IS NOT FOUND
  else {
    res.writeHead(404, {'Content-type': 'text/html'});
    res.end('The URL was not found on the server!');
  }
});
// Listens for a request
server.listen(1337, '127.0.0.1', () => {
  console.log('Waiting for requests.');
});

function replaceTemp(orgHTML, laptopInfo) {
  let output = orgHTML.replace(/{%PRICE%}/g, laptopInfo.price);
  output = output.replace(/{%IMAGE%}/g, laptopInfo.image);
  output = output.replace(/{%PRODUCTNAME%}/g, laptopInfo.productName);
  output = output.replace(/{%SCREEN%}/g, laptopInfo.screen);
  output = output.replace(/{%CPU%}/g, laptopInfo.cpu);
  output = output.replace(/{%STORAGE%}/g, laptopInfo.storage);
  output = output.replace(/{%RAM%}/g, laptopInfo.ram);
  output = output.replace(/{%DETAILS%}/g, laptopInfo.description);
  output = output.replace(/{%ID%}/g, laptopInfo.id);
  return output;
};