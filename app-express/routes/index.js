var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var db = req.db

  var tasks = db.get('tasks')

  tasks.find({},{},function(e,docs){
    console.log(docs)
  })

  res.render('index', { title: 'taskTracker' });
});

/* Handle addTask submit */
router.post('/addTask', function(req, res){

  console.log(req.body);

  var db = req.db,
    collection = db.get('tasks')

  var record = {
    "title": req.body.taskTitle,
    "start": req.body.startDateTime,
    "end": req.body.endDateTime
  }

  collection.insert(record, function(err, doc){
    if(err){
      console.log(err)
      res.send("There was an error")
    }else{
      console.log('inserted:')
      console.log(record)
      res.redirect("/")
    }
  })
});

module.exports = router;
