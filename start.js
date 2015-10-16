var terminalCD = require('./lib/terminalCD')
  , logger = require('./lib/logger')
  , config = require('./config.js')


logger.setConfig(config)

terminalCD.readLog(null, function(err, data){

  for(var x=0; x<data.length; x++)
    logger.log(data[x], function(err, result){
      console.log(err)
      console.log(result)
      console.log('**************')
    })

  terminalCD.backupLog(null, function(err, backupFile){
    if(err)
      throw err

    console.log('logs backed up to...')
    console.log('\t'+backupFile)
  })
})
