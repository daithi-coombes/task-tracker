/**
 * Parse terminal directory changes.
 * @module task-tracker/terminal-cd
 * @author daithi coombes <daithi.coombes@webeire.ie>
 */

var fs = require('fs')
  , readline = require('readline')


/** @constructor */
var TerminalCD = (function () {

  this.logFile = '/var/log/terminal-cd.log'

  /**
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

  return this;
})();


module.exports = TerminalCD;
