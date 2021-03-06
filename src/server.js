const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/styles.css': htmlHandler.getCSS,
    '/bundle.js': htmlHandler.getBundle,
    '/getLucid': jsonHandler.getLucid,
    '/getNightmare': jsonHandler.getNightmare,
    '/getRecurring': jsonHandler.getRecurring,
    '/getSignal': jsonHandler.getSignal,
    '/getProphetic': jsonHandler.getProphetic,
    '/getEpic': jsonHandler.getEpic,
    '/getAll': jsonHandler.getAll,
    notFound: jsonHandler.notFound,

  },
  HEAD: {
    '/getLucid': jsonHandler.getLucidMeta,
    '/getNightmare': jsonHandler.getNightmareMeta,
    '/getRecurring': jsonHandler.getRecurringMeta,
    '/getSignal': jsonHandler.getSignalMeta,
    '/getProphetic': jsonHandler.getPropheticMeta,
    '/getEpic': jsonHandler.getEpicMeta,
    '/getAll': jsonHandler.getAllMeta,
    notFound: jsonHandler.notFound,
  },

};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addDream') {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString); // creates JS object of data sent

      jsonHandler.addDream(request, response, bodyParams);
    });
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (urlStruct[request.method][parsedUrl.pathname]) {
    // console.log("success");
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
