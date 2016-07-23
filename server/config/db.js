var Sequelize = require( 'sequelize' );
var db = new Sequelize( 'chiBusRoutes', null, null, {
  dialect: 'sqlite',

  define: {
    underscored: false,
    timestamps: false
  },

  storage: './server/busRouteData/chiBusRoutes.sqlite'
});

module.exports = db;
