 

 //  testing ajax call
  $.ajax({
    url: 'http://localhost:8000/stops',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      // Trigger a fetch to update the messages, pass true to animate
     console.log('YO WE GOT DATA', data)
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
  // testing ajax call

(function() {

  var width = 700,
      height = 868;

  var projection = d3.geo.albers()
      .rotate([87.73, 0])
      .center([0, 42.0433])
      .scale(120000)
      .translate([width / 2, 0]);

  var hexbin = d3.hexbin()
      .size([width, height])
      .radius(6);

  var specials = {
    "AUSTIN": 1,
    "GREATER GRAND CROSSING": 1,
    "HYDE PARK": 1,
    "LINCOLN PARK": 1
  };

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

  var leaderLines = [
    {label: "austin", d:"M 248 314 L 280 314"},
    {label: "lincoln", d:"M 504 254 L 554 254"},
    {label: "grand crossing", d:"M 286 610 L 490 610"},
    {label: "hyde park", d:"M 583 525 L 623 525 L 623 490"}
  ];



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
      .defer(d3.csv, "https://static01.nyt.com/newsgraphics/2012/12/31/chicago-homicides/acae5cd811293b922d4a1c54968858f8c1a379dc/homicides.csv")
      .defer(d3.tsv, "https://static01.nyt.com/newsgraphics/2012/12/31/chicago-homicides/acae5cd811293b922d4a1c54968858f8c1a379dc/block-groups.tsv")
      .await(ready);

  function ready(error, chicago, homicides, blocks) {
    var blocksById = {},
        blockGroups = topojson.object(chicago, chicago.objects.blockGroups),
        communityAreas = topojson.object(chicago, chicago.objects.communityAreas);
        console.log(chicago.objects.communityAreas);

    blocks.forEach(function(d) { blocksById[d.id] = d; });

    homicides.forEach(function(d) {
      var p = projection([+d.longitude, +d.latitude]);
      d[0] = p[0], d[1] = p[1];
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
        .style("fill", function(d) { return 'white'; })
        .attr("d", path);

    svg.append("path")
        .datum(topojson.mesh(chicago, chicago.objects.communityAreas, function(a, b) { return a !== b; }))
        .attr("class", "g-district-inner-boundary")
        .attr("d", path);

    svg.append("path")
        .datum(topojson.mesh(chicago, chicago.objects.communityAreas, function(a, b) { return a === b; }))
        .attr("class", "g-district-outer-boundary")
        .attr("d", path);

    svg.append("path")
        .datum({type: "GeometryCollection", geometries: communityAreas.geometries.filter(function(d) { return d.properties.name in specials; })})
        .attr("class", "g-district-special")
        .attr("d", path);

    var homicide = svg.append("g")
        .attr("class", "g-homicide")
      .selectAll("circle")
        .data(hexbin(homicides).sort(function(a, b) { return b.length - a.length; }))
      .enter().append("circle")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("r", function(d) { return radius(d.length); });

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
        .text(function(d) { return d.word; });

    svg.selectAll(".g-district-leader")
      .data(leaderLines).enter().append("path")
      .attr("class", "g-district-leader")
      .attr("d", function(d){ return d.d; });

    var homicideLegend = svg.append("g")
        .attr("transform", "translate(" + (width - 125) + ",58)")
        .attr("class", "g-legend");

    homicideLegend.append("text")
        .attr("y", -16)
        .style("font-weight", "bold")
        .text("Homicides, 2001-2012");

    var homicideKey = homicideLegend.selectAll(".g-key")
        .data([30, 10, 1])
      .enter().append("g")
        .attr("class", "g-key");

    homicideKey.append("circle")
        .attr("class", "g-homicide")
        .attr("cx", function(d) { return radius(d); })
        .attr("r", radius);

    homicideKey.append("text")
        .attr("x", function(d) { return 2 * radius(d) + 5; })
        .attr("dy", ".35em")
        .text(function(d) { return d; });

    homicideKey.attr("transform", (function() {
      var x0 = 0;
      return function(d) {
        var x1 = x0;
        x0 += this.getBBox().width + 10;
        return "translate(" + x1 + ",0)";
      };
    })());

    var raceLegend = svg.append("g")
        .attr("transform", "translate(" + (width - 125) + ",106)")
        .attr("class", "g-legend");

    raceLegend.append("text")
        .attr("y", -10)
        .style("font-weight", "bold")
        .text("Race");

    var raceKey = raceLegend.selectAll(".g-key")
        .data(race.domain())
      .enter().append("g")
        .attr("class", "g-key")
        .attr("transform", function(d, i) { return "translate(0," + (i * 19) + ")"; });

    raceKey.append("rect")
        .attr("class", "g-block")
        .attr("width", 8)
        .attr("height", 8)
        .style("fill", 'race');

    raceKey.append("text")
        .attr("x", 16)
        .attr("y", 4)
        .attr("dy", ".35em")
        .text(function(d) { return "Majority " + d; });
  }

  })()