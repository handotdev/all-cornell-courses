const request = require('request');
const fs = require('fs');

function getRosters() {
    request(`https://classes.cornell.edu/api/2.0/config/rosters.json`, { json: true }, (err, res, rosters) => {
        let list = [];
        rosters.data.rosters.map(ros => {
            list.push(ros.slug);
        })
        console.log(list);
        scan(list);
    });
}

function scan(rosters) {

    let resultObj = {lastScan: Date.now(), data: []}
    let index = 0;
    let delay = 10; // ins seconds
    
    // add delay to prevent 503 bad getaway error (Cornell's system to prevent web scraping)
    let delayedLoop = () => {
        setTimeout(() => {

            const ros = rosters[index];
            let rosterObj = {roster: ros, subjects: []};

            request(`https://classes.cornell.edu/api/2.0/config/subjects.json?roster=${ros}`, { json: true }, (err, res, outer) => {
                if (err) throw err;
                outer.data.subjects.map((subject, j) => {
                    const sub = subject.value;
                    
                    request(`https://classes.cornell.edu/api/2.0/search/classes.json?roster=${ros}&subject=${sub}`, { json: true }, (err, res, body) => {
                        if (body) {
                            const status = body.status;
                            const append = status != 'error' ? body.data.classes : null;
                            let subjectObj = {subject: sub, classes: append};
                            rosterObj.subjects.push(subjectObj);

                            if (j === outer.data.subjects.length - 1) {

                                resultObj.data.push(rosterObj);
                                console.log(`Completed ${ros}`);

                                if (index === rosters.length - 1) {
                                    fs.writeFileSync(`data/courses.json`, JSON.stringify(resultObj));
                                    console.log("Scan completed");
                                }
                            }
                        }
                    });
                });
            });
            
            index++;
            if (index < rosters.length) {
                delayedLoop();
            }
        }, delay * 1000)
    }
    delayedLoop();
}

getRosters();