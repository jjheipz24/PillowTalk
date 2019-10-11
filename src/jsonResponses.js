const dreams = {};
var titles = [];

const lucid = {};
var lucidTitles = [];

const nightmare = {};
var nightmareTitles = [];

const recurring = {};
var recurringTitles = [];

const signal = {};
var signalTitles = [];

const prophetic = {};
var propheticTitles = [];

const epic = {};
var epicTitles = [];



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
    categorize(body, body.category);

    if (responseCode === 201) {
        responseJSON.message = 'Dream added!';
        console.dir(dreams);
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSONMeta(request, response, responseCode);
};

//pushes dream to the correct array
const categorize = (log, category) => {

    switch (category) {
        case 'lucid':
            createFullObject(lucid, log);
            lucidTitles.push(log.title);
            break;
        case 'nightmare':
            createFullObject(nightmare, log);
            nightmareTitles.push(log.title);
            break;
        case 'recurring':
            createFullObject(recurring, log);
            recurringTitles.push(log.title);
            break;
        case 'signal':
            createFullObject(signal, log);
            signalTitles.push(log.title);
            break;
        case 'prophetic':
            createFullObject(prophetic, log);
            propheticTitles.push(log.title);
            break;
        case 'epic':
            createFullObject(epic, log);
            epicTitles.push(log.title);
            break;
        default:
            console.log("No category selected");
    }

};

const createFullObject = (typeObj, log) => {
    typeObj[log.title] = {};
    typeObj[log.title].title = log.title;
    typeObj[log.title].date = log.date;
    typeObj[log.title].start = log.start;
    typeObj[log.title].end = log.end;
    typeObj[log.title].category = log.category;
    typeObj[log.title].descrip = log.descrip;
}

const getLucid = (request, response) => {
    //console.log(lucid);
    const responseJSON = {
        lucid,
        lucidTitles,
    };

    respondJSON(request, response, 200, responseJSON);
};

const getLucidMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
};

const getNightmare = (request, response) => {
    const responseJSON = {
        nightmare,
        nightmareTitles,
    };

    respondJSON(request, response, 200, responseJSON);
};
const getNightmareMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
};

const getRecurring = (request, response) => {
    const responseJSON = {
        recurring,
        recurringTitles,
    };

    respondJSON(request, response, 200, responseJSON);
};

const getRecurringMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
};

const getSignal = (request, response) => {
    const responseJSON = {
        signal,
        signalTitles,
    };

    respondJSON(request, response, 200, responseJSON);
};
const getSignalMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
};

const getProphetic = (request, response) => {
    const responseJSON = {
        prophetic,
        propheticTitles,
    };

    respondJSON(request, response, 200, responseJSON);
};

const getPropheticMeta = (request, response) => {
    respondJSONMeta(request, response, 200);
};

const getEpic = (request, response) => {
    const responseJSON = {
        epic,
        epicTitles,
    };

    respondJSON(request, response, 200, responseJSON);
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
