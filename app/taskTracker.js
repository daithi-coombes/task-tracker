DirChanges = new Mongo.Collection("dirChanges")

if (Meteor.isClient) {

  // This code only runs on the client

  Template.body.helpers({

    dirChanges: function(){
      return DirChanges.find({})
    }
  });

}


if (Meteor.isServer) {

  Meteor.startup(function () {
  });
}
