var API = require('screninvader.js');
var config = require('./config');

module.exports = new API(config.socket_uri);
