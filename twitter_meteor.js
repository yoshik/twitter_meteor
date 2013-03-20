function log(err) {console.log(err);}

var M = Meteor;
if (M.isClient) {
  var T = Template;
  T.loginout.events({
    'click #login' : function () {
      M.loginWithTwitter(function (err) { log(err);});
    }
  });
  T.loginout.events({
    'click #logout' : function () {
      M.logout(function (err) { log(err);});
    }
  });
}

if (M.isServer) {
  M.startup(function () {
    var myConsumerKey = "xxxxxxxxxxxxxxxxxxxx";
    var myConsumerSec = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    Accounts.loginServiceConfiguration.insert({
      service:     "twitter",
      consumerKey: myConsumerKey,
      secret:      myConsumerSec,
      requestOfflineToken:true
    });
  });
}
