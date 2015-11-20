var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
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
        res.redirect('/ghelp');
    }
}

/**router.get('/regmentor', loggedIn, function(req, res, next) {
	  res.render('regmentor', { user : req.user });
     });*/
router.get('/profile', function(req, res) {
    res.render('profile');
});

router.get('/ghelp', function(req, res, next) {
  res.render('ghelp', { title: 'G-HELP' });
});
router.get('/regmentor', function(req, res, next) {
	  res.render('regmentor', { title: 'Register Mentor' });
	});

router.get('/regstud', function(req, res, next) {
    res.render('regstud', { title: 'Register Student' });
});

router.get('/addevent', function(req, res, next) {
	  res.render('addevent', { title: 'Add Event' });
	});
router.get('/assignmentor', function(req, res, next) {
	var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
	  res.render('assignmentor', {
            "userlist" : docs
        });
    });
});
router.get('/test', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
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




/* POST to Add User Service */
router.post('/regmentor', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var major = req.body.major;
    var email = req.body.email;
    var mobileNo = req.body.mobile;
    var preference = req.body.preference;
    var sex = req.body.sex;
    

    // Set our collection
    var collection = db.get('mentor');

    // Submit to the DB
    collection.insert({
        "firstName" : firstName,
        "lastName" : lastName,
        "major" : major,
        "email" : email,
        "mobile" : mobileNo,
        "preference" : preference,
        "sex" : sex
        
        
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.send('Registration Successful!');
        }
    });
});

router.post('/regstud', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var major = req.body.major;
    var email = req.body.email;
    var mobileNo = req.body.mobile;
    var preference = req.body.preference;
    var sex = req.body.sex;


    // Set our collection
    var collection = db.get('student');

    // Submit to the DB
    collection.insert({
        "firstName" : firstName,
        "lastName" : lastName,
        "major" : major,
        "email" : email,
        "mobile" : mobileNo,
        "preference" : preference,
        "sex" : sex


    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect('/profile');
        }
    });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res, next) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
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