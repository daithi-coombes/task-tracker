/**
 * Parse terminal directory changes.
 * @module task-tracker/terminal-cd
 * @author daithi coombes <daithi.coombes@webeire.ie>
 */

var fs = require('fs')
  , readline = require('readline')


/** @constructor */
var TerminalCD = function () {

  this.dataDir = 'data/'

  /**
   * a;lsdkfja;lsdkfj
   * @member {TerminalCD}
   */
  this.loadData = function terminalCDLoadData(cb){

    var data = [],
      rl = readline.createInterface({
        input: fs.createReadStream(this.dataDir+'07-10-2015.log'),
        output: process.stdout,
        terminal: false
      })

    rl.on('line', function(line){

      var reg = /\s\s/g, ///^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}\s\s(.)*$/g,
        parts = line.split(reg)

      console.log(parts)
    })
  }
};


module.exports = TerminalCD;
