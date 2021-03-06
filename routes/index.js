var parse     = require('csv-parse')
  ,config     = require('../config.js')
  ,express    = require('express')
  ,fs         = require('fs')
  ,moment     = require('moment')
  ,mongoose   = require('mongoose')
  ,multer     = require('multer')
  ,naiveBayes = require('../lib/naiveBayes')
  ,passport   = require('passport')

var router = express.Router(),
  upload   = multer({dest: './uploads/'})


// models
var conn        = mongoose.connection
  ,ObjectID       = require('mongoose').ObjectID
  ,Project        = require('../models/Project')
  ,Task           = require('../models/Task')
  ,User           = require('../models/User')
//end models

/**
 * Middleware.
 * Check if user is logged in.
 * @todo fix login timeout bug and uncomment below code block.
 * @param  {request}   req  The request object.
 * @param  {response}   res  The response object
 * @param  {Function} next callback
 */
function isAuthenticated(req, res, next) {
  return next();

  if(req.isAuthenticated())
    return next();

  res.redirect(403, '/login');
}


// home page.
router.get('/', function(req, res, next) {

  Project.find({}, function(e,projects){

    //get events
    Task.find({}, function(err,events){

      //format dateTime for jquery calendar
      events.map(function(event, i, events){
        event.start = moment(event.start).utc().format().replace(/\+.+/, '')
        event.end = moment(event.end).utc().format().replace(/\+.+/, '')

        //get project details
        projects.forEach(function(project){
          if(event.projectID == project._id)
            event.color = project.color
        })

        return event
      })

      //get projects
      res.render('index', {
        title: 'taskTracker',
        events: events,
        scripts: [
          '/bower_components/jquery/dist/jquery.js',
          '/bower_components/bootstrap/dist/js/bootstrap.min.js',
          '/bower_components/moment/min/moment.min.js',
          '/bower_components/bootstrap/js/transition.js',
          '/bower_components/bootstrap/js/collapse.js',
          '/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
          '/bower_components/bootstrap-timepicker/js/bootstrap-timepicker.js',
          '/bower_components/d3/d3.js',
          '/bower_components/d3-tip/index.js',
          '/vendor/threedubmedia/jquery.event.drag-2.2.js',
          '/vendor/threedubmedia/jquery.event.drag.live-2.2.js',
          '/vendor/threedubmedia/jquery.event.drop-2.2.js',
          '/vendor/threedubmedia/jquery.event.drop.live-2.2.js',
          '/vendor/threedubmedia/excanvas.min.js',
          '/vendor/fullcalendar.min.js',
          '/javascripts/calendar.js'
        ],
        styles: [
          '/vendor/threedubmedia/base.css',
          '/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css',
          '/bower_components/bootstrap-timepicker/css/timepicker.less',
          '/vendor/fullcalendar.min.css'
        ],
        projects: projects,
        dbError: err || e
      });
    })
  })
})


// login
router.get('/register', function(req, res) {
    res.render('register', { });
});
router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            return res.render('register', { user : user });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});
router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
// end login


// naive bayes
router.get('/naiveBayes', isAuthenticated, naiveBayes.view)


// manicTime
router.get('/manicTime', isAuthenticated, function routerManicTime(req, res, next){

  res.render('manicTime', {
    title: 'taskTracker - manicTime',
    scripts: ['/javascripts/manicTime.js'],
    files: [
      'ManicTimeData_2015-11-27.csv'
    ]
  })
})

router.post('/manicTime/upload', function(req, res, next){ if(isAuthenticated()) upload.single('csv'); return next()}, function routerManicTimeUpload(req, res, next){

  var oldName = './'+req.file.path,
    newName = './uploads/'+req.file.originalname

  fs.renameSync(oldName, newName)
  res.redirect('/manicTime?msg=file uploaded successfully')
  next()
})
router.post('/manicTime/parse', isAuthenticated, function parseManicTimeFile(req, res, next){

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
router.get('/manicTime/getSample', isAuthenticated, function routerManicTimeSample(req, res, next){

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


// data viz
router.get('/viz', isAuthenticated, function routerGetViz(req, res, next){

  Project.find(function(err, projects){

    res.render('viz', {
      title: 'taskTracker - data viz',
      weekNo: moment().week(),
      styles: [
        '/bower_components/bootstrap/dist/css/bootstrap.css',
        '/stylesheets/viz.css'
      ],
      scripts: [
        '/bower_components/jquery/dist/jquery.js',
        '/bower_components/bootstrap/dist/js/bootstrap.js',
        '/bower_components/moment/moment.js',
        '/bower_components/d3/d3.js',
        '/bower_components/d3-tip/index.js',
        '/javascripts/viz.js'
      ],
      projects: projects
    })
  })

})
router.get('/viz/getData', isAuthenticated, function routerVizData(req, res, next){

  var db = req.db,
    collection = db.get("manicTime")

    collection.find({}, {}, function(err, docs){
      //docs = [{"name":"foo"},{"name":"bar"}]
      res.json(JSON.stringify(docs))
      next()
    })
})


// cdChanges
router.get('/cdChanges', isAuthenticated, function routerGetCdChanges(req, res, next){

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

// addTask
router.post('/addTask', isAuthenticated, function(req, res){

  var days = req.body.days

  for(var x=1; x<=days; x++){
    var start = moment(req.body['date-'+x]+' '+req.body['start-'+x], "DD/MM/YYYY HH:mm"),
      end = moment(req.body['date-'+x]+' '+req.body['end-'+x], "DD/MM/YYYY HH:mm")

    var task = new Task({
      "title": req.body.taskTitle,
      "start": start.utc().format(),
      "end": end.utc().format(),
      "projectID": req.body.project
    })

    Task.create(task, function(err){
      if(err){
        console.log(err)
        res.json({
          error: err
        })
      }else{
        console.log(task._id)
        return res.redirect('/')
        //res.json({
        //  ok: true
        //})
      }
    })
  }
});


// crudProject
router.post('/crudProject', isAuthenticated, function(req, res){

  var id = req.body.id || new mongoose.Types.ObjectId()

  var record = new Project({
    _id: id,
    title: req.body.projectTitle
  })
  record.save(function(err, doc){
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
