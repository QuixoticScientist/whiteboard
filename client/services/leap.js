angular.module('whiteboard.services.leapMotion', [])
.factory('LeapMotion', ['EventHandler', function (EventHandler) {

  var controller = new Leap.Controller({enableGestures: true})
    .use('screenPosition')
    .connect()
    .on('frame', function(frame){
      frame.hands.forEach(function (hand, index) {
        EventHandler.cursor(hand.screenPosition());
        if (hand.grabStrength === 1) {
          EventHandler.grabShape(hand.screenPosition());
        }
      });
    })

  // Leap.loop(function (frame) {
  //   if(frame.valid && frame.gestures.length > 0){
  //     frame.gestures.forEach(function(gesture){
  //         switch (gesture.type){
  //           case "circle":
  //             console.log("Firing Grab");
  //             EventHandler.grabShape(frame);
  //             break;
  //           // case "keyTap":
  //           //     console.log("Key Tap Gesture");
  //           //     break;
  //           // case "screenTap":
  //           //     console.log("Screen Tap Gesture");
  //           //     break;
  //           // case "swipe":
  //           //     console.log("Swipe Gesture");
  //           //     break;
  //         }
  //     });
  //   }

    // Tool selection by finger

    // Thumb plus finger

    // Palm move tool - dot on screen
    // Grab - pick object


    // frame.hands.forEach(function (hand, index) {

    // });
  // }).use('screenPosition', {scale: 0.25});
  return {};
}]);
