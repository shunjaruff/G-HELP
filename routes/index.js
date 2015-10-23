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
	  res.render('assignmentor', { title: 'Assign Mentor' });
	});
router.get('/test', function(req, res, next) {
	  res.render('test', { title: 'Test' });
	});

module.exports = router;
