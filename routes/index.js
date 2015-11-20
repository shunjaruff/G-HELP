var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/profile', function(req, res) {
    res.render('profile.jade');
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

router.get('/test2', function(req, res, next) {
	  res.render('test2', { title: 'Test2' });
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
            res.redirect('/profile.jade');
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


module.exports = router;
