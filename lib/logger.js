/**
 * Logger interface.
 * @module task-tracker/logger
 * @author daithi coombes <daithi.coombes@webeire.ie>
 */

var loggly = require('loggly')


/** @constructor */
var logger = function Logger(){

  this.dataDir = 'data/'


};


module.exports = logger;
