angular.module('whiteboard')
.directive('wbToolbar', ['BoardData', 'Zoom', function (BoardData, Zoom) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/toolbar.html',
    require: ['^wbBoard'],
    scope: { 
      wbToolSelect: '@',
      wbZoomScale: '@',
      wbColorSelect: '@'
    },
    // controller: function ($scope) {
    	
    // },
    link: function (scope, element, attrs, ctrls) {
    	var isExpanded = false;

    	scope.expandMenu = function (menuSide) {
    		//console.log(menuSide, element);
    		if (!isExpanded) {
    			var tbElements = element.find('.toolbar.left');
    			tbElements.each(function (i, element) {
    				$(element).addClass('expanded');
    				isExpanded = true;
    			})
    		}
    	};

    	scope.shrinkMenu = function (menuSide) {
    		//console.log(menuSide, element);
    		if (isExpanded) {
	    		var tbElements = element.find('.toolbar.left');
	    		tbElements.each(function (i, element) {
    				$(element).removeClass('expanded');
    				isExpanded = false;
    			})
    		}
    	}

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
    }
  };
}])