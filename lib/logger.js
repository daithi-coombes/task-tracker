/**
 * Logger interface.
 * @module task-tracker/logger
 * @author daithi coombes <daithi.coombes@webeire.ie>
 */

/** @constructor */
var logger = (function(){


  this.log = function Log(line, cb){

    var client = loggly.createClient({
      token: config.token,
      subdomain: config.subdomain,
      auth: {
        username: config.username,
        password: config.password
      },
      json: true,
      tags: ['devOps','terminal-cd']
    })

    clinet.log('', cb)
  }

  /**
   * Set the config params.
   * @todo Error report configuration.
   * @param {object} config The configuration object.
   * @return {Logger} Returns self for chaining
   */
  this.setConfig = function SetConfig(config){
    this.config = config

    return this
  }

  var self = this
  return self
})()


module.exports = logger
