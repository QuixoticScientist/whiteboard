angular.module('whiteboard')
.directive('wbToolbar', ['BoardData', 'Zoom', function (BoardData, Zoom) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/toolbar.html',
    require: ['^wbBoard', 'wbToolbar'],
    // scope: { 
    //   wbToolSelect: '@',
    //   wbZoomScale: '@',
    //   wbColorSelect: '@'
    // },
    controller: function ($scope) {

      var fill = [
        '#e74c3c', 
        '#e67e22', 
        '#f1c40f', 
        '#1abc9c', 
        '#2ecc71', 
        '#3498db',
        '#9b59b6',
        '#34495e',
        '#95a5a6',
        '#ecf0f1',
      ];

      var stroke = [
        '#c0392b',
        '#d35400',
        '#f39c12',
        '#16a085',
        '#27ae60',
        '#2980b9',
        '#8e44ad',
        '#2c3e50',
        '#7f8c8d',
        '#bdc3c7',
      ];

      $scope.menuStructure = [
        ['Draw', ['Path', 'Line', 'Arrow', 'Rectangle', 'Circle']], 
        ['Tool', ['Magnify', 'Eraser', 'Pan', 'Move', 'Copy']],
        ['Color', [['Fill', fill], ['Stroke', stroke]]]
      ];

      
      
      $scope.$on('toggleAllSubmenu', function (ev, msg) {
        if (msg.action === 'hide') {
          // console.log('wbToolbar: closing all submenus')
          $scope.$broadcast('toggleSubmenu', msg)
        }
      })

    },
    link: function (scope, element, attrs, ctrls) {

      scope.$on('activateMenu', function (event, action) {
        // console.log(event, options);
        if (action === 'show') {
          element.addClass('show');
          scope.$broadcast('toggleMouseEv', action);
        } else {
          // scope.$broadcast('test', 'hide');
          element.removeClass('show');
          scope.$broadcast('toggleMouseEv', action);
        }
      });
      
      //scope.wbFillColorSelect = scope.wbFillColorSelect === undefined ? 'transparent' : scope.wbFillColorSelect;
      //scope.wbStrokeColorSelect = scope.wbStrokeColorSelect === undefined ? '#000000' : scope.wbStrokeColorSelect;
      
    }
  };
}])
.directive('wbMenuOpener', function () {
  return {
    restrict: 'C',
    replace: false,
    require: 'wbMenuOpener',
    scope: false,
    controller: function ($scope) {

      this.menuHandler = function (attr) {
        $scope.$emit('activateMenu', attr);
      }

    },
    link: function (scope, element, attrs, ctrl) {
      
      element.bind('mouseover mouseleave', function (ev) {
        if (ev.type === 'mouseover' && (angular.element(ev.relatedTarget).is('svg') || angular.element(ev.relatedTarget)[0].raphael)) {
          // console.log(angular.element(ev.relatedTarget).is('svg'))
          // console.log('add class show');

          ctrl.menuHandler('show');
          // element.addClass('show');
        } else {
          // console.log('remove class show');

          // ctrl.menuHandler('hide');
          
        }

      });
    }
  };
})
.directive('wbSubmenuOpener', function () {
  return {
    restrict: 'C',
    replace: false,
    require: 'wbSubmenuOpener',
    controller: function ($scope) {

      this.submenuOpener = function (action) {
        //if (action.level === 2) {
        this.submenuCloser({action: 'hide', level: action.level});
        //}
        $scope.$broadcast('toggleSubmenu', action);
      }

      this.submenuCloser = function (action) {
        // console.log('close?')
        $scope.$emit('toggleAllSubmenu', action);
      }

    },
    link: function (scope, element, attrs, submenuOpenerCtrl) {

      var bindMouseEv = function () {
        element.bind('mouseover mouseleave', function (ev) {
          // console.log(ev, attrs.wbLevel)
          if (ev.type === 'mouseover' && attrs.wbLevel === '2') {
            // console.log('Should open submenu', ev);
            submenuOpenerCtrl.submenuOpener({action: 'show', level: '2'});
          } else if (ev.type === 'mouseover' && attrs.wbLevel === '3') {
            // console.log('Should open the color palette!')
            submenuOpenerCtrl.submenuOpener({action: 'show', level: '3'});
          } else if (ev.type === 'mouseleave' && (angular.element(ev.toElement).hasClass('lvl1') || angular.element(ev.toElement).hasClass('level-one'))) {
            // console.log('Should close submenu');
            submenuOpenerCtrl.submenuCloser({action: 'hide', level: '2'});
          } else if (ev.type === 'mouseleave' && (angular.element(ev.toElement).hasClass('level-three') || angular.element(ev.toElement).hasClass('lvl2'))) {
            // console.log('close level three') 
            submenuOpenerCtrl.submenuCloser({action: 'hide', level: '3'});
          } else if (ev.type === 'mouseleave' && angular.element(ev.toElement).hasClass('wb-submenu-opener')) {
            // console.log('Here is where i broke D:');
            // console.log(ev)
            submenuOpenerCtrl.submenuCloser({action: 'hide', level: attrs.wbLevel});
          }
        });
      };

      var unbindMouseEv = function () {
        // console.log('EVENTS BOUND: ', jQuery._data(element, 'events'));
        element.unbind('mouseover mouseleave');
        submenuOpenerCtrl.submenuCloser({action: 'hide', level: 'all'});
      }

      scope.$on('toggleMouseEv', function (event, action) {
        // console.log('ACTION: ', action)
        if (action === 'show') {
          element.addClass('show');
          bindMouseEv();
        } else {
          element.removeClass('show');
          unbindMouseEv();
        }
      })

    }
  };
})
.directive('wbSubmenu', function () {
  return {
    restrict: 'C',
    replace: false,
    controller: function () {

    },
    link: function (scope, element, attrs, ctrl) {

      if (attrs.wbLevel === 3) {
        // console.log('Sono qui?')
      } else {
        scope.$on('toggleSubmenu', function (event, msg) {
          // console.log(msg, attrs.wbLevel);
          if (msg.action === 'show') {
            if (msg.level === attrs.wbLevel) {
              element.addClass('show');
            }
          } else {
            if (msg.level === attrs.wbLevel) {
              // console.log('DIE BASTARD')
              element.removeClass('show');
            } else if (msg.level === 'all') {
              element.removeClass('show');
            }
          }
        });
      }
    }
  };
})
.directive('wbSubmenuItems', function () {
  return {
    restrict: 'C',
    replace: false,
    require: 'wbSubmenuItems',
    controller: function ($scope, BoardData) {

      $scope.setAttributeTool = function (toolName) {
        if (typeof toolName === 'string') {
          return toolName.toLowerCase();
        }
        return toolName[0];
      }

      this.setTool = function (toolName) {
        BoardData.setCurrentToolName(toolName); 
      }

      this.setColors = function (type, color) {
        if (type === 'fill') {
          BoardData.setColors(color, null); 
        } else {
          BoardData.setColors(null, color); 
        }
      }

    },
    link: function (scope, element, attrs, submenuItemsCtrl) {

      element.bind('mouseover', function (ev) {
        //ev.stopPropagation();
        // console.log(attrs.wbTool)
      })

      element.bind('mouseleave', function (ev) {
        ev.stopPropagation();
        // console.log(angular.element(ev.currentTarget).hasClass('level-two-items'));
        // console.log('!!!!!!!!!!!!!!!!!', attrs.wbTool, ev);
        // if (angular.element(ev.currentTarget).hasClass('level-two-items')) { return; } 
        if (attrs.wbColor && (angular.element(ev.relatedTarget).is('svg') || angular.element(ev.relatedTarget)[0].raphael)) {
          console.log('A')
          submenuItemsCtrl.setColors(attrs.wbColorType, attrs.wbColor);
          scope.$emit('activateMenu', 'hide');
        } else if (attrs.wbTool && (angular.element(ev.relatedTarget).is('svg') || angular.element(ev.relatedTarget)[0].raphael)) {
          console.log('b')
          submenuItemsCtrl.setTool(attrs.wbTool)
          scope.$emit('activateMenu', 'hide');
        } else if (angular.element(ev.relatedTarget).hasClass('menu')) {
          console.log('c')
          scope.$emit('toggleAllSubmenu', {action: 'hide', level: '3'});
        }
        // console.log(angular.element(ev.relatedTarget).is('svg'))
      })
    }
  };
})
