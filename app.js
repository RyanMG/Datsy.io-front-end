//////////////////////////////////////////
///
/// DATSY.io
///
//////////////////////////////////////////

// Instantiate server
var express = require('express'),
    sass = require('node-sass'),
    http = require('http'),
    path = require('path');
 
var app = express();

var controllers = require('./server/controllers');
var middleware = require('./server/middleware');

// set middleware
middleware.settings(app, express);

controllers.route(app);
 
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
