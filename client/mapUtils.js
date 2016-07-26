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


var addProjectionsToPoints = function(data){

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

var setPointColor = function (d) { 
  var colorScale = d3.scale.linear().domain([1,2000])
               .interpolate(d3.interpolateHcl)
               // choose one of these color options later
               // .range([d3.rgb(242,242,252), d3.rgb( 0,0,255 )]);
               // .range([d3.rgb(204,229,255), d3.rgb( 153,0,153 )]);
               .range([d3.rgb(153, 204, 255), d3.rgb(153, 153, 255)]);
               // .range([d3.rgb(153, 179, 255), d3.rgb(51, 51, 255 )]);

  return colorScale(Math.floor(d.boardings));
}

var setChartRectColor = function (d) { 
  var colorScale = d3.scale.linear().domain([1,180])
               .interpolate(d3.interpolateHcl)
               // choose one of these color options later
               // .range([d3.rgb(242,242,252), d3.rgb( 0,0,255 )]);
               // .range([d3.rgb(204,229,255), d3.rgb( 153,0,153 )]);
               .range([d3.rgb(153, 204, 255), d3.rgb(153, 153, 255)]);
               // .range([d3.rgb(153, 179, 255), d3.rgb(51, 51, 255 )]);

  return colorScale(Math.floor(d.count));
}


var setPointSize = function(d){
  return d.boardings/185; 
}

var setUpChicagoBaseImage = function(svg, path, chicago, blocks){
  
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
