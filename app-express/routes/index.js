var parse     = require('csv-parse')
  ,config   = require('../config.js')
  ,express  = require('express')
  ,fs       = require('fs')
  ,moment   = require('moment')
  ,mongoose = require('mongoose')
  ,multer   = require('multer')

var router = express.Router(),
  upload   = multer({dest: './uploads/'})


// models
mongoose.connect(config.db.host+':'+config.db.port+'/'+config.db.dbName)
var Project = require('../models/Project')
  ,Task     = require('../models/Task')
//end models


/* GET home page. */
router.get('/', function(req, res, next) {

  //get events
  Task.find({}, function(err,events){

    //format dateTime for jquery calendar
    events.map(function(event, i, events){
      event.start = moment(event.start).utc().format().replace(/\+.+/, '')
      event.end = moment(event.end).utc().format().replace(/\+.+/, '')
      return event
    })

    //get projects
    Project.find({}, function(e,projects){
      res.render('index', {
        title: 'taskTracker',
        events: events,
        scripts: ['/javascripts/calendar.js'],
        projects: projects,
        dbError: err || e
      });
    })
  })
})


/* GET manicTime page */
router.get('/manicTime', function routerManicTime(req, res, next){

  res.render('manicTime', {
    title: 'taskTracker - manicTime',
    scripts: ['/javascripts/manicTime.js'],
    files: [
      'ManicTimeData_2015-11-27.csv'
    ]
  })
})

router.post('/manicTime/upload', upload.single('csv'), function routerManicTimeUpload(req, res, next){

  var oldName = './'+req.file.path,
    newName = './uploads/'+req.file.originalname

  fs.renameSync(oldName, newName)
  res.redirect('/manicTime?msg=file uploaded successfully')
  next()
})
router.post('/manicTime/parse', function parseManicTimeFile(req, res, next){

  var db = req.db,
    collection = db.get('manicTime'),
    file = req.body.file,
    parser = parse({delimiter: ','}, function(err, data){
      console.log('**********************************')
      console.log('* > starting parse....')

      data.map(function(el, index, array){

        var row = {
          name: el[0],
          start: moment(el[1], "DD/MM/YYYY HH:mm:ss").format(),
          end: moment(el[2], "DD/MM/YYYY HH:mm:ss").format(),
          duration: el[3],
          process: el[4]
        }

        //keep data clean, skip following process's
        var skip = ['ManicTime']

        collection.insert(row, function(err, doc){
          if(err)
            console.log(err)
          else
            console.log(doc)
        })

      })
    })

  fs.createReadStream('./uploads/'+file).pipe(parser)


  //model the data
  // _id, name, start, end, duration, process


  res.end('[{msg:hi}]')
})
router.get('/manicTime/getSample', function routerManicTimeSample(req, res, next){

  var db = req.db,
    collection = db.get('manicTime'),
    sampleSize = req.query.sample || 100

  console.log(req.query.sample);

  //disable cors
  res.set('Access-Control-Allow-Origin', '*')

  //grab docs
  collection.find({}, {limit: sampleSize, sort: ['start','asc']}, function(err, docs){

    //prepare each docs
    docs.map(function(instance, index, docs){

      //text
      var words = docs[index].name.split(/\b/g)
      instance.name = []
      words.map(function(word, i){
        if(/^[a-z0-9]+$/i.test(word)){
          instance.name.push(word)
        }
      })

      //datetime
      var a = instance.duration.split(':'),
        duration = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]),
        start = moment(instance.start, "YYYY-MM-DD HH:mm:ss Z").format('YYYY-MM-DD HH:mm:ss')

      //the doc
      docs[index] = {
        words: instance.name,
        start: start,
        duration: duration
      }
    })

    res.json(docs)
    next()
  })
})


/* GET data viz page */
router.get('/viz', function routerGetViz(req, res, next){

  Project.find(function(err, projects){

    res.render('viz', {
      title: 'taskTracker - data viz',
      scripts: ['/javascripts/viz.js'],
      projects: projects
    })
  })

})
router.get('/viz/getData', function routerVizData(req, res, next){

  var db = req.db,
    collection = db.get("manicTime")

    collection.find({}, {}, function(err, docs){
      //docs = [{"name":"foo"},{"name":"bar"}]
      res.json(JSON.stringify(docs))
      next()
    })
})


/* GET cdChanges page */
router.get('/cdChanges', function routerGetCdChanges(req, res, next){

  var db = req.db,
    collection = db.get('dirChanges')

  collection.find({dateTime:{$type:2}}, function(err, dirChanges){

    console.log(dirChanges)

    dirChanges.forEach(function(dirChange){

      var date = new Date(dirChange.dateTime.split(',')[0])

      var record = {
        dateTime: date,
        dir: dirChange.dir
      }

      collection.updateById(dirChange._id, record, function(err){
        if(err) throw err
        console.log('updated: '+dirChange._id)
        console.log('\t'+dirChange.dateTime)
        console.log('\t'+date)
      })
    })

    res.render('cdChanges',{
      dirChanges: dirChanges,
      title: 'cdChanges'
    })
  })
})

/* Handle addTask submit */
router.post('/addTask', function(req, res){

  var db = req.db,
    collection = db.get('tasks'),
    days = req.body.days

  collection.find({},{}, function(err, doc){
    console.log(doc);
  })

  for(var x=1; x<=days; x++){
    var start = moment(req.body['date-'+x]+' '+req.body['start-'+x], "DD/MM/YYYY HH:mm"),
      end = moment(req.body['date-'+x]+' '+req.body['end-'+x], "DD/MM/YYYY HH:mm")

    var record = {
      "title": req.body.taskTitle,
      "start": start.utc().format(),
      "end": end.utc().format(),
      "projectID": req.body.project
    }

    collection.insert(record, function(err, doc){
      if(err){
        console.log(err)
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
