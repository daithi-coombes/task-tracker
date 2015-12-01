var express = require('express')
  fs        = require('fs')
  ,moment   = require('moment')
  ,multer   = require('multer')

var router = express.Router(),
  upload   = multer({dest: './uploads/'})


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


/* GET manicTime page */
router.get('/manicTime', function routerManicTime(req, res, next){
  res.render('manicTime', {
    title: 'taskTracker - manicTime'
  })
})

router.post('/manicTime/upload', upload.single('csv'), function routerManicTimeUpload(req, res, next){

  var oldName = './'+req.file.path,
    newName = './uploads/'+req.file.originalname

  fs.renameSync(oldName, newName)
  res.redirect('/manicTime?msg=file uploaded successfully')
  next()
})

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
