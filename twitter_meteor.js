var M = Meteor;
var log = console.log;

var Tweets = new M.Collection("tweets");

if (M.isClient) {
  var T = Template;

  T.loginout.events({
    'click #login' : function () {
      M.loginWithTwitter(function(err){
        log(err);
      });
    }
  });

  T.loginout.events({
    'click #logout' : function () {
      M.logout(function(err){
        log(err);
      });
    }
  });

  T.post.events({
    'click #send' : function() {
      M.call("screenName", function(err,name){
        if(name){
          var tweet = {
            'name': M.user().profile.name,
            'disp': '@'+name,
            'text': $("#text").val(),
            'time': Date.now()
          };
          Tweets.insert(tweet);
        }
      });
    }
  });

  T.tweet.tweets = function() {
    var cursor = Tweets.find({},{sort:{'time':-1},limit:30});
    return cursor;
  };
}

if (M.isServer) {

  M.startup(function () {
    //Tweets.remove({});
    var myConsumerKey = "xxxxxxxxxxxxxxxxxxxx";
    var myConsumerSec = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    Accounts.loginServiceConfiguration.insert({
      consumerKey: myConsumerKey,
      secret:      myConsumerSec,
      service:     'twitter',
      requestOfflineToken:true
    });
  });

  M.methods({
    screenName : function() {
      try {
        return M.user().services.twitter.screenName;
      } catch(e) {
        return null;
      }
    }
  });

}
