// var mapUtils = require( './mapUtils.js' );
// import * as mapUtils from 'mapUtils';

// var dataService = require( './dataService.js' );
(function() {
  var width = 1000,
      height = 868;

  var projection = d3.geo.albers()
      .rotate([87.73, 0])
      .center([0, 42.0433])
      .scale(120000)
      .translate([width / 2, 0]);

  var svg = d3.select(".g-chart").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(-25,-30)");

  var path = d3.geo.path()
      .projection(projection);

  queue()
      .defer(d3.json, "https://static01.nyt.com/newsgraphics/2012/12/31/chicago-homicides/acae5cd811293b922d4a1c54968858f8c1a379dc/chicago.json")
      .defer(d3.tsv, "https://static01.nyt.com/newsgraphics/2012/12/31/chicago-homicides/acae5cd811293b922d4a1c54968858f8c1a379dc/block-groups.tsv")
      .await(getData);

  function getData( error, chicago, blocks ){
    return $.ajax({
      url: '/stops',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
       ready( error, chicago, blocks, data )
      },
      error: function (data) {
        console.error('An error retrieving route data occured');
      }
    });
  }
  function ready(error, chicago, blocks, data) {

    // set up chicago  base image 
    setUpChicagoBaseImage( svg, path, chicago, blocks );



    data.forEach(function(d) {
      var p = projection([+d.lng, +d.lat]);
      d['0'] =  p[0];
      d['1'] =  p[1];
    });

    // add data points to the map
    var dataPoints = svg.append("g")
        .attr("class", "g-dataPoints")
      .selectAll("circle")
      .data(data).enter()
      .append("circle")
      .attr("cx", function (d) {  return d['0']; })
      .attr("cy", function (d) { return d['1']; })
      .attr("r", setPointSize ) // change size based on boardings
      .attr("fill", setPointColor )// change color based on boardings
      .on('mouseover', function(d){
          // change the point's color to black
          d3.select(this)
            .attr("stroke","black")
            .attr("stroke-width",4)

          //unhide the info legend
          svg.selectAll("rect")
            .style("opacity", 1)
            .attr("fill", setPointColor(d));

          // make stopInfo show this points data
          svg.selectAll(".alightingsText")
            .text('Alightings: ' + d.alightings);
          svg.selectAll(".streetsText")
            .text(d.cross_street + ' & ' +d.on_street);
          svg.selectAll(".boardingsText")
          .text('Boardings: ' + d.boardings);
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .attr("stroke",null)
      });

      // add labels to neighborhoods
      addDistrictLabels( svg, path );

    // Create the legend that shows boardings and alightings for each point
    var stopInfo = svg.append("g")
        .attr("class", "stopInfo")
        .attr("transform", "translate(" + (width - 200) + ",300)")
        .attr("class", "g-legend")

    stopInfo.append("rect")
      .attr("transform", "translate(0,-100)")
      .attr("width", 200)
      .attr("height", 150)
      .attr("fill", '#F5F5F5')
      .attr("border",1)
      .style("opacity", 0);

    stopInfo.append("text")
      .attr("class", "streetsText")
      .attr("y", -40)
      .attr("x", 8)

    stopInfo.append("text")
      .attr("class", "boardingsText")
      .attr("y", -20)
      .attr("x", 8)
      .attr("fill", "white")
      .style("font-weight", "bold")

    stopInfo.append("text")
      .attr("class", "alightingsText")
      .attr("y", 0)
      .attr("x", 8)
      .attr("fill", "white")
      .style("font-weight", "bold")
  }

// test!!!
  var boardingsLegend = svg.append("g")
      .attr("transform", "translate(" + (width - 200) + ",58)")
      .attr("class", "g-legend");

  boardingsLegend.append("text")
      .attr("y", -16)
      .attr("x", -100)
      .style("font-weight", "bold")
      .text("Average weekday boardings by bus stop");

  var boardingsKey = boardingsLegend.selectAll(".g-key")
    .data([{space: 90, boardings: 3000}, {space: 20, boardings: 2000}, {space: -50, boardings: 800}])
    .enter().append("g")
    .attr("class", "g-key");

  boardingsKey.append("circle")
      .attr("class", "g-homicide")
      .attr("cx", function(d) { return d.space; })
      .attr("cy", function(d) { return 3; })
      .attr("r", setPointSize)
      .attr("fill", setPointColor);

  boardingsKey.append("text")
      .attr("x", function(d) { return d.space - 20 })
      .attr("dy", ".35em")
      .attr("y", function(d) { return 30; })
      .text(function(d) { return d.boardings + ' ppl'; });

  })()






