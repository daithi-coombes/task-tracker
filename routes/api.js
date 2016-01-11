"use strict"

/**
 * The format for the 'GET' api is:
 * RequestObject/ModelAttribute/Range
 *
 * GET endpoints:
 *  - /project/hours/week
 *
 * @author daithi coombes <webeire@gmail.com>
 */
var async     = require('async')
  ,express    = require('express')
  ,moment     = require('moment')
  ,router     = express.Router()


// Models
var Project = require('../models/Project')
 ,Task = require('../models/Task')
// end Models


// get total hours per project between startDate & endDate
router.route('/project/hours/week')
  .post(function(req, res){


    //get requested week number
    var week = req.body.weekNo || null,
      start = moment().day("Sunday").week(week),
      end = moment().day("Monday").week(+week+1);
    console.log(req.body.weekNo)
    console.log(start.toISOString())
    console.log(end.toISOString())

    var endDate = moment().endOf('week').add(1, 'days')
      ,json = []
      ,startDate = moment().startOf('week')

    //if today is sunday, then take 7 days
    if(moment().format('dddd')=='Sunday')
      startDate = moment().startOf('week').subtract(7, 'days')

    //get all projects
    Project.find({}, function(err, projects){

      // loop projects
      async.each(projects,
        function(project, done){

          // get projects tasks
          Task.find({
              projectID: project.id,
              end: { '$gte': start.toISOString()},
              start: { '$lt': end.toISOString()}
            },
            function(err, tasks){

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
              start: startDate.add(1, 'days').toISOString(),
              end: endDate
            }
          })
        }
      )
    })
  })


module.exports = router
