var terminalCD = require('./lib/terminalCD')
  , logger = require('./lib/logger')

logger.setConfig({
    token: ,
    subdomain: config.subdomain,
    auth: {
      username: config.username,
      password: config.password
    },
    json: true,
    tags: ['devOps','terminal-cd']
  })
  .log('this is a test', function(err, result){
    console.log(err)
    console.log(result)
  })
