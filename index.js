const http = require('http');
const { StringDecoder } = require('string_decoder');
const config = require('./config');

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/$/g, '');

  const method = req.method;
  const requestQuery = parsedUrl.searchParams;

  const headers  = req.headers;

  const decoder = new StringDecoder('utf8');
  let buffer = '';

  req.on('data', (chunk) => {
    buffer += decoder.write(chunk);
  });

  req.on('end', () => {
    buffer += decoder.end();

    const selectedCallback = handlers[trimmedPath] || handlers.notFound

    const data = {
      'path': trimmedPath,
      'method': method,
      'query': requestQuery,
      headers,
      'payload': buffer
    }

    selectedCallback(data, function(statusCode = 200, payload = {}) {
      const responseData = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode);
      res.end(responseData);

      console.log('Response sent successfully');
    })
  })
});

const handlers = {};

handlers.sample = function(data, callback) {
  callback(201, {
    name: 'sample handler'
  });
}

handlers.notFound = function(data, callback) {
  callback(404);
}

const router = {
  sample: handlers.sample
}

server.listen(config.port, () => {
  console.log(`Server started on port: ${config.port} in ${config.envName}`);
});
