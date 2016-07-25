var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('busRouteData.db');


// Database initialization
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='stops'",
       function(err, rows) {
  if(err !== null) {
    console.log(err);
  }
  else if(rows === undefined) {
    db.run('CREATE TABLE "stops" ' +
           '("stop_id" INTEGER PRIMARY KEY, ' +
           '"alightings" INTEGER, ' +
           '"boardings" INTERGER,'  +
           '"cross_street" VARCHAR(255),' +
           '"on_street" VARCHAR(255),' +
           '"lat"  INTEGER,' +
           '"lng"  INTEGER' +
           ')', function(err) {
      if(err !== null) {
        console.log(err);
      } else {
        console.log("SQL Table 'stops' initialized.");
      }
    });

    db.run('CREATE TABLE "routes" ' +
           '("route_id" INTEGER PRIMARY KEY, ' +
           '"route_name" VARCHAR(255)' +
           ')', function(err) {
      if(err !== null) {
        console.log(err);
      } else {
        console.log("SQL Table 'routes' initialized.");
      }
    });

    // allow foreign keys
    db.run('PRAGMA foreign_keys = ON');

    // foo_id INTEGER,
    //    bar_id INTEGER,
    //    FOREIGN KEY(foo_id) REFERENCES foo(id) ON DELETE CASCADE,
    //    FOREIGN KEY(bar_id) REFERENCES bar(id) ON DELETE CASCADE
    db.run('CREATE TABLE "route_stop" ' +
           '("route_id" INTEGER,' +
           '"stop_id" INTEGER,' +
           'FOREIGN KEY(route_id) REFERENCES routes(route_id) ON DELETE CASCADE,' +
           'FOREIGN KEY(stop_id) REFERENCES stops(stop_id) ON DELETE CASCADE' +
           ')', function(err) {
      if(err !== null) {
        console.log(err);
      } else {
        console.log("SQL Table 'route_stop' initialized.");
      }
    });

  } else {
    console.log("SQL tables already initialized.");
  }
});

module.exports = db;
