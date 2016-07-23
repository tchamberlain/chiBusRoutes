var Sequelize = require( 'sequelize' );
var db = new Sequelize( 'test1', null, null, {
  dialect: 'sqlite',

  define: {
    underscored: false,
    timestamps: false
  },

  storage: './server/busRouteData/busRouteData.sqlite'
});

module.exports = db;
