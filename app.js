const request = require('request');
const fs = require('fs');

function scan() {
    const ros = 'FA19';
    let rosterObj = {roster: ros, subjects: []};

    request(`https://classes.cornell.edu/api/2.0/config/subjects.json?roster=${ros}`, { json: true }, (err, res, outer) => {
        outer.data.subjects.map((subject, j) => {
            const sub = subject.value;
            
            request(`https://classes.cornell.edu/api/2.0/search/classes.json?roster=${ros}&subject=${sub}`, { json: true }, (err, res, body) => {
                if (body) {
                    const status = body.status;
                    const append = status != 'error' ? body.data.classes : null;
                    let subjectObj = {subject: sub, classes: append};
                    rosterObj.subjects.push(subjectObj);

                    if (j === outer.data.subjects.length - 1) {
                        fs.writeFileSync(`data/${ros}.json`, JSON.stringify(rosterObj));
                        console.log(`Completed ${ros}`);
                    }
                }
            });
        });
    });
}

function getRosters() {
    request(`https://classes.cornell.edu/api/2.0/config/rosters.json`, { json: true }, (err, res, rosters) => {
        rosters.data.rosters.map(ros => {
            console.log(ros.slug);
        })
    });
}

getRosters();