angular.module('whiteboard.services.leapMotion', [])
.factory('LeapMotion', ['EventHandler', function (EventHandler) {

  // var controller = new Leap.Controller({enableGestures: true})
  //   .use('screenPosition', {scale: 0.25})
  //   .connect()
  //   .on('frame', function(frame){

  //     // if (frame.valid && frame.gestures.length > 0) {
  //     //   frame.gestures.forEach(function(gesture){
  //     //       switch (gesture.type){
  //     //         case "circle":
  //     //           console.log("Circle Gesture");
  //     //           break;
  //     //         case "keyTap":
  //     //           console.log("Key Tap Gesture");
  //     //           break;
  //     //         case "screenTap":
  //     //           console.log("Screen Tap Gesture");
  //     //           break;
  //     //         case "swipe":
  //     //           console.log("Swipe Gesture");
  //     //           break;
  //     //       }
  //     //   });
  //     // }

  //     frame.hands.forEach(function (hand, index) {
  //       console.log(hand.indexFinger.touchZone);
  //       EventHandler.cursor(hand.indexFinger.screenPosition());
  //       if (hand.indexFinger.extended) {
  //         //
  //       } 
  //       if (hand.grabStrength === 1) {
  //         // console.log('grabStrength === 1')
  //         EventHandler.grabShape(hand.screenPosition());
  //         //console.log(hand.pinchStrength)
  //       }

  //       if (hand.pinchStrength === 1) {
  //         // console.log('pinchStrength === 1');
  //       }
  //     });
  //   })

  return {};
}]);
