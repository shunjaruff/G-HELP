var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var model = require('../models.js');
var router = express.Router();

/* GET home page. */
router.get('/ghelp', function(req, res, next) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
  res.render('ghelp', { user : req.user });
});


router.post('/ghelp', passport.authenticate('local'), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/test2');

    });
});

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
        res.send('You need to be logged in to access this page');
    }
}

function checkSemester(req, res, next) {
    if (req.user.semester>2) {
        next();
    } else {
        res.send('You are not eligible to be a Mentor');
    }
}

router.get('/regmentor', function(req, res, next) {


	  res.render('regmentor', { user : req.user });
     });

router.get('/home', function(req, res, next) {

  if (req.user.username=='admin@mun.ca') {
      res.render('adminhome', { user : req.user })
  }
  else {
    res.render('studenthome', { user : req.user })
  }
     });


router.post('/regmentor', function(req, res) {

    new model.MenSchema({
        ment_id:        req.body.munNo,
        firstName:  req.body.firstName,
        lastName:   req.body.lastName,
        email:      req.body.email,
        major:      req.body.major,
        cellPhone:  req.body.number,
        sex:        req.body.sex,
        preference: req.body.preference,
        assigned: req.body.assigned,
        


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
//duplicating
router.get('/registermentor', loggedIn, checkSemester, function(req, res, next) {

      res.render('registermentor', { user : req.user });
     });

router.post('/registermentor', function(req, res) {

    new model.MenSchema({
        ment_id:        req.body.munNo,
        firstName:  req.body.firstName,
        lastName:   req.body.lastName,
        email:      req.body.email,
        major:      req.body.major,
        cellPhone:  req.body.number,
        sex:        req.body.sex,
        preference: req.body.preference,
        assigned: req.body.assigned,
        


    }).save(function(err, docs){
            if (err) {
                //if failed, return error
                res.send(err);
            }
            else {
                //Success !!!
                res.redirect("ghelp");
                res.end("Thank you for your registration");
            }
        });
});




router.get('/profile', function(req, res) {
    res.render('profile');
});

router.get('/ghelp', function(req, res, next) {
  res.render('ghelp', { title: 'G-HELP' });
});


router.get('/regstud', function(req, res, next) {
    res.render('regstud', { title: 'Register Student' });
});

router.get('/addevent', function(req, res, next) {
	  res.render('addevent', { title: 'Add Event' });
	});

router.get('/assignmentor', function(req, res){
 //   var db = req.db;
 //   var collection = db.get('mentor');
   // model.MenSchema.find().setOptions({sort: 'major'})
    model.MenSchema.find({}, {firstName: 1 , lastName: 1 , preference: 1, ment_id: 1})
    .exec(function(err, ments){
            if(err){
                console.log(err);
            }
        else {
                Account.find({semester: { $lt: 3 }}, {firstname: 1, lastname: 1, preference: 1, std_id: 1})
                    .exec(function (err, stds) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.render('assignmentor', {title: 'Mentor Assignment', stds: stds, ments: ments});
                        }

                    })
            }});

});


router.get('/test', function(req, res) {
    var db = req.db;
    var collection = db.get('accounts');
    collection.find({},{},function(e,docs){
        res.render('test', {
            "userlist" : docs
        });
    });
});

router.get('/test2', loggedIn, function(req, res, next) {
	  res.render('test2', { user : req.user });
	});
router.get('/hostfamily', function(req, res, next) {
	  res.render('hostfamily', { title: 'Host a student' });
	});







router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res, next) {
    Account.register(new Account({ username : req.body.username, std_id : req.body.munNo,
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                program : req.body.progtype,
                semester: req.body.semester,
                mobile : req.body.mobile,
                sex : req.body.sex,
                preference: req.body.preference,
                image: req.body.image,
                assigned: req.body.assigned,
                ment_id: req.body.ment_id,
                assignedfamily: req.body.assignedfamily }), req.body.password, function(err, account) {
        if (err) {
          return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.send('success');
            });
        });
    });
});


router.get('/test', function (req, res) {
        dbName.open(function (error, client) {
            var collection = new mongodb.Collection(client, 'usercollection');
            collection.find().limit(300).toArray(function (err, dataObjArr) {
                var data = '';
                var dataArr = [];
                var i = dataObjArr.length;
                //check for error
                if(err){return res.end('error!'+err);}
                //Data
                if (dataObjArr) {
                    while(i--){
                        dataArr[i] = dataObjArr[i]._id;
                    }
                    data = dataArr.join(' ');
                    res.render('test', { returnedData : data });
                }else{
                    res.end();
                }
            });
        });
    });


module.exports = router;