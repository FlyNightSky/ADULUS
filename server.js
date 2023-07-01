const fastify = require("fastify")({ logger: true });
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Parse request bodies as JSON
app.use(bodyParser.json());

app.post("/aduluspros", async (request, response) => {
  const { url } = request.body;
  console.log("Received URL:", url);

  try {
    // Fetch the website content using Axios
    const { data } = await axios.get(url);

    // Modify the fetched HTML to replace the URLs of resources with proxy URLs
    const modifiedHtml = modifyHtml(data, url);

    // Set the appropriate content type header
    response.setHeader("Content-Type", "text/html");

    // Send the modified HTML as the response
    response.send(modifiedHtml);
  } catch (error) {
    console.error("Error:", error);
    response.status(500).send("An error occurred");
  }
});

// New route to handle proxying of resources
app.get("/proxy/:url/*", async (request, response) => {
  const { url } = request.params;
  const resourceUrl = request.params[0];

  try {
    // Fetch the resource using Axios
    const { data } = await axios.get(`${url}/${resourceUrl}`, {
      responseType: "arraybuffer",
    });

    // Set the appropriate content type header
    const extension = path.extname(resourceUrl);
    switch (extension) {
      case ".css":
        response.setHeader("Content-Type", "text/css");
        break;
      case ".js":
        response.setHeader("Content-Type", "text/javascript");
        break;
      case ".png":
        response.setHeader("Content-Type", "image/png");
        break;
      case ".jpg":
      case ".jpeg":
        response.setHeader("Content-Type", "image/jpeg");
        break;
      case ".gif":
        response.setHeader("Content-Type", "image/gif");
        break;
      // Add more cases for other types of resources as needed
      default:
        response.setHeader("Content-Type", "application/octet-stream");
        break;
    }

    // Send the resource data as the response
    response.send(data);
  } catch (error) {
    console.error("Error:", error);
    response.status(500).send("An error occurred");
  }
});

app.get("/adulus-out", (request, response) => {
  // Read the proxy.html file
  const fs = require("fs");
  const proxyHtml = fs.readFileSync(
    path.join(__dirname, "public", "proxy.html"),
    "utf8"
  );

  // Send the proxy.html content as the response
  response.send(proxyHtml);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

fastify.listen(3001, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Proxy server is running on port 3001");
});

function modifyHtml(html, baseUrl) {
  const cheerio = require("cheerio");

  const $ = cheerio.load(html);

  // Modify image URLs
  $("img").each(function () {
    const originalSrc = $(this).attr("src");
    const proxySrc = `/proxy/${baseUrl}/${originalSrc}`;
    $(this).attr("src", proxySrc);
  });

  // Modify CSS URLs
  $("link[rel='stylesheet']").each(function () {
    const originalHref = $(this).attr("href");
    const proxyHref = `/proxy/${baseUrl}/${originalHref}`;
    $(this).attr("href", proxyHref);
  });

  // Modify JS URLs
  $("script").each(function () {
    const originalSrc = $(this).attr("src");
    if (originalSrc) {
      const proxySrc = `/proxy/${baseUrl}/${originalSrc}`;
      $(this).attr("src", proxySrc);
    }
  });

  return $.html();
}
