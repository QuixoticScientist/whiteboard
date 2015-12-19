angular.module('whiteboard')
.directive('wbToolbar', ['BoardData', 'Zoom', function (BoardData, Zoom) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/toolbar.html',
    require: ['^wbBoard', 'wbToolbar'],
    scope: { 
      wbToolSelect: '@',
      wbZoomScale: '@',
      wbColorSelect: '@'
    },
    controller: function (MenuHandler) {

      this.setToolbarElements = function (element) {
        MenuHandler.setToolbarElements(element);
      };

      this.showMenu = function (ev) {
        MenuHandler.showFirstLevel(ev);
      };
      
    },
    link: function (scope, element, attrs, ctrls) {
      
      // FROM MERGE CONFLICT
      scope.wbStrokeWidthDown = function () {
        if (scope.wbStrokeWidth > 0.25) scope.wbStrokeWidth -= 0.25;
      };

      scope.wbStrokeWidthUp = function () {
        scope.wbStrokeWidth += 0.25;
      };

      var toolbarCtrl = ctrls[1];

      toolbarCtrl.setToolbarElements(element);

      element.find('.menu-opener').bind('mouseover', toolbarCtrl.showMenu);

      scope.wbZoomScaleDown = function () {
        scope.wbZoomScale -= 0.25;
      };

      scope.wbZoomScaleUp = function () {
        scope.wbZoomScale += 0.25;
      };

      scope.wbToolSelect = scope.wbToolSelect === undefined ? 'line' : scope.wbToolSelect;
      scope.$watch('wbToolSelect', function(newTool, prevTool) {
        BoardData.setCurrentToolName(newTool);
      }, false);
      
      scope.wbFillColorSelect = scope.wbFillColorSelect === undefined ? 'transparent' : scope.wbFillColorSelect;
      scope.wbStrokeColorSelect = scope.wbStrokeColorSelect === undefined ? '#000000' : scope.wbStrokeColorSelect;
      // scope.wbColorSelect = scope.wbColorSelect === undefined ? '#000000' : scope.wbColorSelect;
      scope.$watchGroup(['wbFillColorSelect', 'wbStrokeColorSelect'], function(vals) {
        //console.log('Fill: ', vals[0], ' Stroke: ', vals[1]);
        BoardData.setColors(vals[0], vals[1]);
      }, false);
      
      scope.wbZoomScale = scope.wbZoomScale === undefined ? 1 : scope.wbZoomScale;
      scope.$watch('wbZoomScale', function(newScale, prevScale) {
        if (newScale != 0 && !isNaN(newScale)) {
          BoardData.setZoomScale(newScale);
          Zoom.zoom();
        }
      }, false);

      // FROM MERGE CONFLICT
      scope.wbStrokeWidth = scope.wbStrokeWidth === undefined ? 1 : scope.wbStrokeWidth;
      scope.$watch('wbStrokeWidth', function(newScale, prevScale) {
        BoardData.setStrokeWidth(newScale);
      }, false);
    }
  };
}])
.directive('wbFirstLevel', function () {
  return {
    restrict: 'C',
    require: ['^wbToolbar', 'wbFirstLevel'],
    controller: function (MenuHandler) {
      this.secondLevelHandler = function (ev, child) {
        console.log('a')
        MenuHandler.secondLevelHandler(ev, child);
      } 
    },
    link: function (scope, element, attrs, ctrls) {
      var firstLevelCtrl = ctrls[1];
      
      element.bind('mousemove', function (ev) {
        firstLevelCtrl.secondLevelHandler(ev, attrs.wbSubMenuName);
      });
    }
  };
});