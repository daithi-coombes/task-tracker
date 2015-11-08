#! /usr/bin/node

//mongodb://127.0.0.1:3001/meteor
// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://127.0.0.1:3001/meteor/dirChanges", function(err, db) {
  if(err) return console.dir(err)

  var collection = db.collection('dirChanges')
  collection.insert({dateTime: "2015-11-08T17:58:04,330417451+0000", dir: "/opt/taskTracker/bin/"})
});


var Tail = require('tail').Tail,
  tail = new Tail('/var/log/terminal-cd.log')

tail.on("line", function(data){
  console.log(data)
})
