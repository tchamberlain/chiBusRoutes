var db = require( './db' );
module.exports = function ( app, express ) {

  app.get('/stops', getStops );
  app.get('/stops/routes', getStopsOnRoute );
  // app.get('/routes/stops', getRoutesOnStop );

  function getStops(req, res){
    db.all("SELECT * FROM stops", function(err,rows){
      if(err){
        res.send( err );
      } else{
        res.send( rows );
      }
    });
  }

  function getStopsOnRoute(req, res){
    db.all("SELECT *,  COUNT(*) FROM   stops JOIN   route_stop ON route_stop.stop_id = stops.stop_id GROUP BY route_stop.route_name ORDER BY COUNT(*) ASC;",
     function(err,rows){
      if(err){
        res.send( err );
      } else{
        res.send( rows );
      }
    });
  }

  // function getRoutesOnStop(req, res){
  //   db.all("SELECT *,  COUNT(*) FROM   stops JOIN   route_stop ON route_stop.stop_id = stops.stop_id JOIN   routes on route_stop.route_id = routes.route_id GROUP BY stops.stop_id ORDER BY COUNT(*) ASC;", 
  //     function(err,rows){
  //     if(err){
  //       res.send( err );
  //     } else{
  //       res.send( rows );
  //     }
  //   });
  // }

};
