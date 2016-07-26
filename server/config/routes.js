var db = require( './db' );
module.exports = function ( app, express ) {

  app.get('/stops', getStops );
  app.get('/routes/stops', getRoutesOnStop );
  app.get('/stops/routes', getStopsOnRoute );

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

  function getRoutesOnStop(req, res){
    db.all("SELECT *,  COUNT(*) FROM   stops JOIN   route_stop ON route_stop.stop_id = stops.stop_id JOIN   routes on route_stop.route_id = routes.route_id GROUP BY stops.stop_id;", 
      function(err,rows){
      if(err){
        res.send( err );
      } else{
        console.log(rows[0]);
        res.send( rows );
      }
    });
  }

  function getStopsOnRoute(req, res){
    db.all("SELECT *,  COUNT(*) FROM   routes JOIN   route_stop ON route_stop.route_id = routes.route_id JOIN   stops on route_stop.stop_id = stops.stop_id GROUP BY routes.route_name ORDER BY COUNT(*) ASC;",
     function(err,rows){
      if(err){
        res.send( err );
      } else{
        console.log(rows[0]);
        res.send( rows );
      }
    });
  }

};
