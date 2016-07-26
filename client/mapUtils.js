//************************
// ***** VARIABLES ******
//**********************

var communityAreas;

var customLabels = {
  "ARMOUR SQUARE": {offset: [0,-10]},
  "AUSTIN": {offset: [8,0]},
  "BEVERLY": {offset: [0, 10]},
  "BRIDGEPORT": {offset: [0, -5]},
  "BURNSIDE": {hide: 1},
  "EAST GARFIELD PARK": {hide: 1},
  "ENGLEWOOD": {offset: [-20,0]},
  "FULLER PARK": {hide: 1},
  "GARFIELD RIDGE": {offset: [0, 10]},
  "HEGEWISCH": {offset: [-10, 20]},
  "KENWOOD": {hide: 1},
  "OHARE": {offset: [-25,-10]},
  "PULLMAN": {hide: 1},
  "WEST ENGLEWOOD": {hide: 1},
  "WEST GARFIELD PARK": {offset: [20,0], name: "GARFIELD PARK"},
  "WEST PULLMAN": {offset: [0,-5]}
};

//************************
// ***** FUNCTIONS ******
//**********************


var addProjectionsToPoints = function( data, projection ){
  data.forEach(function(d) {
    var p = projection([+d.lng, +d.lat]);
    d['0'] =  p[0];
    d['1'] =  p[1];
  });
}
var addDistrictLabels = function( svg, path ){

  var districtLabel = svg.selectAll(".g-district-label")
      .data(communityAreas.geometries.filter(function(d) {
        var l = customLabels[d.properties.name] || {};
        d.properties.hide = l.hide || false;
        d.properties.dx = l.offset ? l.offset[0] : 0;
        d.properties.dy = l.offset ? l.offset[1] : 0;
        if (l.name) d.properties.name = l.name;
        return !d.properties.hide;
      }))
    .enter().append("g")
      .attr("class", "g-district-label")
      .attr("transform", function(d) {
        var c = path.centroid(d);
        return "translate(" + [c[0] + d.properties.dx, c[1] + d.properties.dy] + ")";
      });

  districtLabel.selectAll("text")
      .data(function(d) {
        var words = d.properties.name.split(" ");
        return words.map(function(d) { return {word: d, count: words.length}; });
      })
    .enter().append("text")
      .attr("class", "g-district-name")
      .attr("dy", function(d, i) { return (i - d.count / 2 + .7) + "em"; })
      .attr("fill", "black") 
      .text(function(d) { return d.word; });
}

var setPointColor = function ( d ) { 
  var colorScale = d3.scale.linear().domain([1,2000])
               .interpolate(d3.interpolateHcl)
               .range([d3.rgb(153, 204, 255), d3.rgb(153, 153, 255)]);
  return colorScale(Math.floor(d.boardings));
}

var setChartRectColor = function ( d ) { 
  var colorScale = d3.scale.linear().domain([1,180])
               .interpolate(d3.interpolateHcl)
               .range([d3.rgb(153, 204, 255), d3.rgb(153, 153, 255)]);
  return colorScale(Math.floor(d.count));
}


var setPointSize = function( d ){
  return d.boardings/185; 
}

var createBoardingsLegend = function ( svg, width ){
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
}

var createStopInfo = function( svg, width ){
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

var setUpChicagoBaseImage = function( svg, path, chicago, blocks ){
  
  var blocksById = {};
  var blockGroups = topojson.object(chicago, chicago.objects.blockGroups);
  
  // defined above, so we can use later for labels
  communityAreas = topojson.object(chicago, chicago.objects.communityAreas);

  blocks.forEach(function(d) { blocksById[d.id] = d; });
  svg.insert("defs", "*").append("clipPath")
      .datum(communityAreas)
      .attr("id", "g-clip-district")
    .append("path")
      .attr("d", path);

  svg.append("path")
      .datum(communityAreas)
      .attr("class", "g-district")
      .attr("d", path);

  svg.append("path")
      .datum(topojson.mesh(chicago, chicago.objects.communityAreas, function(a, b) { return a !== b; }))
      .attr("class", "g-district-inner-boundary")
      .attr("d", path);

  svg.append("path")
      .datum(topojson.mesh(chicago, chicago.objects.communityAreas, function(a, b) { return a === b; }))
      .attr("class", "g-district-outer-boundary")
      .attr("d", path);

}
