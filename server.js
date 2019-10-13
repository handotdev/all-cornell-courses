const request = require('request');

const rosters = ["FA14","WI15","SP15","SU15","FA15","WI16","SP16","SU16","FA16","WI17","SP17","SU17","FA17","WI18","SP18","SU18","FA18","WI19","SP19","SU19","FA19","WI20"];
const ros = rosters[21];


compare("SU18", "SU16", (res) => {
    console.log(res.length);
});

function getCourses(ros, callback) {
    
    let result = [];
    
    request(`https://classes.cornell.edu/api/2.0/config/subjects.json?roster=${ros}`, { json: true }, (err, res, outer) => {
        if (err) throw err;
        let subjects = outer.data.subjects;

        let subFill = [];
        subjects.map((subject) => {
            const sub = subject.value;
            
            request(`https://classes.cornell.edu/api/2.0/search/classes.json?roster=${ros}&subject=${sub}`, { json: true }, (err, res, body) => {
                if (body) {
                    subFill.push(sub);
                    courseFill = [];
                    let courses = body.data.classes;

                    courses.map((course) => {

                        result.push(course.subject+" "+course.catalogNbr);
                        courseFill.push(course);
                        if (subFill.length === subjects.length && courseFill.length === courses.length) {
                            return callback(result);
                        }
                    })
                }
            });
        });
    });
}

function compare(sem1, sem2, callback) {
    
    getCourses(sem1, (res) => {
        let first = res;
        getCourses(sem2, (res) => {
            let second = res;
            let common = first.filter(value => second.includes(value));
            callback(common);
        });
    });
}