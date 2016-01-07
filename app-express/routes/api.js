"use strict"

var async     = require('async')
  ,express    = require('express')
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


/**
 * get total hours per project between startDate & endDate
 */
router.get('/project/hours/week', function(req, res){

  var endDate = moment().endOf('week').add(1, 'days').toISOString()
    ,json = []
    ,startDate = moment().startOf('week').add(1, 'days').toISOString()

  //get all projects
  Project.find({}, function(err, projects){

    //loop projects
    async.each(projects,
      function(project, done){

        //get projects tasks
        Task.find({
            projectID: project.id,
            end: { $gte: "Mon Jan 04 2016 18:30:00 GMT+0000 (GMT)" }
          },
          function(err, tasks){
            console.log(tasks)

            json.push({
              project: project,
              tasks: tasks
            })
            done()
          }
        )
      },
      function(err){
        res.json({
          res: json,
          week: {
            start: startDate,
            end: endDate
          }
        })
      }
    )
  })
})


module.exports = router
