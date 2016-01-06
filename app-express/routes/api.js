"use strict"

var express = require('express')
  ,router = express.Router()

router.get('/project/hours/week', function(req, res){
  res.send('boo yaj')
})

module.exports = router
