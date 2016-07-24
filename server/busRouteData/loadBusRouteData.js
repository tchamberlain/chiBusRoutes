var db = require( '../config/db' );
var request = require('request');
var Stop = require( '../stops/stops' );
var Route = require( '../routes/routes' );

getBusRouteData();




function storeBusRouteData( data ){
  var i = 0;
  for(var i = 0; i<data.length; i++){
      createBusStopEntry(data[i]);
  }
}

function createBusStopEntry(currStop){
  console.log(' ****************** stop, ',currStop.stop_id);
  console.log('------>all routes', currStop.routes);

  // create the STOP table entry
  Stop.create( {
    alightings : currStop.alightings,
    boardings : currStop.boardings,
    cross_street : currStop.cross_street,
    on_street : currStop.on_street, 
    lat : currStop.location.coordinates[1],
    lng : currStop.location.coordinates[0],
    stop : currStop.stop_id
  } )
  .then(function(stop){
    // if there's only one route, its not in an arr
    // for consistency, we'll make it into an arr
    if( !Array.isArray(currStop.routes) ){
      currStop.routes = [ currStop.routes ];
    }
    // create ROUTE table entry
    for( var j = 0; j < currStop.routes.length; j ++ ){
      console.log('^^^^^^^^^ loop j, route', j , currStop.routes[j]);
      Route.create( {
        route : currStop.routes[j],
      } )
      .then(function( route ){
        stop.addRoute(route);
      });
    }
  });    
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