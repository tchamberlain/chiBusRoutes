(function() {
  var width = 1000,
      height = 868;

  var projection = d3.geo.albers()
      .rotate([87.73, 0])
      .center([0, 42.0433])
      .scale(120000)
      .translate([width / 2, 0]);

  var svg = d3.select(".map").append("svg")
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

    addProjectionsToPoints( data, projection );

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
            .text('Alightings: ' + d.alightings + ' people');
          svg.selectAll(".streetsText")
            .text(d.cross_street + ' & ' +d.on_street);
          svg.selectAll(".boardingsText")
          .text('Boardings: ' + d.boardings  + ' people');
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .attr("stroke",null)
      });

    // add labels to neighborhoods
    addDistrictLabels( svg, path );

    // Create the info box that shows boardings and alightings for each point
    createStopInfo( svg, width );

    // Create the legend that explains what size & color of points on map mean
    createBoardingsLegend( svg, width );
   
  }

})()






