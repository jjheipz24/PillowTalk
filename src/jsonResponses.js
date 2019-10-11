const dreams = {};
var lucid = [];
var nightmare = [];
var recurring = [];
var signal = [];
var prophetic = [];
var epic = [];

var titles = [];

const respondJSON = (request, response, status, object) => {
    response.writeHead(status, {
        'Content-Type': 'application/json',
    });
    response.write(JSON.stringify(object));
    response.end();
};

const respondJSONMeta = (request, response, status) => {
    response.writeHead(status, {
        'Content-Type': 'application/json',
    });
    response.end();
};

const addDream = (request, response, body) => {
    // console.dir(body)
    const responseJSON = {
        message: 'Please fill out all fields',
    };

    if (!body.title || !body.date || !body.start || !body.end || !body.category || !body.descrip) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 201; // initial response code

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

    //put the dream in the right category
    categorize(dreams[body.title], body.category);

    if (responseCode === 201) {
        responseJSON.message = 'Dream added!';
        console.dir(dreams);
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSONMeta(request, response, responseCode);
};

//pushes dream to the correct array
const categorize = (log, category) => {
    let dreamArr;
    switch (category) {
        case 'lucid':
            dreamArr = lucid;
            break;
        case 'nightmare':
            dreamArr = nightmare;
            break;
        case 'recurring':
            dreamArr = recurring;
            break;
        case 'signal':
            dreamArr = signal;
            break;
        case 'prophetic':
            dreamArr = prophetic;
            break;
        case 'epic':
            dreamArr = epic;
            break;
        default:
            dreamArr = [];
    }

    dreamArr.push(log);
};

const getLucid = (request, response) => {
    //console.log(lucid);
};

const getLucidMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
};

const getNightmare = (request, response) => {

};
const getNightmareMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
};

const getRecurring = (request, response) => {

};

const getRecurringMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
};

const getSignal = (request, response) => {

};
const getSignalMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
};

const getProphetic = (request, response) => {

};

const getPropheticMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
};

const getEpic = (request, response) => {

};

const getEpicMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
};

const getAll = (request, response) => {
    const responseJSON = {
        dreams,
        titles,
    };

    respondJSON(request, response, 200, responseJSON);

};

const getAllMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
};

const notFound = (request, response) => {
    const responseJSON = {
        id: '404',
        message: 'Error: Cannot be found',
    };

    return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
    respondJSONMeta(request, response, 404);
};



module.exports = {
    addDream,
    getLucid,
    getLucidMeta,
    getNightmare,
    getNightmareMeta,
    getRecurring,
    getRecurringMeta,
    getSignal,
    getSignalMeta,
    getProphetic,
    getPropheticMeta,
    getEpic,
    getEpicMeta,
    getAll,
    getAllMeta,
    notFound,
    notFoundMeta,
};
