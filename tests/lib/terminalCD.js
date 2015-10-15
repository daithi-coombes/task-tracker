var _ = require('lodash')
  , rewire = require('rewire')
  , mockFs = require('mock-fs')
  , logger = require('../../lib/logger')
  , terminalCD = require('../../lib/terminalCD')


var expected = [{
    dateTime: '2015-10-15T08:35:46,507586706+0000',
    cmd: 'cd ../taskTracker/'
  },{
    dateTime: '2015-10-15T08:35:46,503218838+0000',
    cmd: 'cd /opt/coder-forge'
}]

describe('Interact with local log file', function(){

  it('Should read lines from terminal-cd', function(done){

    mockFs({
      '/var/log/': {
        'terminal-cd.log': expected[0].dateTime+' '+expected[0].cmd+' \n'+expected[1].dateTime+' '+expected[1].cmd+' \n' //spaces test trim()
      }
    })

    terminalCD.readLog(null, function(err, lines){
      mockFs.restore()

      for(var x=0; x<expected.length; x++)
        if(!_.isEqual(expected[x], lines[x])){
          console.log(expected[x])
          console.log(lines[x])
          return false;
        }

      mockFs.restore()
      done()
    })
  })

  it('Should backup and truncate local log file', function(done){

    mockFs({
      '/var/log/': {
        'terminal-cd.log': expected[0].dateTime+' '+expected[0].cmd+' \n'+expected[1].dateTime+' '+expected[1].cmd+' \n' //spaces test trim()
      },
      'data/': {}
    })

    terminalCD.backupLog(null, function(err, backup){
      mockFs.restore()

      if(!err)
        done()

      console.log(err.message)
    })
  })
})

describe('Interact with Loggly API', function(){

  it('Should set config', function(done){

    var expected = {
      token: 'foobar-token',
      subdomain: 'foobar',
      auth: {
        username: 'foo',
        password: 'bar'
      },
      tags: ['devOps','terminal-cd']
    }
    console.log(logger)
    logger.setConfig(expected)

    actual = logger.config
    if(_.isEqual(actual, expected))
      done()
  })

  it('Should send line to loggly', function(done){

  })
})
