var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var base58 = require('./base58.js');
var cors = require('cors');
require('dotenv').config()

var Url = require('./models/url');

const mongoUrl= process.env.MONGO_URL
mongoose.connect('mongodb://sammckay12:arsenal12@ds149040.mlab.com:49040/url_shortener_test');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.get('/', function(req, res){
  console.log('res: ', res)
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ url: data.shortUrl }));
});

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

app.post('/api/shorten', function(req, res){
  console.log('the body: ',req.body)
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
      res.redirect(doc.long_url);
    } else {
      res.redirect(config.webhost);
    }
  });

});

var server = app.listen(process.env.PORT || 8081);
