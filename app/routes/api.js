var express = require('express');
var router = express.Router();
var twitter = require('twitter');

var consumer_key = process.env.CK;
var consumer_secret = process.env.CS;
var access_key = process.env.AK;
var access_secret = process.env.AS;

var client = new twitter({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token_key: access_key,
  access_token_secret: access_secret
});

router.get('/:handles', function(req, res) {
  var handles = req.params.handles.split(",");
  var result = [];
  var cols = ["Name", "Followers", "Following", "Tweets", "Bio"]

  handles.forEach(function (handle) {
    client.get("users/show", {screen_name: handle}, function (error, data, raw) {
      var data_obj = {};
      cols.forEach(function (col) {
        if (col===cols[0]) {
          data_obj[col] = data.name;
        } else if (col==cols[1]) {
          data_obj[col] = data.followers_count
        } else if (col==cols[2]) {
          data_obj[col] = data.friends_count
        } else if (col==cols[3]) {
          data_obj[col] = data.statuses_count
        } else if (col==cols[4]) {
          data_obj[col] = data.description
        }
      });
      result.push(data_obj);

      if (result.length === handles.length) {
        res.render('api', {
          pageTitle: "Analysis Results",
          data: result,
          columns: cols
        });
      }// return result after on the last call
    });
  });

});

module.exports = router;
