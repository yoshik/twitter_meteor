var M = Meteor;
var log = console.log;

var Tweets = new M.Collection("tweets");

if (M.isClient) {
  var T = Template;

  var screenName = 'NO_NAME';
  M.startup(function () {
    M.call("screenName", function(err,name){screenName="@"+name;});
  });

  T.loginout.events({
    'click #login' : function () {
      M.loginWithTwitter(function(err){log(err);});
    }
  });
  T.loginout.events({
    'click #logout' : function () {
      M.logout(function(err){log(err);});
    }
  });
  T.post.events({
    'click #send' : function() {
    var tweet = {
        'user': screenName,
        'text': $("#text").val(),
        'time': Date.now()
      };
    Tweets.insert(tweet);
    }
  });

  T.tweet.tweets = function() {
    var cursor = Tweets.find();
    return cursor;
  };
}

if (M.isServer) {

  M.startup(function () {
    var myConsumerKey = "xxxxxxxxxxxxxxxxxxxx";
    var myConsumerSec = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    Accounts.loginServiceConfiguration.insert({
      consumerKey: myConsumerKey,
      secret:      myConsumerSec,
      service:     'twitter',
      requestOfflineToken:true
    });
    Tweets.remove({});
    Tweets.insert({'user':'Yoshik','text':'hello,world','time':Date.now()});
  });

  M.methods({
    screenName : function() {
      try {
        return M.user().services.twitter.screenName;
      } catch(e) {
        return "anonymous";
      }
    }
  });

}
