var express = require('express');
var app = express();
var io = require('socket.io')();

app.set('port', process.env.PORT || 3000 );
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.locals.siteTitle = 'Follower Analysis';
app.locals.io = io;

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/api'));

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});

io.attach(server);
io.on('connection', function(socket) {
  console.log('User connected');
  socket.on('disconnected', function(){
    console.log('User disconnected');
  });
});
