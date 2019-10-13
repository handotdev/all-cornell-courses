const request = require('request');

const ros = 'WI19';
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
                        console.log(result.length);
                    }
                })
            }
        });
    });
});