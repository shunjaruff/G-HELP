var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/ghelp', function(req, res, next) {
  res.render('ghelp', { title: 'G-HELP' });
});
router.get('/registermentor', function(req, res, next) {
	  res.render('registermentor', { title: 'Register Mentor' });
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
router.post('/registermentor', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var firstName = req.body.givenname;
    var lastName = req.body.surname;
    var major = req.body.major;
    var userEmail = req.body.email;
    var cellPhone = req.body.cellphone;
    var preference = req.body.preference;
    var sex = req.body.optionsRadios;
    

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "firstname" : firstName,
        "lastname" : lastName,
        "major" : major,
        "email" : userEmail,
        "phone" : cellPhone,
        "preference" : preference,
        "sex" : sex
        
        
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.send("Registeration successfull!");
        }
    });
});


module.exports = router;
