angular.module('whiteboard.services.menuhandler', [])
.factory('MenuHandler', ['BoardData', function (BoardData) {

  var $menuOpener;
  var $firstLevelMenu;
  var $secondLevelMenu;

  var menuWidth = 200; // Pixels
  // This variable set the width of the area that trigger the 'show child menu' event
  var activeArea = menuWidth / 2;
  var itemWithThirdLevel = {
    'fill': false
  };

  function setToolbarElements (element) {
    $menuOpener = element.find('.menu-opener');
    $firstLevelMenu = element.find('.menu.first-level');
    $secondLevelMenu = element.find('.menu.second-level');
  }

  function firstLevelHandler (ev, action) {
    action = action || 'show';

    if (action === 'show') {
      showFirstLevel();
    } else if (action === 'hide'){
      hideThirdLevel();
      hideSecondLevel();
      hideFirstLevel();
    }
  }
  function secondLevelHandler (ev, child) {
    var x = ev.clientX;
    console.log(ev)

    if (x < menuWidth && ev.type === 'mouseleave'){
      hideSecondLevel(child);
    } else if (x > activeArea) {
      // SHOw
      showSecondLevel(child);
    } else {
      // CLOSE
      hideSecondLevel(child);
    }
  }

  function selectToolHandler (ev, tool, element) {
    //console.log(tool);
    var x = ev.clientX;
    // console.log(itemWithThirdLevel[tool], tool)
    if (itemWithThirdLevel[tool] === undefined) {
      if (ev.type === 'mouseover') {
        // console.log('mouseover :)')
        showTriggerSelect(element);
      } else if (ev.type === 'mouseleave') {
        hideTriggerSelect(element);
      }

      if (x >= 380) {
        BoardData.setCurrentToolName(tool);
      }
    } else { 
      var child = element.find('.menu.third-level');
      if (x < 400 && ev.type === 'mouseleave'){
        hideThirdLevel(child);
        console.log(1);
      } else if (x > 300) {
        // SHOw
        showThirdLevel(child);
        console.log(2);
      } else {
        // CLOSE
        console.log(3);
        hideThirdLevel(child);
      }
    }
  }

  function showFirstLevel () {
    $menuOpener.removeClass('show');
    $firstLevelMenu.addClass('show');
  }

  function hideFirstLevel () {
    $firstLevelMenu.removeClass('show');
    $menuOpener.addClass('show');
  }

  function showSecondLevel (child) {
    $secondLevelMenu.filter('#' + child).addClass('show');
  }

  function hideSecondLevel (child) {
    if (child) {
      $secondLevelMenu.filter('#' + child).removeClass('show'); 
    } else {
      $secondLevelMenu.removeClass('show');  
    }
  }

  function showThirdLevel (child) {
    console.log(child)
    child.addClass('show');
  }

  function hideThirdLevel (child) {
    if (child) {
      child.removeClass('show');
    } else {
      // FIX THIS SHIT
      $('.menu.third-level').removeClass('show');
    }
  }

  function showTriggerSelect (element) {
    element.find('.trigger-select-tool').addClass('show');
  }
  
  function hideTriggerSelect (element) {
    element.find('.trigger-select-tool').removeClass('show');
  }

  return {
    setToolbarElements: setToolbarElements,
    firstLevelHandler: firstLevelHandler,
    secondLevelHandler: secondLevelHandler,
    selectToolHandler: selectToolHandler
  }

}]);