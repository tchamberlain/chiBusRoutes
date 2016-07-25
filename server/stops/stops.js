// var db = require( '../config/db' );
// var Sequelize = require( 'sequelize' );
// var Route = require( '../routes/routes' );

// var Stop = db.define( 'Stop', {
//   alightings : Sequelize.INTEGER,
//   boardings : Sequelize.INTEGER,
//   cross_street : Sequelize.STRING,
//   on_street : Sequelize.STRING, 
//   lat : Sequelize.INTEGER,
//   lng : Sequelize.INTEGER,
//   stop : Sequelize.INTEGER
// } );

// Stop.sync().then( function() {
//   console.log( "Stops table created" );
// } )
// .catch( function( err ) {
//   console.error( err );
// } );

// Stop.belongsToMany(Route,  {through: 'Route_Stop'});
// Route.belongsToMany(Stop, {through: 'Route_Stop'});

// db.sync()
// module.exports = Stop;
