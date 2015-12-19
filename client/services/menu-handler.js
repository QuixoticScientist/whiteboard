angular.module('whiteboard.services.menuhandler', [])
.factory('MenuHandler', function () {

  var $menuOpener;
  var $firstLevelMenu;
  var $secondLevelMenu;

  function setToolbarElements (element) {
    $menuOpener = element.find('.menu-opener');
    $firstLevelMenu = element.find('.menu.first-level');
    $secondLevelMenu = element.find('.menu.second-level');
  }

  function showFirstLevel (ev) {
    // hide menuOpener
    $menuOpener.removeClass('show');
    // show first menu
    $firstLevelMenu.addClass('show');
    // attach over listener to sub levels
  }

  function secondLevelHandler (ev, child) {
    var x = ev.clientX;
    console.log(x)
    if (x > 100) {
      // SHOw
      showSecondLevel(child);
    } else {
      // CLOSE
      hideSecondLevel(child);
    }
  }

  function showSecondLevel (child) {
    $secondLevelMenu.filter('#' + child).addClass('show');
  }

  function hideSecondLevel (child) {
    $secondLevelMenu.filter('#' + child).removeClass('show'); 
  }

  return {
    setToolbarElements: setToolbarElements,
    showFirstLevel: showFirstLevel,
    secondLevelHandler: secondLevelHandler
  }





















































































  // var $toolbar;
  // var $firstLevelMenu;
  // var $secondLevelMenu;

  // var levelDisplayed = null;


  // function setToolbarElements (element) {
  //   $toolbar = element;
  //   $firstLevelMenu = element.find('.first-level');
  //   $secondLevelMenu = element.find('.second-level');
  // }


  // function menuEventsDispatcher (ev) {
  //   // get level displayed
  //   // var levelDisplayed = getLevelDisplayed();
  //   var x = ev.clientX;
  //   console.log(ev)
  //   // if none
  //   if (levelDisplayed === null) {
  //     // show first;
  //     showFirstLevel();
  //   } 
  //   // if first
  //   else if (levelDisplayed === 'first') {
  //     // if x > 100
  //     if (x > 100) {
  //       // show second level
  //       showSecondLevel();
  //     }
  //     // if x < 100 and second level is shown
  //       // hide second level
  //     // if x > 400
  //       // hide all
  //   }
  //   // if second
  //     // if x > 300
  //       // show third
  //     // if x < 300 and third level is shown
  //       // hide third level
  //     // if x > 600
  //       // hide all
  // }

  // // function getLevelDisplayed () {
  // //   return levelDisplayed;
  // // }

  // function setLevelDisplayed (level) {
  //   levelDisplayed = level;
  // }
  // // function menuEventsDispatcher (ev) {
  // //   var x = ev.clientX;
  // //   if (x < 3) {
  // //     // SHOW toolbar
  // //     toolbarShow();
  // //     // SHOW firstLevel

  // //     //mouseEvents[ev.type](ev, 'firstLevel');
  // //   } else if (x > 6) {
  // //     // HIDE toolbar
  // //     // HIDE firstLevel
  // //   } else if (x > 300) {
  // //     // SHOW thirdLevel
  // //     // mouseEvents[ev.type](ev, 'secondLevel');
  // //   } else if (x > 100) {
  // //     // SHOW secondLevel
  // //     // mouseEvents[ev.type](ev, 'secondLevel');
  // //     // console.log('Open SECOND')
  // //   } else if (x < 300) {
  // //     // HIDE thirdLevel
  // //   } else if (x < 100) {
  // //     // HIDE secondLevel
  // //     // mouseEvents[ev.type](ev, 'secondLevel');
  // //   }
  // // }

  // function showFirstLevel () {
  //   setLevelDisplayed('first');
  //   toolbar('show');
  //   firstLevel('show');
  // }

  // function showSecondLevel () {
  //   setLevelDisplayed('second');
  //   secondLevel('show');
  // }

  // function toolbar (action) {
  //   $toolbar.addClass(action);
  // }

  // function firstLevel (action) {
  //   $firstLevelMenu.addClass(action);
  // }

  // function secondLevel (action) {
  //   $secondLevelMenu.addClass(action);
  // }
  // // function setMenuLevelStatus (level, status) {
  // //   isOpen[level] = status;
  // // }

  // // function checkMenuStatus (level) {
  // //   return isOpen[level];
  // // }



  // return {
  //   setToolbarElements: setToolbarElements,
  //   menuEventsDispatcher: menuEventsDispatcher
  // };

});