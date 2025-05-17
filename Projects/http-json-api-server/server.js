const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

//Define
const PORT = 5000;

//File paths
const usersDataPath = path.join(__dirname, "data", "users.json");
const postsDataPath = path.join(__dirname, "data", "posts.json");

//Helper functions to read JSON files
function readJSONFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.log(`Error reading file ${filePath}:${error.message}`);
    return null;
  }
}

//Create HTTP server
const server = http.createServer((req, res) => {
  //Set response headers
  res.setHeader("Content-Type", "application/json");
  //Parse thr URL
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  //Get Query params
  const queryParams = parsedUrl.query;
  //Log the request
  console.log(`Request received:${req.method} ${path}`);

  switch (trimmedPath) {
    case "users":
      // Return user data
      const userData = readJSONFile(usersDataPath);

      if (userData) {
        // Check if we need to filter by id
        if (queryParams.id) {
          const userId = parseInt(queryParams.id);
          const user = userData.users.find((user) => user.id === userId);

          if (user) {
            res.statusCode = 200;
            res.end(JSON.stringify(user));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "User not found" }));
          }
        } else {
          res.statusCode = 200;
          res.end(JSON.stringify(userData));
        }
      } else {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Could not read user data" }));
      }
      break;

    case "posts":
      // Return post data
      const postData = readJSONFile(postsDataPath);

      if (postData) {
        // Check if we need to filter by id
        if (queryParams.id) {
          const postId = parseInt(queryParams.id);
          const post = postData.posts.find((post) => post.id === postId);

          if (post) {
            res.statusCode = 200;
            res.end(JSON.stringify(post));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Post not found" }));
          }
        } else {
          res.statusCode = 200;
          res.end(JSON.stringify(postData));
        }
      } else {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Could not read post data" }));
      }
      break;
    case "status":
      //return server status
      const uptime = process.uptime();
      const status = {
        status: "online",
        timestamp: new Date().toISOString(),
        uptime,
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        node_version: process.version,
        routes: ["/users", "/posts", "/status"],
      };
      res.statusCode = 200;
      res.end(JSON.stringify(status));
      break;

    default:
      //Return available endpoints
      const endpoints = {
        endpoints: [
          {
            path: "/users",
            description:
              "Returns list of users or a specific user with ?id=<user_id>",
            method: "GET",
          },
          {
            path: "/posts",
            description:
              "Returns list of posts or a specific post with ?id=<post_id>",
            method: "GET",
          },
          {
            path: "/status",
            description: "Returns current server status and metrics",
            method: "GET",
          },
        ],
      };
      res.statusCode = 200;
      res.end(JSON.stringify(endpoints));
  }
});

//Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`available routes:`);
  console.log(`-http://localhost:${PORT}/users`);
  console.log(`-http://localhost:${PORT}/posts`);
  console.log(`-http://localhost:${PORT}/status`);
});
