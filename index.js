const http = require('http');
const { StringDecoder } = require('string_decoder');

const PORT = 3000;

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

    res.end('Hello World\n');

    console.log('Request recieved with this payload: \n', buffer);
  })
});

server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
