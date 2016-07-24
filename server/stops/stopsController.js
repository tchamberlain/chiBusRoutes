var Stop = require( './stops' );
var Route = require( '../routes/routes' );

module.exports = {
  getStops: function (request, response) {

    Stop.findAll({
      include: [{
          model: Route
      }]
  })
  .then(function ( stops ) {
        if (!stops) {
          response.send(400);
        } else {
          response.json( stops );
        }
      });
  }

};
