var express = require('express');
var app = express();

var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/api/shorten', function(req, res){

});

app.get('/:encoded_id', function(req, res){

});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
