"use strict"

var express   = require('express')
  ,moment     = require('moment')
  ,router     = express.Router()


/**
 * The format for the 'GET' api is:
 * RequestObject/ModelAttribute/Range
 *
 * @author daithi coombes <webeire@gmail.com>
 */


// models
var Project = require('../models/Project')
  ,Task = require('../models/Task')
// end models


router.get('/project/hours/week', function(req, res){
  Project.find({}, function(err, projects){
    Task.find({}, function(err, tasks){

      var endDate = moment().endOf('week').add(1, 'days')//.fromNow(true).split(' ')[0])+1
        ,startDate = moment().startOf('week').add(1, 'days')//)//.fromNow(true).split(' ')[0])

      res.json({
        tasks: tasks,
        projects: projects,
        week: {
          start: startDate,
          end: endDate
        }
      })
    })
  })
})


module.exports = router
