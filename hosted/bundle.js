'use strict';

var http = require('http');
var url = require('url');
var query = require('querystring');
var htmlHandler = require('./htmlResponses.js');
var jsonHandler = require('./jsonResponses.js');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

var urlStruct = {
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
    notFound: jsonHandler.notFound

  },
  HEAD: {
    '/getLucid': jsonHandler.getLucidMeta,
    '/getNightmare': jsonHandler.getNightmareMeta,
    '/getRecurring': jsonHandler.getRecurringMeta,
    '/getSignal': jsonHandler.getSignalMeta,
    '/getProphetic': jsonHandler.getPropheticMeta,
    '/getEpic': jsonHandler.getEpicMeta,
    '/getAll': jsonHandler.getAllMeta,
    notFound: jsonHandler.notFound
  }

};

var handlePost = function handlePost(request, response, parsedUrl) {
  if (parsedUrl.pathname === '/addDream') {
    var body = [];

    request.on('error', function (err) {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', function (chunk) {
      body.push(chunk);
    });

    request.on('end', function () {
      var bodyString = Buffer.concat(body).toString();
      var bodyParams = query.parse(bodyString); // creates JS object of data sent

      jsonHandler.addDream(request, response, bodyParams);
    });
  }
};

var handleGet = function handleGet(request, response, parsedUrl) {
  if (urlStruct[request.method][parsedUrl.pathname]) {
    // console.log("success");
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

var onRequest = function onRequest(request, response) {
  var parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log('Listening on 127.0.0.1: ' + port);
'use strict';

var fs = require('fs'); // pull in the file system module

var index = fs.readFileSync(__dirname + '/../hosted/client.html');
var css = fs.readFileSync(__dirname + '/../hosted/styles.css');
var jsBundle = fs.readFileSync(__dirname + '/../hosted/bundle.js');

var getIndex = function getIndex(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });
  response.write(index);
  response.end();
};

var getCSS = function getCSS(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/css'
  });
  response.write(css);
  response.end();
};

var getBundle = function getBundle(request, response) {
  response.writeHead(200, {
    'Content-Type': 'application/javascript'
  });
  response.write(jsBundle);
  response.end();
};

module.exports = {
  getIndex: getIndex,
  getCSS: getCSS,
  getBundle: getBundle
};
'use strict';

var dreams = {};
var titles = [];

var lucid = {};
var lucidTitles = [];

var nightmare = {};
var nightmareTitles = [];

var recurring = {};
var recurringTitles = [];

var signal = {};
var signalTitles = [];

var prophetic = {};
var propheticTitles = [];

var epic = {};
var epicTitles = [];

var respondJSON = function respondJSON(request, response, status, object) {
  response.writeHead(status, {
    'Content-Type': 'application/json'
  });
  response.write(JSON.stringify(object));
  response.end();
};

var respondJSONMeta = function respondJSONMeta(request, response, status) {
  response.writeHead(status, {
    'Content-Type': 'application/json'
  });
  response.end();
};

// Turns entries into objects
var createFullObject = function createFullObject(log) {
  var typeObj = {};
  typeObj[log.title] = {};
  typeObj[log.title].title = log.title;
  typeObj[log.title].date = log.date;
  typeObj[log.title].start = log.start;
  typeObj[log.title].end = log.end;
  typeObj[log.title].category = log.category;
  typeObj[log.title].descrip = log.descrip;

  return typeObj;
};

// pushes dream to the correct array for filtering
var categorize = function categorize(log, category) {
  switch (category) {
    case 'lucid':
      lucid = createFullObject(log);
      lucidTitles.push(log.title);
      break;
    case 'nightmare':

      nightmare = createFullObject(log);
      nightmareTitles.push(log.title);
      break;
    case 'recurring':

      recurring = createFullObject(log);
      recurringTitles.push(log.title);
      break;
    case 'signal':

      signal = createFullObject(log);
      signalTitles.push(log.title);
      break;
    case 'prophetic':

      prophetic = createFullObject(log);
      propheticTitles.push(log.title);
      break;
    case 'epic':

      epic = createFullObject(log);
      epicTitles.push(log.title);
      break;
    default:
      console.log('No category selected');
  }
};

// // Turns entries into objects
// const createFullObject = (typeObj, log) => {
//
//    typeObj[log.title] = {};
//    typeObj[log.title].title = log.title;
//    typeObj[log.title].date = log.date;
//    typeObj[log.title].start = log.start;
//    typeObj[log.title].end = log.end;
//    typeObj[log.title].category = log.category;
//    typeObj[log.title].descrip = log.descrip;
// };


var addDream = function addDream(request, response, body) {
  // console.dir(body)
  var responseJSON = {
    message: 'Please fill out all fields'
  };

  if (!body.title || !body.date || !body.start || !body.end || !body.category || !body.descrip) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  var responseCode = 201; // initial response code

  // checks if the name already exists
  if (dreams[body.title]) {
    // if it exists, 204 states it's updating it
    responseCode = 204;
  } else {
    // otherwise it creates an empty subobject of the dreams object
    dreams[body.title] = {};
    titles.push(body.title);
  }

  dreams[body.title].title = body.title;
  dreams[body.title].date = body.date;
  dreams[body.title].start = body.start;
  dreams[body.title].end = body.end;
  dreams[body.title].category = body.category;
  dreams[body.title].descrip = body.descrip;

  // put the dream in the right category
  categorize(body, body.category);

  if (responseCode === 201) {
    responseJSON.message = 'Dream added!';
    // console.dir(dreams);
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

var getLucid = function getLucid(request, response) {
  // console.log(lucid);
  var responseJSON = {
    lucid: lucid,
    lucidTitles: lucidTitles
  };

  respondJSON(request, response, 200, responseJSON);
};

var getLucidMeta = function getLucidMeta(request, response) {
  respondJSONMeta(request, response, 200);
};

var getNightmare = function getNightmare(request, response) {
  var responseJSON = {
    nightmare: nightmare,
    nightmareTitles: nightmareTitles
  };

  respondJSON(request, response, 200, responseJSON);
};
var getNightmareMeta = function getNightmareMeta(request, response) {
  respondJSONMeta(request, response, 200);
};

var getRecurring = function getRecurring(request, response) {
  var responseJSON = {
    recurring: recurring,
    recurringTitles: recurringTitles
  };

  respondJSON(request, response, 200, responseJSON);
};

var getRecurringMeta = function getRecurringMeta(request, response) {
  respondJSONMeta(request, response, 200);
};

var getSignal = function getSignal(request, response) {
  var responseJSON = {
    signal: signal,
    signalTitles: signalTitles
  };

  respondJSON(request, response, 200, responseJSON);
};
var getSignalMeta = function getSignalMeta(request, response) {
  respondJSONMeta(request, response, 200);
};

var getProphetic = function getProphetic(request, response) {
  var responseJSON = {
    prophetic: prophetic,
    propheticTitles: propheticTitles
  };

  respondJSON(request, response, 200, responseJSON);
};

var getPropheticMeta = function getPropheticMeta(request, response) {
  respondJSONMeta(request, response, 200);
};

var getEpic = function getEpic(request, response) {
  var responseJSON = {
    epic: epic,
    epicTitles: epicTitles
  };

  respondJSON(request, response, 200, responseJSON);
};

var getEpicMeta = function getEpicMeta(request, response) {
  respondJSONMeta(request, response, 200);
};

var getAll = function getAll(request, response) {
  var responseJSON = {
    dreams: dreams,
    titles: titles
  };

  respondJSON(request, response, 200, responseJSON);
};

var getAllMeta = function getAllMeta(request, response) {
  respondJSONMeta(request, response, 200);
};

var notFound = function notFound(request, response) {
  var responseJSON = {
    id: '404',
    message: 'Error: Cannot be found'
  };

  return respondJSON(request, response, 404, responseJSON);
};

var notFoundMeta = function notFoundMeta(request, response) {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  addDream: addDream,
  getLucid: getLucid,
  getLucidMeta: getLucidMeta,
  getNightmare: getNightmare,
  getNightmareMeta: getNightmareMeta,
  getRecurring: getRecurring,
  getRecurringMeta: getRecurringMeta,
  getSignal: getSignal,
  getSignalMeta: getSignalMeta,
  getProphetic: getProphetic,
  getPropheticMeta: getPropheticMeta,
  getEpic: getEpic,
  getEpicMeta: getEpicMeta,
  getAll: getAll,
  getAllMeta: getAllMeta,
  notFound: notFound,
  notFoundMeta: notFoundMeta
};
