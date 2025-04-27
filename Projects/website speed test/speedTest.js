const http = require("http");

// Speed test (Ping simulation)
//Measures how long it takes to connect to a website

///----ROAD MAP----
//!. ping Website
function pingWebsite(url) {
  //Remove http:// or https:// if present
  const hostname = url.replace(/^https?:\/\//, "");
  console.log(`Testing connection to ${hostname}`);
  const startTime = Date.now();
  //Handle the request from the user
  const req = http.get(`http:///${hostname}`, (res) => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log(`Connected to ${hostname}`);
    console.log(`Response status : ${res.statusCode}`);
    console.log(`Response Time : ${responseTime}ms`);
    //Clean up the request
    res.resume();
  });
  req.on("error", (err) => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log(`Failed to connect to ${hostname}: ${err.message}`);
    console.log(`Time elapsed before failure ${responseTime}ms`);
  });
  //Set a timeout for the request (3 seconds)
  req.setTimeout(3000, () => {
    req.abort();
    const responseTime = endTime - startTime;
    console.log(`Connection to ${hostname} time out`);
    console.log(`Time elapsed before timeout ${responseTime}ms`);
  });
}
//! Example usage
if (process.argv.length < 3) {
  console.log("Usage:node speedTest.js website1 website2...");
  console.log("Example:node speedTest.js google.com github.com...");
} else {
  const websites = process.argv.slice(2);
  websites.forEach((site) => {
    pingWebsite(site);
  });
}
