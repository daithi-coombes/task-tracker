var parse     = require('csv-parse')
  ,express  = require('express')
  ,fs       = require('fs')
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
    title: 'taskTracker - manicTime',
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
router.post('/manicTime/getSample', function routerManicTimeSample(req, res, next){

  var db = req.db,
    collection = db.get('manicTime'),
    sampleSize = 500

  collection.find({}, {limit: sampleSize}, function(err, docs){

    docs.map(function(instance, index, docs){
      var words = docs[index].name.split(/\b/g)
      instance.name = []
      words.map(function(word, i){
        if(/^[a-z0-9]+$/i.test(word)){
          instance.name.push(word)
        }
      })
      docs[index] = instance
    })

    res.json(docs)
    next()
  })
})


/* GET data viz page */
router.get('/viz', function routerGetViz(req, res, next){

  var db = req.db,
    collection = db.get("manicTime")

  collection.count({}, function(err, count){
    if(err)
      res.end(err)

    res.render('viz', {
      title: 'taskTracker - data viz',
      count: count
    })
    next()
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
