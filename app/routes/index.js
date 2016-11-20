var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

  res.render('index', {
    pageTitle: 'Follower Analysis',
  });
});

module.exports = router;
