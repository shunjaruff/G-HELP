var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var model = require('../models.js');
var router = express.Router();




//Logout and redirect to home
router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/ghelp');
    });
});


router.get('/ping', function(req, res){
    res.status(200).send("BullsEye!");
});

//custome function to check if user is logged in
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send('You need to be logged in to access this page');
    }
}

//custom function to check if admin is logged in
function adminLogin(req, res, next) {
    if (req.user.username=='admin@mun.ca') {
        next();
    } else {
        res.redirect('/home');
    }
}

//custom function to check the current logged in user's semester
function checkSemester(req, res, next) {
    if (req.user.semester>2) {
        next();
    } else {
        res.send('You are not eligible to be a Mentor');
    }
}

//checking if logged in user is already a mentor
function validateMentor(req, res, next){
    if(req.user) {
        model.MenSchema.findOne({_id: req.user._id}).exec(function (err, docs) {
            if (docs) {
                res.send('you are already registered as a Mentor');
            }
            else {
                next();
            }
        })
    }
    else{
        res.send('you are not currently logged in');
    }
}

//GET method for home page with admin or student condition
router.get('/home', loggedIn, function(req, res, next) {

  if (req.user.username=='admin@mun.ca') {
      res.render('adminhome', { user : req.user });
  }
  else {
    res.render('studenthome', { user : req.user });
  }
     });


//GET method for addevent page
router.get('/addevent',loggedIn, adminLogin, function(req, res, next) {
    res.render('addevent', { user : req.user });
});

//POST method for addevent page
router.post('/addevent', function(req, res) {

    new model.AddEvent({
    eventName:      req.body.eventName,
    startDate:    req.body.startDate,
    endDate:     req.body.endDate,
    startTime:        req.body.startTime,
    endTime:    req.body.endTime,
    venue:        req.body.venue,
    eventDetail:          req.body.eventDetail
        


    }).save(function(err, docs){
            if (err) {
                //if failed, return error
                res.send("There was some error" );
            }
            else {
                //Success !!!
                
                res.end("Event Registered!");
            }
        });
});


router.get('/viewevent', function(req, res){
    //   find data from addevent schema
    model.AddEvent.find({}, {eventName: 1 , startDate: 1 , endDate:1, startTime:1, endTime:1, venue: 1, eventDetail: 1})
        .exec(function(err, evnts){
            if(err){
                console.log(err);
            }
            else {
                
                 res.render('viewevent', { evnts:evnts});
                       
            }});

});


//GET assign host family page
router.get('/hostfamily', function(req, res, next) {
    res.render('hostfamily', { title: 'Host a student' });
});

//POST data from assign host family page to db
router.post('/hostfamily', function(req, res) {
    var host = new model.Host({
        //Get our form values.
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        address : req.body.address,
        mobileNo : req.body.mobileNo,
        preference : req.body.preference
    });
    console.log(host);
    host.save(function(err, doc){
        if (err) {
            //if failed, return error
            res.send("The email is already Registered");
        }
        else {
            //Success !!!
            res.end("Thank you for your registration");
        }
    });
});

//GET student registration page
router.get('/register', function(req, res) {

    res.render('register', { });   
});




//POST data from register page to db
router.post('/register', function(req, res, next) {
    Account.register(new Account({ username : req.body.username, _id : req.body.munNo,
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                program : req.body.progtype,
                semester: req.body.semester,
                mobile : req.body.mobile,
                sex : req.body.sex,
                preference: req.body.preference,
                image: req.body.image,
                assigned: req.body.assigned,
                mentor: req.body.mentor,
                hostRequest: req.body.hostRequest,
                hostFamily: req.body.hostFamily }), req.body.password, function(err, account) {
        if (err) {
          return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                
                res.redirect('/picture');
            });
        });
    });


});

//GET method for viewing mentor detail
router.get('/viewmentor', loggedIn, function(req, res) {
        if(req.user) {
            Account.findOne({_id: req.user._id}).populate('mentor').exec(function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                   
                  console.log('Your Mentor is', data.mentor.firstName, data.mentor.lastName);
                res.render('viewmentor', {title: 'Your Mentor', data: data});
                    
                }
            })
        }
});



//GET method for viewing mentee detail
router.get('/viewmentee', loggedIn, function(req, res) {
    if(req.user) {
        model.MenSchema.findOne({_id: req.user._id}).populate('mentee').exec(function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);

                    res.render('viewmentee', {data: data});

            }
        })
    }
});
router.get('/assignmentor', loggedIn, adminLogin, function(req, res){
    //to find the values from our mentor and student schema
    model.MenSchema.find({}, {firstName: 1 , lastName: 1 , preference: 1, _id: 1})
        .exec(function(err, ments){
            if(err){
                console.log(err);
            }
            else {
                Account.find({$and: [{semester: { $lt: 3 }},{assigned: false}]}, {firstName: 1, lastName: 1, preference: 1, _id: 1})
                    .exec(function (err, stds) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.render('assignmentor', {title: 'Students', stds: stds, ments: ments});
                        }

                    })
            }});

});


router.post('/assignmentor', function(req, res) {
    //Post our form values.
                var mentee = req.body.mentee;
                var dmentor = req.body.dmentor;
                Account.update({"_id":mentee}, {$set:{"mentor": dmentor, "assigned": true}})
                    .exec (function(err, docs){
                        if(err){
                            console.log(err);
                        }
                        else {
                            model.MenSchema.update({"_id":dmentor}, {$push: {"mentee": mentee}, $set: {"assigned": true}})
                                .exec(function(err,docs){
                        if (err) {
                                res.end("mentor assignment wasn't successful");
                            }
                            else {
                //Success !!!
                            
                            res.end('Successfully assigned mentor');

            }
        })
    }
    })
});

router.post('/assignhost', function(req, res) {
    //POST our form values.
    var student = req.body.student;
    var hostfamily = req.body.hostfamily;
    if(student){
        Account.update({"_id":student}, {$set:{"hostFamily": hostfamily}},function(err, doc){
            if (doc) {
                //if failed, return error

                res.send("Host Family assignment was successful");
            }
            else {
                //Success !!!
                res.end("Host Family assignment wasn't successful");
            }
        });
    }
    else{
        res.end("Ensure you have selected a student")
    }

});

router.get('/assignhost',loggedIn, adminLogin, function(req, res){
    model.Host.find({}, {firstName: 1 , lastName: 1 , preference: 1, address: 1, _id: 1})
        .exec(function(err, hosts){
            if(err){
                console.log(err);
            }
            else {
                Account.find({$and: [{semester: { $lt: 3}},{hostFamily: ""},{hostRequest: "Yes"}]}, {firstName: 1, lastName: 1, preference: 1, _id: 1})
                    .exec(function (err, stds) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.render('assignhost', {title: 'Assign Host', stds: stds, hosts: hosts});
                        }

                    })
            }});

});




//GET register mentor page
router.get('/registermentor', loggedIn, checkSemester, validateMentor, function(req, res, next) {

      res.render('registermentor', { user : req.user });
     });

router.post('/registermentor', function(req, res) {
    //POST our form values.
    new model.MenSchema({
        _id:        req.body.munNo,
        firstName:  req.body.firstName,
        lastName:   req.body.lastName,
        email:      req.body.email,
        major:      req.body.major,
        cellPhone:  req.body.number,
        sex:        req.body.sex,
        preference: req.body.preference,
   //     assigned: req.body.assigned

    }).save(function(err, docs){
            if (err) {
                //if failed, return error
                res.send("You are already a Mentor" );
            }
            else {
                //Success !!!
                
                res.redirect("/home");
            }
        });
});

router.get('/', function(req, res, next) {
    res.render('ghelp', { user : req.user });
});

router.get('/ghelp', function(req, res, next) {
    res.redirect("/");
});


router.post('/', passport.authenticate('local'), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect('/home');

    });
});


router.get('/viewhost', loggedIn, function(req, res) {
    if(req.user) {
        Account.findOne({_id: req.user._id}).populate('hostFamily').exec(function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.render('viewhost', {title: 'Your Host Family', data: data});
            }
        })
    }
});


router.get('/addcourse', adminLogin, function(req, res, next) {
    res.render('addcourse', { user : req.user });
});

router.post('/addcourse', function(req, res) {

    new model.Course({
        courseCode:      req.body.cCode,
        courseName:    req.body.cName,
        instructor:     req.body.instructor,
        creditUnit:        req.body.cUnit,
        term:    req.body.term
    }).save(function(err, docs){
            if (err) {
                //if failed, return error
                res.send("Oopps!!Something went wrong.Try again" );
            }
            else {
                //Success !!!
                console.log(docs);
                res.end("The Course has now been added!", docs);
            }
        });
});

router.get('/viewcourse', loggedIn, function(req,res) {
    model.Course.find({}, {courseCode: 1, courseName: 1, instructor: 1, creditUnit: 1, term: 1})
        .exec(function (err, course) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('viewcourse', {title: 'Course Information', course: course});
            }
        })
});


module.exports = router;