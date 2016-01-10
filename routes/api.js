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
  .get(function(req, res){

    var endDate = moment().endOf('week').add(1, 'days').toISOString()
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
              end: { '$gte': startDate.toISOString()}
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
