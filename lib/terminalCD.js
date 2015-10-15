/**
 * Parse terminal directory changes.
 * @module task-tracker/terminal-cd
 * @author daithi coombes <daithi.coombes@webeire.ie>
 */

var fs = require('fs')
  , readline = require('readline')


/** @constructor */
var terminalCd = (function TerminalCD() {

  this.logFile = '/var/log/terminal-cd.log'
  this.backupDir = 'data/'

  this.backupLog = function BackupLog(err, cb){

    var dateTime = new Date(),
      backup = this.backupDir+dateTime+'.log'

    //backup
    copyFile(this.logFile, backup, function(err){
      if(err)
        return cb(err)

      //truncate
      fs.truncate(this.logFile, 0, function(err){
        return cb(err, backup)
      })
    })
  }

  /**
   * Read the local log file.
   * @param  {Error}   err Default null.
   * @param  {Function} cb  Callback
   * @return {Array}       An array of log lines
   */
  this.readLog = function ReadLog(err, cb){

    var data = [],
      rl = readline.createInterface({
        input: fs.createReadStream(this.logFile),
        output: process.stdout,
        terminal: false
      })

    /* parse next line in log file */
    rl.on('line', function ReadLogLine(line){

      var _data = data,
        dateTime = line.substr(0,line.indexOf(' ')),
        cmd = line.substr(line.indexOf(' ')).trim()

      data.push({
        dateTime: dateTime,
        cmd: cmd
      })
    })

    /* EOF pass results to callback */
    rl.on('close', function ReadLogClose(){
      var _cb = cb,
        _data = data

      return _cb(null, _data)
    })
  }

  function copyFile(source, target, cb){

    var cbCalled = false,
      rd = fs.createReadStream(source),
      wr = fs.createWriteStream(target)

    rd.on("error", done)

    wr.on("error", done);
    wr.on("close", function(ex){
      done();
    })
    rd.pipe(wr);

    function done(err){
      if(!cbCalled){
        cb(err)
        cbCalled = true;
      }
    }
  }

  return this
})()


module.exports = terminalCd
