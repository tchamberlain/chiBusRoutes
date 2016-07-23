var express = require( 'express' );
var db = require( './config/db' );
var app = express();

var http = require( 'http' ).Server( app );
var User = require( './users/users' );
var Stop = require( './stops/stops' );
var Route_Stop = require( './route_stop/route_stop' );

var PORT = 8000;

require( './config/middleware' )( app, express );
require( './config/routes' )( app, express );

http.listen( process.env.PORT || PORT );
console.log( 'Listening on port ' + PORT );

module.exports = app;
