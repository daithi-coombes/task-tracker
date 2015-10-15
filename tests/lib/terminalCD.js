var _ = require('lodash')
  , rewire = require('rewire')
  , mockFs = require('mock-fs')
  , terminalCD = rewire('../../lib/terminalCD')

describe('Interact with local log file', function(){

  it('Should read lines from terminal-cd', function(done){

    var expected = [{
        dateTime: '2015-10-15T08:35:46,507586706+0000',
        cmd: 'cd ../taskTracker/'
      },{
        dateTime: '2015-10-15T08:35:46,503218838+0000',
        cmd: 'cd /opt/coder-forge'
    }]

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

  it('Should truncate local log file', function(){
    terminalCD.truncate(null, function(){

    })
  })
})

describe('Interact with Loggly API', function(){

  it('Should send line to loggly', function(){

  })
})
