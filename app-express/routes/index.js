var express = require('express')
  ,moment = require('moment')

var router = express.Router()


/* GET home page. */
router.get('/', function(req, res, next) {

  var db = req.db

  var tasks = db.get('tasks')

  tasks.find({},{},function(e,events){

    var projects = db.get('projects'),
      err = e

    projects.find({},{},function(e,projects){
      res.render('index', {
        title: 'taskTracker',
        events: events,
        projects: projects,
        dbError: err || e
      });
    })
  })
});


/* Handle addTask submit */
router.post('/addTask', function(req, res){

  var db = req.db,
    collection = db.get('tasks'),
    days = req.body.days

  console.log(req.body);

  for(var x=1; x<=days; x++){
    var start = moment(req.body['date-'+x]+' '+req.body['start-'+x], "DD/MM/YYYY HH:mm"),
      end = moment(req.body['date-'+x]+' '+req.body['end-'+x], "DD/MM/YYYY HH:mm")

    var record = {
      "title": req.body.taskTitle,
      "start": start.utc().format(),
      "end": end.utc().format(),
      "projectID": req.body.project
    }
    //console.log(record)

    collection.insert(record, function(err, doc){
      if(err){
        //console.log(err)
        res.send("There was an error")
      }else{
        console.log('inserted:')
        console.log(record)
      }
    })
  }

  res.redirect("/")
});


/* Handle crudProject submit */
router.post('/crudProject', function(req, res){

  var db = req.db,
    collection = db.get('projects')

  var record = {
    title: req.body.projectTitle
  }

  collection.insert(record, function(err, doc){
    if(err){
      console.log(err)
      res.send('There was an error')
    }else{
      console.log('inserted:')
      console.log(record)
      res.redirect("/")
    }
  })
})

module.exports = router;
