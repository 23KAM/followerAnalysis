var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

  res.render('index', {
    pageTitle: 'Follower Analysis',
    pageMessage: 'Enter a twitter handle to begin'
  });
});

router.get('/err', function(req, res) {
  res.render('index', {
    pageTitle: 'Follower Analysis',
    pageMessage: 'Something went wrong, try again'
  });
});

module.exports = router;
