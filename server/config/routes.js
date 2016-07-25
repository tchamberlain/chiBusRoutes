var db = require( './db' );
module.exports = function ( app, express ) {

  app.get('/stops', getStops );

  function getStops(req, res){
    db.all("SELECT * FROM stops", function(err,rows){
      if(err){
        res.send( err );
      } else{
        console.log(rows[0]);
        res.send( rows );
      }
    });
  }

};
