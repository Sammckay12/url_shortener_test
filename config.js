var config = {};
const ENV = 'PROD'

config.db = {};
config.webhost = ENV === 'DEV' ? 'http://localhost:3000/' : 'https://node-spikely.herokuapp.com/'

config.db.host = 'localhost';
config.db.name = 'url_shortener';

module.exports = config;
