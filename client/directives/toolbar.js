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
    controller: function ($scope, MenuHandler) {

      $scope.menuStructure = [
        ['Draw', ['path', 'line', 'arrow', 'rectangle', 'circle']], 
        ['Tool', []],
        ['Color', []]
      ];
      
      
    },
    link: function (scope, element, attrs, ctrls) {

      var toolbarCtrl = ctrls[1];



 
      
      scope.wbFillColorSelect = scope.wbFillColorSelect === undefined ? 'transparent' : scope.wbFillColorSelect;
      scope.wbStrokeColorSelect = scope.wbStrokeColorSelect === undefined ? '#000000' : scope.wbStrokeColorSelect;
      // scope.wbColorSelect = scope.wbColorSelect === undefined ? '#000000' : scope.wbColorSelect;

      // scope.$watchGroup(['wbFillColorSelect', 'wbStrokeColorSelect'], function(vals) {
      //   BoardData.setColors(vals[0], vals[1]);
      // }, false);
      
      
    }
  };
}])