const request = require('request');

function scan() {
let result = [];
const ros = 'FA19'

    let rosterObj = {roster: ros, subjects: []};

    request(`https://classes.cornell.edu/api/2.0/config/subjects.json?roster=${ros}`, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    body.data.subjects.map(async function(subject) {
        const sub = subject.value;
        
        rosterObj.subjects[sub] = await classes(sub);
        console.log(rosterObj);
    });
    });
}

async function classes(sub) {
    request(`https://classes.cornell.edu/api/2.0/search/classes.json?roster=SP19&subject=${sub}`, { json: true }, (err, res, body) => {
        const status = body.status;
        if (status != 'error') {
            return body.data.classes;
        } else {
            return null;
        }
    });
}

function test() {
    request(`https://classes.cornell.edu/api/2.0/search/classes.json?roster=SP19&subject=CS`, { json: true }, (err, res, body) => {
        console.log(body.data.classes);
    });
}

scan();