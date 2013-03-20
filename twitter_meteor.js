var M = Meteor;
var log = console.log;
if (M.isClient) {var T = Template;}

var Tweets = new M.Collection("tweets");

function relationTime (time) {
  var ints = {second: 1,minute: 60,hour: 3600,day: 86400,week: 604800,month: 2592000,year: 31536000};
  time = +new Date(time*1);
  var gap = ((+new Date()) - time) / 1000,amount, measure;
  if(gap<2){return 'just now'}
  for (var i in ints) {if (gap > ints[i]) { measure = i; }}
  amount = gap / ints[measure];
  amount = gap > ints.day ? (Math.round(amount * 100) / 100) : Math.round(amount);
  return Math.floor(amount) + ' ' + measure + (amount > 1 ? 's' : '') + ' ago';
}
function setTime(){
  $('.time').each(function(){
    $(this).text(relationTime($(this).attr('data-time')));
  });
}

if (M.isClient) {

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
            'disp': name,
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

  setInterval("setTime()",1000);

}

if (M.isServer) {

  M.startup(function () {
    Tweets.remove({});
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
