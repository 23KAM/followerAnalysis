var express = require("express");
var router = express.Router();
var twitter = require("twitter");
var sleep = require("sleep");

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

router.get("/api/:handle", function(req, res) {
  var handle = req.params.handle;

  var opts = {
    screen_name: handle,
    cursor: "",
    stringify_ids: true,
    count: 5000
  };

  client.get("users/lookup", {screen_name: handle}, function (err, data, raw) {

    if(typeof data !== "undefined" && data.length>0) {

      req.app.locals.io.emit("setUpdateText", {
        text: `Collecting twitter data for handle: ${data[0].name}`,
        num_follows: data[0].followers_count
      });

      setTimeout(function () {
        collectTwitterIds(req,opts,data[0]);
      }, 0);

    } else {
      setTimeout(function () {
        console.log("Something went wrong, returning home...")
        req.app.locals.io.emit("returnHome");
      }, 0);
    }
  });

  res.render("api", {
    pageTitle: "Analysis Results",
    twitterHandle : handle
  });

});


module.exports = router;

function collectTwitterIds(req, opts, user) {

  opts.cursor = "-1";
  var res = [];

  console.log("Collecting twitter ids");

  client.get("followers/ids", opts, function (err, data, raw) {
    getIds(data,req,res,user,opts);
  });

}

function getIdString(ids) {

  var sub_id_list = [];
  var i = 0;
  for (i = 0; i < 100; i++) {
    if (ids.length > 0) {
      sub_id_list.push(ids.pop());
    }
  }
  return sub_id_list.join(",");

}

function getUsers(users, req, res, data, user, opts) {

  for (var u = 0; u < users.length; u++) {
    var user_obj = {
      Name: users[u].name,
      ScreenName: users[u].screen_name,
      Followers: users[u].followers_count,
      Following: users[u].friends_count,
      Tweets: users[u].statuses_count,
      Bio: users[u].description,
      GeoLocation: users[u].location,
      TimeZone: users[u].time_zone,
      CreatedDate: users[u].created_at,
      TimeZone: users[u].time_zone,
      Favourites: users[u].favourites_count,
      Website: users[u].url,
      ListCount: users[u].listed_count,
      Language: users[u].lang,
      Protected: users[u].protected,
      GeoEnabled: users[u].geo_enabled,
      Verified: users[u].verified
    };
    res.push(user_obj);
  }

  setTimeout(function() {
    req.app.locals.io.emit("updateData", {data:res});
  }, 0);

  setTimeout(function() {
    req.app.locals.io.emit("setUpdateText", {
      text: `Still getting the data for ${user.name}`,
      num_follows: (user.followers_count - res.length)
    });
  }, 0);

  if (res.length >= user.followers_count) {
    return;
  }

  if (data.ids.length > 0) {

    setTimeout(function() {

      client.get("users/lookup", {
        user_id: getIdString(data.ids),
        include_entities:false
      }, function (err, users, raw) {
        getUsers(users, req, res, data, user, opts);
      });
    }, 10000);

  } else {

    setTimeout(function() {
      req.app.locals.io.emit("setUpdateText", {
        text: `Still getting the data for ${user.name}`,
        num_follows: (user.followers_count - res.length)
      });
    }, 0);

    if (users.next_cur_str!=="0") {
      opts.cursor = data.next_cur_str;
      client.get("followers/ids", opts, function (err, data, raw) {
        getIds(data,req,res, user, opts);
      });
    }
  }
}

function getIds(data, req, res, user, opts) {

  if (res.length >= user.followers_count) {
    return;
  }

  if (typeof data.ids !== "undefined") {
    client.get("users/lookup", {
      user_id: getIdString(data.ids),
      include_entities:false
    }, function (err, users, raw) {
      getUsers(users, req, res, data, user, opts);
    });

  } else {

    console.log("Something has gone wrong, calling function again in 2 mins secs");

    setTimeout(function () {
      req.app.locals.io.emit("setUpdateText", {
        text: "Twitter API rate exceeded, follower download paused...",
        num_follows: (user.followers_count - res.length)
      });
    },0);

    setTimeout(function() {
      client.get("followers/ids", opts, function (err, data, raw) {
        getIds(data, req, res, user, opts);
      });
    }, 120000);

  }
}
