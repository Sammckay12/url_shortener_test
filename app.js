var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var base58 = require('./base58.js');
var cors = require('cors');

var Url = require('./models/url');

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var whitelist = [
    'http://localhost:3000',
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  console.log('res: ', res)
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ url: data.shortUrl }));
});

app.post('/api/shorten', function(req, res){
  var longUrl = req.body.url;
  var shortUrl = '';

  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      shortUrl = config.webhost + base58.encode(doc._id);
      res.send({'shortUrl': shortUrl});
    } else {
      var newUrl = Url({
        long_url: longUrl
      });

      newUrl.save(function(err) {
        if (err){
          console.log(err);
        }

        shortUrl = config.webhost + base58.encode(newUrl._id);
        res.send({'shortUrl': shortUrl});
      });
    }

  });

});

app.get('/:encoded_id', function(req, res){

  var base58Id = req.params.encoded_id;

  var id = base58.decode(base58Id);

  Url.findOne({_id: id}, function (err, doc){
    if (doc) {
      Url.updateOne({"_id" : doc.id}, {$set: {"visits" : 2 }})
      console.log(doc.visits)
      res.redirect(doc.long_url);
    } else {
      res.redirect(config.webhost);
    }
  });

});

var server = app.listen(8081, function(){
  console.log('Server listening on port 8081');
});
