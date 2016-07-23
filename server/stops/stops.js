var db = require( '../config/db' );
var Sequelize = require( 'sequelize' );

var Stop = db.define( 'stops', {
  alightings : Sequelize.INTEGER,
  boardings : Sequelize.INTEGER,
  cross_street : Sequelize.STRING,
  on_street : Sequelize.STRING, 
  lat : Sequelize.INTEGER,
  lng : Sequelize.INTEGER,
  stop_id : Sequelize.INTEGER
} );

Stop.sync().then( function() {
  console.log( "Stops table created" );
} )
.catch( function( err ) {
  console.error( err );
} );

module.exports = Stop;
