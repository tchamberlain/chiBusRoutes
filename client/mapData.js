(function() {

  color = d3.scale.linear().domain([1,1000])
       .interpolate(d3.interpolateHcl)
       .range([d3.rgb(242,242,252), d3.rgb( 0,0,255 )]);


  var width = 800,
      height = 868,
      hoveredNode = null;


  var projection = d3.geo.albers()
      .rotate([87.73, 0])
      .center([0, 42.0433])
      .scale(120000)
      .translate([width / 2, 0]);

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

  var race = d3.scale.ordinal()
      .domain(["white", "black", "other"])
      .range(["#FFCC33", "#33CCFF", "#60B260"].map(function(d) { d = d3.hcl(d); d.c /= 2; return d;}));

  var svg = d3.select(".g-chart").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(-25,-30)");

  var path = d3.geo.path()
      .projection(projection);

  var radius = d3.scale.sqrt()
      .domain([0, 8])
      .range([0, 3]);

  queue()
      .defer(d3.json, "https://static01.nyt.com/newsgraphics/2012/12/31/chicago-homicides/acae5cd811293b922d4a1c54968858f8c1a379dc/chicago.json")
      .defer(d3.tsv, "https://static01.nyt.com/newsgraphics/2012/12/31/chicago-homicides/acae5cd811293b922d4a1c54968858f8c1a379dc/block-groups.tsv")
      .await(getData);

  function getData( error, chicago, blocks ){
    return $.ajax({
      url: 'http://localhost:8000/stops',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
       ready( error, chicago, blocks, data )
      },
      error: function (data) {
        console.error('An error retrieving route data occured');
      }
    });
  }
  function ready(error, chicago, blocks, data) {
    var blocksById = {},
        blockGroups = topojson.object(chicago, chicago.objects.blockGroups),
        communityAreas = topojson.object(chicago, chicago.objects.communityAreas);

    blocks.forEach(function(d) { blocksById[d.id] = d; });
    data = data;


    data.forEach(function(d) {
      var p = projection([+d.lng, +d.lat]);
      d['0'] =  p[0];
      d['1'] =  p[1];
    });

    svg.insert("defs", "*").append("clipPath")
        .datum(communityAreas)
        .attr("id", "g-clip-district")
      .append("path")
        .attr("d", path);

    svg.append("path")
        .datum(communityAreas)
        .attr("class", "g-district")
        .attr("d", path);

    svg.append("g")
        .attr("class", "g-block")
        .attr("clip-path", "url(#g-clip-district)")
      .selectAll("path")
        .data(race.domain())
      .enter().append("path")
        .datum(function(race) {
          return {
            type: "GeometryCollection",
            properties: {race: race},
            geometries: blockGroups.geometries.filter(function(d) {
              return (d = blocksById[d.id]) && d[race] / d.total >= .5
            })
          };
        })
        .attr("fill", function(d) { return "white"; })
        .attr("d", path);

    svg.append("path")
        .datum(topojson.mesh(chicago, chicago.objects.communityAreas, function(a, b) { return a !== b; }))
        .attr("class", "g-district-inner-boundary")
        .attr("d", path);

    svg.append("path")
        .datum(topojson.mesh(chicago, chicago.objects.communityAreas, function(a, b) { return a === b; }))
        .attr("class", "g-district-outer-boundary")
        .attr("d", path);


    var homicide = svg.append("g")
        .attr("class", "g-homicide")
      .selectAll("circle")
      .data(data).enter()
      .append("circle")
      .attr("cx", function (d) {  return d['0']; })
      .attr("cy", function (d) { return d['1']; })
      .attr("r",function (d) { return d.boardings/200; }) // change size based on boardings
      .attr("fill",function (d) { 
        // set base color
        c = d3.hsl('pink');
        c.opacity = 0.8;

        return color(Math.floor(d.boardings));
        return c.darker(d.boardings/300); })
      .on('mouseover', function(d){
          
          svg.selectAll(".alightingsText")
          .text('Alightings: ' + d.alightings);

          svg.selectAll(".streetsText")
          .text(d.cross_street + ' & ' +d.on_street);
         
          svg.selectAll(".boardingsText")
          .text('Boardings: ' + d.boardings);

          d3.select(this).attr("r", 8).attr("stroke","black").style("fill", "white");
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("r", 2.2)
        .attr("stroke",null)
        .style("fill", function (d) { 
        // set base color
        c = d3.hsl('pink');
        c.opacity = 0.8;
        return c.darker(d.boardings/200); });
      });

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
       // .style("font-weight", "bold")

       .text(function(d) { return d.word; });

    var infoLegend = svg.append("g")
        .attr("transform", "translate(" + (width - 125) + ",300)")
        .attr("class", "g-legend");

    infoLegend.append("rect")
    .attr("transform", "translate(0,-100)")
    .attr("width", 500)
    .attr("height", 150)
    .attr("fill", '#F5F5F5')
    .attr("border",1);

    infoLegend.append("text")
    .attr("class", "streetsText")
    .attr("y", -40)
    .attr("x", 8)


    infoLegend.append("text")
        .attr("class", "alightingsText")
        .attr("y", -20)
        .attr("x", 8)
        .attr("fill", "gray")
        .style("font-weight", "bold")

    infoLegend.append("text")
      .attr("class", "boardingsText")
      .attr("y", 0)
      .attr("x", 8)
      .attr("fill", "gray")
      .style("font-weight", "bold")
  }

  })()