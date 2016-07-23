var db = require( '../config/db' );
var Sequelize = require( 'sequelize' );
var Stop = require( '../stops/stops' );

var Route_Stop = db.define( 'Route_Stop', {
  stop_id : Sequelize.INTEGER,
  route_id : Sequelize.INTEGER
} );

Route_Stop.sync().then( function() {
  console.log( "Route_Stop table created" );
} )
.catch( function( err ) {
  console.error( err );
} );

module.exports = Route_Stop;
