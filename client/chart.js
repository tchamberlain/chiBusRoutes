  

// getRoutesOnStop();
getStopsOnRoute();


function getStopsOnRoute( error, chicago, blocks ){
  return $.ajax({
    url: 'http://localhost:8000/stops/routes',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      // makes sure that we rename the count, to something more intuitive
      data.forEach(function(x){
        x.count = x['COUNT(*)'];
      });
      makeChart( data );

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
      data.forEach(function(x){
        x.count = x['COUNT(*)'];
      });
      makeChart( data.slice(data.length-30));
    },
    error: function (data) {
      console.error('An error retrieving /routes/stops data occured');
    }
  });
}


  function makeChart( dataset ){
    var w = 1000;
    var h = 450;

    var xScale = d3.scale.ordinal()
            .domain(d3.range(dataset.length))
            .rangeRoundBands([0, w], 0.05); 

    var yScale = d3.scale.linear()
            .domain([0, d3.max(dataset, function(d) {return d.count;})])
            .range([0, h]);

    var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("right")
                      .ticks(5);

    var route_name = function(d) {
      return d.route_name;
    };

    //Create SVG element
    var svg = d3.select("body")
          .append("svg")
          // .attr("transform", "translate(" + 100 + ",100)")
          .attr("width", w)
          .attr("height", h);

    //Create Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + 975 + ",0)")
        .call(yAxis);

    //Create bars
    svg.selectAll("rect")
       .data(dataset, route_name)
       .enter()
       .append("rect")
       .attr("x", function(d, i) {
        return xScale(i);
       })
       .attr("y", function(d) {
        return h - yScale(d.count);
       })
       .attr("width", xScale.rangeBand())
       .attr("height", function(d) {
        return yScale(d.count);
       })
       .attr("fill", function(d) {
        return "rgb(0, 0, " + (d.count * 10) + ")";
       })
      .on("mouseover", function(d) {
        svg.selectAll("rect")
          .style("opacity", 1)
       // make infoLegend show this points data
        svg.selectAll(".routeName")
          .text('Route Name: ' + d.route_name)
        svg.selectAll(".busStopsPerRoute")
          .text('Number of  bus stops on route: ' + d.count )
      })
      .on("mouseout", function(d) {
      });

      var infoLegend = svg.append("g")
        .attr("transform", "translate(" + (w - 400) + ",0)")
        .attr("class", "g-legend")

      infoLegend.append("rect")
        .attr("class", "infoLegend")
        .attr("width", 300)
        .attr("height",50)
        .attr("fill", '#F5F5F5')
        .attr("border",1)
        .attr("opacity",0)

        infoLegend.append("text")
          .attr("class", "routeName")
          .attr("x", 0)
          .attr("y", 20)
          .attr("fill", "black")
          .style("font-weight", "bold")

        infoLegend.append("text")
          .attr("class", "busStopsPerRoute")
          .attr("x", 0)
          .attr("y", 40)
          .attr("fill", "black")
          .style("font-weight", "bold")

      var title = svg.append("g")
        .attr("transform", "translate(" + 15 + ",0)")
        .attr("class", "g-title")

        title.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("fill", "black")
          .style("font-weight", "bold")
          .text('Number of Bus Stops Per Bus Route');


  }