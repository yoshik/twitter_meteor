var M = Meteor;
if (M.isClient) {
  var T = Template;
  T.hello.greeting = function () {
    return "Welcome to twitter_meteor.";
  };

  T.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (M.isServer) {
  M.startup(function () {
    // code to run on server at startup
  });
}
