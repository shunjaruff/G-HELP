var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var model = require('../models.js');
var router = express.Router();
var multer          =       require('multer');
var upload      =   multer({ dest: './uploads/'});

/* GET home page. */




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

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/ghelp');
    }
}

function adminLogin(req, res, next) {
    if (req.user.username=='admin@mun.ca') {
        next();
    } else {
        res.redirect('/home');
    }
}

function profilePicture(req, res, next) {
    if (req.user) {
        var a=req.user.firstName;
        var b=a+".png,.jpg";
        var pic='images/'+b;

        next();
    } 
}

function checkSemester(req, res, next) {
    if (req.user.semester>3) {
        next();
    } else {
        res.send('You are not eligible to be a Mentor');
    }
}

router.get('/picture', profilePicture, function(req, res, next) {


      res.render('picture', { user : req.user });
     });

router.get('/regmentor', function(req, res, next) {


	  res.render('regmentor', { user : req.user });
     });

router.get('/home', loggedIn, function(req, res, next) {

  if (req.user.username=='admin@mun.ca') {
      res.render('adminhome', { user : req.user })
  }
  else {
    res.render('studenthome', { user : req.user })
  }
     });

router.get('/profile', function(req, res) {
    res.render('profile');
});

router.get('/ghelp', function(req, res, next) {
    res.render('ghelp', { user : req.user });
});


router.get('/test', function(req, res, next) {
    res.render('test', { user : req.user });
});



router.get('/addevent', adminLogin, function(req, res, next) {
    res.render('addevent', { user : req.user });
});




router.get('/hostfamily', function(req, res, next) {
    res.render('hostfamily', { title: 'Host a student' });
});

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
            res.send("Mentor registration wasn't successful");
        }
        else {
            //Success !!!
            res.end("Thank you for your registration");
        }
    });
});


router.get('/register', function(req, res) {
    res.render('register', { });   
});





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
                
                res.redirect('/register/picture');
            });
        });
    });
});


router.get('/viewmentor',loggedIn, function(req, res) {
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

router.get('/assignmentor', loggedIn, adminLogin, function(req, res){
    //   var db = req.db;
    //   var collection = db.get('mentor');
    // model.MenSchema.find().setOptions({sort: 'major'})
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


/**
router.post('/regmentor', function(req, res) {

    new model.MenSchema({
        ment_id:    req.body.munNo,
        firstName:  req.body.firstName,
        lastName:   req.body.lastName,
        email:      req.body.email,
        major:      req.body.major,
        cellPhone:  req.body.number,
        sex:        req.body.sex,
        preference: req.body.preference,
        assigned:   req.body.assigned,
        


    }).save(function(err, docs){
            if (err) {
                //if failed, return error
                res.send("Mentor registration wasn't successful");
            }
            else {
                //Success !!!
                res.redirect("ghelp");
                res.end("Thank you for your registration");
            }
        });
});
 */

//duplicating
router.get('/registermentor', loggedIn, checkSemester, function(req, res, next) {

      res.render('registermentor', { user : req.user });
     });

router.post('/registermentor', function(req, res) {

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
                
                res.end("Thank you for your registration");
            }
        });
});



router.post('/ghelp', passport.authenticate('local'), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/home');

    });
});




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








router.post('/assignmentor', function(req, res) {
    //Get our form values.
                var mentee = req.body.mentee;
                var dmentor = req.body.dmentor;
                if(mentee){
                    Account.update({"_id":mentee}, {$set:{"mentor": dmentor, "assigned": true}},function(err, doc){
                        if (doc) {
                            //if failed, return error

                            res.send("Mentor registration was successful");
                        }
                        else {
                //Success !!!
                res.end("mentor assignment wasn't successful");
            }
        });
    }
    else{
        res.end("Ensure you have selected a student")
    }

});


router.get('/assignhost', function(req, res){
    model.Host.find({}, {firstName: 1 , lastName: 1 , preference: 1, address: 1, _id: 1})
        .exec(function(err, hosts){
            if(err){
                console.log(err);
            }
            else {
                Account.find({$and: [{semester: { $lt: 3}},{hostFamily: ""}]}, {firstName: 1, lastName: 1, preference: 1, _id: 1})
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


router.post('/assignhost', function(req, res) {
    //Get our form values.
    var student = req.body.student;
    var hostfamily = req.body.hostfamily;
    if(student){
        Account.update({"_id":student}, {$set:{"hostFamily": hostfamily}},function(err, doc){
            if (doc) {
                //if failed, return error

                res.send("Mentor registration was successful");
            }
            else {
                //Success !!!
                res.end("mentor assignment wasn't successful");
            }
        });
    }
    else{
        res.end("Ensure you have selected a student")
    }

});




module.exports = router;