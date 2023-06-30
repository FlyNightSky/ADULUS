const fastify = require('fastify')();
const axios = require('axios');

fastify.register(require('fastify-static'), {
  root: __dirname,
  prefix: '/public/',
});

fastify.get('/ADULUS', async (request, reply) => {
  const url = 'http://www.google.com'; // URL of the website you want to proxy

  try {
    const response = await axios.get(url, {
      headers: request.headers, // Forward the client headers to the proxied request
    });

    const headers = response.headers;
    const content = response.data;

    let html = `<h1>Headers:</h1><pre>${JSON.stringify(headers, null, 2)}</pre>`;
    html += `<h1>Content:</h1><pre>${content}</pre>`;

    reply.type('text/html').send(html);
  } catch (error) {
    reply.code(500).send('Error occurred while fetching the website.');
  }
});

fastify.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server is running on http://localhost:3000');
});
