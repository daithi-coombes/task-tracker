var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'taskTracker' });
});

/* Handle addTask submit */
router.post('/addTask', function(req, res){

  var db = req.db,
    collection = db.get('tasks')

  collection.insert({
    "title": title,
    "start": start,
    "end": end
  })
});

module.exports = router;
