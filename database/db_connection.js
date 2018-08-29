/**
 * Handle DB connection
 */

 "use strict"
 var sql = require("sqlite3").verbose();
 var db = new sql.Database("database/web.db");


module.exports.db_connection = function (query, callback) {
    db.get(query, function (err, row) {
        if(err){
          console.log(err);
        }
        callback(err, row);
    })
};

module.exports.db_connectionAll = function (query, callback) {
    db.all(query, function (err, row) {
      if(err){
        console.log(err);
      }
        callback(err, row);
    })
};

module.exports.db_connectionRun = function (query, callback) {
    db.run(query, function (err, row) {
      if(err){
        console.log(err);
      }
        callback(err, row);
    });
};
