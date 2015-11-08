#! /usr/bin/node

//mongodb://127.0.0.1:3001/meteor
// Retrieve
var MongoClient = require('mongodb').MongoClient,
  Tail = require('always-tail'),
  tail = new Tail('/var/log/terminal-cd.log', '\n')

// Connect to the db
MongoClient.connect("mongodb://127.0.0.1:3001/meteor/dirChanges", function(err, db) {
  if(err) return console.dir(err)

  var collection = db.collection('dirChanges')

  tail.on("line", function(data){

    var parts = data.split(/\scd\s/, 2)
    if(parts==['']) return
    var dateTime = parts[0],
      directory = parts[1]

    collection.insert({dateTime: dateTime, dir: directory})
  })
});
