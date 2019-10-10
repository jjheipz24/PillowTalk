const dreams = [];

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
    }


    dreams[body.title].title = body.title;
    dreams[body.title].date = body.date;
    dreams[body.title].start = body.start;
    dreams[body.title].end = body.end;
    dreams[body.title].category = body.category;
    dreams[body.title].descrip = body.descrip;

    if (responseCode === 201) {
        responseJSON.message = 'Dream added!';
        console.dir(dreams);
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSONMeta(request, response, responseCode);
};

const getLucid = (request, response) => {
    console.log("get lucid");
};

const getNightmare = (request, response) => {

};

const getRecurring = (request, response) => {

};

const getSignal = (request, response) => {

};

const getProphetic = (request, response) => {

};

const getEpic = (request, response) => {

};

const getAll = (request, response) => {

};



module.exports = {
    dreams,
    addDream,
    getLucid,
    getNightmare,
    getRecurring,
    getSignal,
    getProphetic,
    getEpic,
    getAll,
};
