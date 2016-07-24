var db = require( '../config/db' );
var Sequelize = require( 'sequelize' );
var Stop = require( '../stops/stops' );

var Route = db.define( 'Route', {
  route : Sequelize.INTEGER
} );

Route.sync().then( function() {
  console.log( "Route table created" );
} )
.catch( function( err ) {
  console.error( err );
} );

module.exports = Route;
