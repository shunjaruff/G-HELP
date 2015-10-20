var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/ghelp', function(req, res, next) {
  res.render('ghelp', { title: 'G-HELP' });
});

module.exports = router;
