var db = require( '../config/db' );
var request = require('request');
var Stop = require( '../stops/stops' );
var Route_Stop = require( '../route_stop/route_stop' );

getBusRouteData();

function storeBusRouteData( data ){
  for(var i = 0; i < data.length; i++){
    console.log(i);
    var currStop = data[i];

    // create the STOP table entry
    Stop.create( {
      alightings : currStop.alightings,
      boardings : currStop.boardings,
      cross_street : currStop.cross_street,
      on_street : currStop.on_street, 
      lat : currStop.location.coordinates[1],
      lng : currStop.location.coordinates[1],
      stop_id : currStop.stop_id
    } )
    
    // if there's only one route, its not in an arr
    // for consistency, we'll make it into an arr
    if( !Array.isArray(currStop.routes) ){
      currStop.routes = [ currStop.routes ];
    }

    // create ROUTE_STOP table entry
    for( var j = 0; j < currStop.routes.length; j ++ ){
      console.log(currStop.stop_id, currStop.routes[j]);
      Route_Stop.create( {
        route_id : currStop.routes[j],
        stop_id : currStop.stop_id
      } )
    }

  }
}

function getBusRouteData(){
  var url = 'https://data.cityofchicago.org/resource/5eg2-c264.json';
  //var d = Q.defer();
  request(url, function (err, response, body) {
    if(err){
      console.log('There was an error:', err );
    } else {
      storeBusRouteData( JSON.parse(body) );
    }
  });
}
