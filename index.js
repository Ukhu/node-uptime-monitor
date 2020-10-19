const http = require('http');
const https = require('https');
const fs = require('fs');
const { StringDecoder } = require('string_decoder');
const config = require('./config');

// Instantiate HTTP Server
const httpServer = http.createServer(unifiedServer);

// Start HTTP Server
httpServer.listen(config.httpPort, () => {
  console.log(`HTTP server started on port: ${config.httpPort} in ${config.envName}`);
});

// Instantiate HTTPS Server
const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsServerOptions, unifiedServer)

// Start HTTPS Server
httpsServer.listen(config.httpsPort, () => {
  console.log(`HTTPS server started on port: ${config.httpsPort} in ${config.envName}`);
});

// Handle all requests on both HTTP and HTTPS servers 
function unifiedServer(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/$/g, '');

  const method = req.method;
  const requestQuery = parsedUrl.searchParams;

  const headers  = req.headers;

  // decoder for decoding buffers
  const decoder = new StringDecoder('utf8');
  let buffer = '';

  // called only for requests with body to handle incomming chunks from the stream
  req.on('data', (chunk) => {
    buffer += decoder.write(chunk); // decode each chunk and append to the earlier received chunks
  });

  // called for all requests regardless if they contain a body
  req.on('end', () => {
    buffer += decoder.end();

    // check if request path is among the available routes
    const selectedCallback = handlers[trimmedPath] || handlers.notFound

    // construct data to be sent to all handlers
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
    })
  })
}

const handlers = {};

handlers.ping = function(data, callback) {
  callback(200);
}

// handle all not found routes
handlers.notFound = function(data, callback) {
  callback(404, {
    'message': 'not found'
  });
}

// router object with available routes
const router = {
  sample: handlers.sample
}
