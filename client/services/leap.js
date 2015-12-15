angular.module('whiteboard.services.leapMotion', [])
.factory('LeapMotion', ['EventHandler', function () {
  Leap.loop(function (frame) {
    if(frame.valid && frame.gestures.length > 0){
      frame.gestures.forEach(function(gesture){
          switch (gesture.type){
            case "circle":
                console.log("Circle Gesture");
                break;
            case "keyTap":
                console.log("Key Tap Gesture");
                break;
            case "screenTap":
                console.log("Screen Tap Gesture");
                break;
            case "swipe":
                console.log("Swipe Gesture");
                break;
          }
      });
    }
    // frame.hands.forEach(function (hand, index) {

    // });
  }).use('screenPosition', {scale: 0.25});
  return {};
}]);
