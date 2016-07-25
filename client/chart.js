  

getStopsOnRoute();
getRoutesOnStop();

function getStopsOnRoute( error, chicago, blocks ){
  return $.ajax({
    url: 'http://localhost:8000/stops/routes',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('stops/routes',data);
    },
    error: function (data) {
      console.error('An error retrieving /stops/routes data occured');
    }
  });
}

function getRoutesOnStop( error, chicago, blocks ){
  return $.ajax({
    url: 'http://localhost:8000/routes/stops',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('_----/routes/stops',data);
      // makeChart(data);
    },
    error: function (data) {
      console.error('An error retrieving /routes/stops data occured');
    }
  });
}
