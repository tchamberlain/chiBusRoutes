var Stop = require( './stops' );

module.exports = {
  getStops: function (request, response) {

    Stop.findAll()
      .then(function ( stops ) {
        if (!stops) {
          response.send(400);
        } else {
          response.json( stops );
        }
      });
  }

};
