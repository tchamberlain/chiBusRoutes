var stopsController = require('../stops/stopsController.js');

module.exports = function ( app, express ) {

  app.get('/stops', stopsController.getStops );


};
