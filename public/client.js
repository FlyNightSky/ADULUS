console.log("Client.js is working 👍");

// Get the input field element
const input = document.getElementById("searchInput");

input.addEventListener("change", sendData);

function sendData() {
  let url;
  if (input.value.startsWith("https://")) {
    url = input.value;
  } else {
    url = "https://" + input.value;
  }
  console.log(url);

  // Send the URL to the server
  fetch("/aduluspros", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  })
    .then((response) => response.text())
    .then((data) => {
      // Handle the response from the server if needed
      console.log(data);

      // Create a new HTML document for the response
      const newDocument = document.implementation.createHTMLDocument();
      newDocument.documentElement.innerHTML = data;

      // Replace the current document with the new one
      document.open();
      document.write(newDocument.documentElement.innerHTML);
      document.close();
    })
    .catch((error) => {
      // Handle any error that occurs during the request
      console.error("Error:", error);
    });
}
