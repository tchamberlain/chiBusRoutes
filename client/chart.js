  

// getStopsOnRoute();
// getRoutesOnStop();

function getStopsOnRoute( error, chicago, blocks ){
  return $.ajax({
    url: 'http://localhost:8000/stops/routes',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('stops/routes',data.slice(data.length-100));
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
      console.log('_----/routes/stops',data.slice(data.length-50));
      data.forEach(function(x){
        x.count = x['COUNT(*)'];
      });
      makeChart( data.slice(data.length-30));
    },
    error: function (data) {
      console.error('An error retrieving /routes/stops data occured');
    }
  });

function makeChart( dataset ){
  var w = 450;
  var h = 450;

  var xScale = d3.scale.ordinal()
          .domain(d3.range(dataset.length))
          .rangeRoundBands([0, w], 0.05); 

  var yScale = d3.scale.linear()
          .domain([0, d3.max(dataset, function(d) {return d.count;})])
          .range([0, h]);

  var route_name = function(d) {
    return d.route_name;
  };

  //Create SVG element
  var svg = d3.select("svg")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

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

    //Tooltip
    .on("mouseover", function(d) {
      //Get this bar's x/y counts, then augment for the tooltip
      var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
      var yPosition = parseFloat(d3.select(this).attr("y")) + 14;
      
      //Update Tooltip Position & count
      d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px")
        .select("#count")
        .text(d.count);
      d3.select("#tooltip").classed("hidden", false)
    })
    .on("mouseout", function() {
      //Remove the tooltip
      d3.select("#tooltip").classed("hidden", true);
    })  ;

  //Create labels
  // svg.selectAll("text")
  //    .data(dataset, route_name)
  //    .enter()
  //    .append("text")
  //    .text(function(d) {
  //     return d.count;
  //    })
  //    .attr("text-anchor", "middle")
  //    .attr("x", function(d, i) {
  //     return xScale(i) + xScale.rangeBand() / 2;
  //    })
  //    .attr("y", function(d) {
  //     return h - yScale(d.count) + 14;
  //    })
  //    .attr("font-family", "sans-serif") 
  //    .attr("font-size", "11px")
  //    .attr("fill", "white");
     
  var sortOrder = false;
  var sortBars = function () {
      sortOrder = !sortOrder;
      
      sortItems = function (a, b) {
          if (sortOrder) {
              return a.count - b.count;
          }
          return b.count - a.count;
      };

      svg.selectAll("rect")
          .sort(sortItems)
          .transition()
          .delay(function (d, i) {
          return i * 50;
      })
          .duration(1000)
          .attr("x", function (d, i) {
          return xScale(i);
      });

      svg.selectAll('text')
          .sort(sortItems)
          .transition()
          .delay(function (d, i) {
          return i * 50;
      })
          .duration(1000)
          .text(function (d) {
          return d.count;
      })
          .attr("text-anchor", "middle")
          .attr("x", function (d, i) {
          return xScale(i) + xScale.rangeBand() / 2;
      })
          .attr("y", function (d) {
          return h - yScale(d.count) + 14;
      });
  };
  // Add the onclick callback to the button
  d3.select("#sort").on("click", sortBars);
  d3.select("#reset").on("click", reset);
  function randomSort() {

    
    svg.selectAll("rect")
          .sort(sortItems)
          .transition()
          .delay(function (d, i) {
          return i * 50;
      })
          .duration(1000)
          .attr("x", function (d, i) {
          return xScale(i);
      });

      // svg.selectAll('text')
      //     .sort(sortItems)
      //     .transition()
      //     .delay(function (d, i) {
      //     return i * 50;
      // })
      //     .duration(1000)
      //     .text(function (d) {
      //     return d.count;
      // })
      //     .attr("text-anchor", "middle")
      //     .attr("x", function (d, i) {
      //     return xScale(i) + xScale.rangeBand() / 2;
      // })
      //     .attr("y", function (d) {
      //     return h - yScale(d.count) + 14;
      // });
  }
  function reset() {
    svg.selectAll("rect")
      // .sort(function(a, b){
      //   return a.route_name - b.route_name;
      // })
      .transition()
          .delay(function (d, i) {
          return i * 50;
      })
          .duration(1000)
          .attr("x", function (d, i) {
          return xScale(i);
      });
      
    svg.selectAll('text')
          .sort(function(a, b){
        return a.route_name - b.route_name;
      })
          .transition()
          .delay(function (d, i) {
          return i * 50;
      })
          .duration(1000)
          .text(function (d) {
          return d.count;
      })
          .attr("text-anchor", "middle")
          .attr("x", function (d, i) {
          return xScale(i) + xScale.rangeBand() / 2;
      })
          .attr("y", function (d) {
          return h - yScale(d.count) + 14;
      });
  };
}


}
