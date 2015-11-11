DirChanges = new Mongo.Collection("dirChanges")

if (Meteor.isClient) {

  Template.body.helpers({

    dirChanges: function(){

      records = parseRecords(DirChanges.find({}));
      console.log(records);

      return records;
    }
  });

}


if (Meteor.isServer) {

  Meteor.startup(function () {
  });
}

/**
 * Parse Records.
 *
 * Will remove duplicates and skip any cd changes that are within 1 sec range.
 * Adds the number of seconds the directory change is live.
 *
 * @param  {cursor} records The records to parse.
 * @return {array}         Returns an array of results.
 */
function parseRecords(records){

  var lastStamp = 0,
    ret = [];

  records.forEach(function(record){

    var dateTime = new Date(record.dateTime.split(',')[0]);

    if( +lastStamp != +dateTime){

      //duration
      if(+lastStamp > 0)
        record.duration = dateTime.getTime() - lastStamp.getTime();
      else
        record.duration = 0;

      //end
      if(+lastStamp > 0){
        ret[ret.length-1].dateTimeEnd = dateTime;
      }

      record.dateTime = dateTime;
      ret.push(record);
    }

    lastStamp = dateTime;
  });

  return ret;
}
