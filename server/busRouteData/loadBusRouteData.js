var db = require( '../config/db' );
var request = require('request');

getBusRouteData();

function getBusRouteData(){
  var url = 'https://data.cityofchicago.org/resource/5eg2-c264.json';
  request(url, function (err, response, body) {
    if(err){
      console.log('There was an error:', err );
    } else {
      storeBusRouteData( JSON.parse(body) );
    }
  });
}

function storeBusRouteData( data ){
  for(var i = 0; i < data.length; i++){
    createStopEntry(data[i]);
  }
}

function createStopEntry(currStop){
  var alightings = currStop.alightings;
  var boardings = currStop.boardings;
  var cross_street = currStop.cross_street.replace('"',"'").replace('"',"'");; // making quotes uniform
  var on_street = currStop.on_street.replace('"',"'").replace('"',"'");; // making quotes uniform
  var lat = currStop.location.coordinates[1];
  var lng = currStop.location.coordinates[0];
  var stop_id = currStop.stop_id;

  sqlRequest = 'INSERT INTO "stops" (alightings, boardings,cross_street,on_street,lat,lng,stop_id) ' +
            'VALUES("' + alightings + '", "' 
                       + boardings + '", "' 
                       + cross_street + '", "' 
                       + on_street + '", "' 
                       + lat + '", "' 
                       + lng + '", "' 
                       + stop_id 
                       + '")'
  db.run(sqlRequest, function(err) {
    if(err !== null) {
     console.log(cross_street);
      console.log('ERROR',err);
    } else {
      if(currStop.routes){
        // turn the list into an array
        currStop.routes =  (currStop.routes).split(',');
        for(var i = 0; i < currStop.routes.length;  i++){
          createRouteStopEntry( currStop.routes[i], stop_id );
        }
      }
    }
  });
}

function createRouteStopEntry( route_name, stop_id ){
  sqlRequest = "INSERT INTO 'route_stop' ( route_name, stop_id ) " +
              "VALUES('"+ route_name + "', '"
                        + stop_id  +
               "')"
    db.run(sqlRequest, function(err) {
    if(err !== null) {
     console.log('ERROR',err);
    }
  });
}