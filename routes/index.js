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

router.get('/registermentor', loggedIn, function(req, res, next) {
	  res.render('registermentor', { user : req.user });
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
