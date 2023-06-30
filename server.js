// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, "index.html");

  fs.readFile(filePath, "utf8", (err, htmlContent) => {
    if (err) {
      res.statusCode = 500;
      res.end(`Error reading HTML file: ${err}`);
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(htmlContent);
  });
});
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

// Declare a route
fastify.get("/", function handler(request, reply) {
  reply.send({ hello: "world" });
});

// Run the server!
fastify.listen({ port: 3001 }, (err) => {
  console.log("Proxy server is living on port http://localhost:3001 👨‍🚀");
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
