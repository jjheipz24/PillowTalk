const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/': htmlHandler.getIndex,
    '/styles.css': htmlHandler.getCSS,
    '/bundle.js': htmlHandler.getBundle,
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

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);
    const params = query.parse(parsedUrl.query);

    if (urlStruct[parsedUrl.pathname]) {
        urlStruct[parsedUrl.pathname](request, response, params);
    }
    //         else {
    //            urlStruct.notFound(request, response, params);
    //        }

    if (request.method === 'POST') {
        handlePost(request, response, parsedUrl);
    }

};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
