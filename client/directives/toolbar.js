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

      var thickness = [
        '10',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4',
        '3',
        '2',
        '1'
      ];

      // $scope.colorIconSVG = 'data:image/svg+xml;utf8,<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118.61 131.87"><path class="outer-circle test" d="M324.83,479.36a53.88,53.88,0,0,1-11.47-1.64c-25-6.41-45.24-30.84-48.83-56.35a77.29,77.29,0,0,1,1.34-29.75,57.24,57.24,0,0,1,16.26-28.38s13.15-12.24,31.75-14.7c1-.13,2-0.24,2-0.24,2.22-.25,4.1-0.38,5.51-0.45l6.79-.16a71.48,71.48,0,0,1,9.22.8c6.7,1,20.48,3.61,32,13.77,19.36,17,14.9,41.71-.4,54.95-3.19,2.76-6.64,5.24-10,7.8-4.89,3.71-6,8.21-4.09,14.13,1.58,4.77,3.24,10,2.9,14.84a26.66,26.66,0,0,1-4.24,13s-6.3,9.63-17.59,11.71c-0.65.12-2.67,0.41-4.65,0.65a28.85,28.85,0,0,1-3.41.27A23.31,23.31,0,0,1,324.83,479.36Zm2.33-127.67c-27.49-.13-47,10.82-55,32.84-9.41,25.79-5.38,50,12.91,71.12,10.35,11.94,23.28,19.29,39.38,19.87,23.62,0.85,34.15-13.05,27-35.45-0.13-.42-0.27-0.85-0.4-1.27-1.84-5.64-.75-10.62,3.65-14.62a72.64,72.64,0,0,1,9.85-8c16-10.06,21.48-39.68-1.82-54.75A61.42,61.42,0,0,0,327.16,351.69Z" transform="translate(-263.68 -347.67)"/><path class="s" d="M326.77,436.06a15.06,15.06,0,0,1,.75,30.11c-8.19.35-15.57-6.76-15.6-15A15.41,15.41,0,0,1,326.77,436.06Zm0.25,26c6.58,0,10.81-4.16,10.95-10.7,0.14-6.85-4.22-11.3-11-11.28-6.58,0-10.81,4.16-10.95,10.7C315.84,457.67,320.2,462.12,327,462.1Z" transform="translate(-263.68 -347.67)"/><path class="small-circle white" d="M325.71,361.22c4.74,0,8.91,3.94,10.41,9.74,1.56,6-.5,12.39-5,15.5-3.7,2.55-7.43,2.72-11.13,0-4.29-3.13-6.33-9.86-4.77-15.66S321,361.18,325.71,361.22Zm6.91,14c0.12-5.5-2.78-9.63-6.84-9.73s-6.88,3.54-7.12,8.78c-0.27,5.83,2.84,10.2,7.15,10.06C329.69,384.16,332.5,380.39,332.62,375.18Z" transform="translate(-263.68 -347.67)"/><path class="small-circle white" d="M307.28,388.48c-0.13,7.18-5.49,13.48-11.39,13.38s-10.9-6.68-10.77-13.91,5.41-13.54,11.34-13.35S307.41,381.24,307.28,388.48Zm-4.09,0c0.08-5.52-2.88-9.6-7-9.61-3.92,0-6.81,3.66-7,8.89-0.21,5.5,2.59,9.69,6.62,9.94S303.12,394,303.19,388.44Z" transform="translate(-263.68 -347.67)"/><path class="small-circle white" d="M354.14,401.33a12,12,0,0,1-6.92-3.81,12.34,12.34,0,0,1-2.56-5.31c-2.05-7.3,1.59-15.18,7.73-17.12,5-1.59,10.23,1.4,12.53,7.22,2.81,7.1-.22,16.06-6,18.46A9.44,9.44,0,0,1,354.14,401.33Zm7.91-12.78c0.12-5.5-2.79-9.63-6.86-9.72s-6.87,3.55-7.11,8.79c-0.26,5.83,2.85,10.2,7.16,10.05C359.12,397.53,361.94,393.76,362.05,388.55Z" transform="translate(-263.68 -347.67)"/><path class="small-circle white" d="M293.09,436.64c-4.44-.15-8.44-3.94-10-9.44-1.69-6.1.52-13,5.15-16.1a8.86,8.86,0,0,1,10.6.06c4.6,3.1,6.75,10.07,5,16.14C302.36,432.79,297.71,436.79,293.09,436.64Zm7.42-13.55c0-5.51-3-9.56-7.09-9.49-3.9.07-6.73,3.78-6.88,9-0.15,5.53,2.68,9.65,6.74,9.82S300.49,428.61,300.52,423.09Z" transform="translate(-263.68 -347.67)"/></svg>';

      $scope.menuStructure = [
        ['Draw', ['Path', 'Line', 'Arrow', 'Rectangle', 'Circle', 'Text']], 
        ['Tool', ['Magnify', 'Eraser', 'Pan', 'Move', 'Copy']],
        ['Color', [['Fill', fill], ['Stroke', stroke], ['Thickness', thickness]]]
      ];

      
      
      $scope.$on('toggleAllSubmenu', function (ev, msg) {
        if (msg.action === 'hide') {
          // console.log('wbToolbar: closing all submenus')
          $scope.$broadcast('toggleSubmenu', msg)
        }
      });

      $scope.$on('resetBackgrounds', function (ev, msg) {

        if (Array.isArray(msg.target)) {
          msg.target.forEach(function (target) {
            $scope.$broadcast('resetTargetBackground', {target: target});    
          })
        } else {
          $scope.$broadcast('resetTargetBackground', msg);
        }
      })

    },
    link: function (scope, element, attrs, ctrls) {

      // var $colorIcon = element.find('.icon-color');
      

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
      
      // scope.$on('changeIconColors', function (event, action) {
      //   console.log(scope.colorIconSVG)
      //   console.log(action)
      //   if (action.type === 'fill') {
      //     // $colorIcon.find('small-circle').attr({'class': 'small-circle fill-' + action.color.substr(1)})
      //     $colorIcon.css({'background-image': 'url(' + scope.colorIconSVG + ')'});
      //   } else {
      //     $colorIcon.css({'background-image': 'url(' + scope.colorIconSVG + ')'});
      //     // $colorIcon.find('outer-circle').attr({'class': 'outer-circle stroke-' + action.color.substr(1)})
      //   }
      // });
      
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
        if (ev.buttons === 0 && ev.type === 'mouseover' && (angular.element(ev.relatedTarget).is('svg') || angular.element(ev.relatedTarget)[0].raphael)) {
          // console.log(angular.element(ev.relatedTarget).is('svg'))
          // console.log('add class show');
          console.log(ev.buttons)
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
            // console.log('Should open third level')
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

      this.setThickness = function (thickness) {
        BoardData.setStrokeWidth(thickness);
      }

    },
    link: function (scope, element, attrs, submenuItemsCtrl) {

      var updateIconColors = function (type, color) {
        console.log('a')
        scope.$emit('changeIconColors', {type: type, color: color});
      };

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
          // console.log('A')
          submenuItemsCtrl.setColors(attrs.wbColorType, attrs.wbColor);
          // updateIconColors(attrs.wbColorType, attrs.wbColor);
          scope.$emit('activateMenu', 'hide');
        } else if (attrs.wbThickness && (angular.element(ev.relatedTarget).is('svg') || angular.element(ev.relatedTarget)[0].raphael)) {
          // console.log('SET THICKNESS')
          submenuItemsCtrl.setThickness(attrs.wbThickness);
          scope.$emit('activateMenu', 'hide');
        } else if (attrs.wbTool && (angular.element(ev.relatedTarget).is('svg') || angular.element(ev.relatedTarget)[0].raphael)) {
          // console.log('b')
          scope.$emit('setCursorClass', {tool: attrs.wbTool});
          submenuItemsCtrl.setTool(attrs.wbTool);
          scope.$emit('activateMenu', 'hide');
        } else if (angular.element(ev.relatedTarget).hasClass('menu') || angular.element(ev.relatedTarget).hasClass('icon')) {
          // console.log(ev)
          scope.$emit('toggleAllSubmenu', {action: 'hide', level: '3'});
        }
        // console.log(angular.element(ev.relatedTarget).is('svg'))
      })
    }
  };
})
.directive('wbMenuOverHandler', function () {
  return {
    restrict: 'A',
    replace: false,
    require: 'wbMenuOverHandler',
    controllerAs: 'menuOver',
    controller: function ($scope) {
      var elemWidth;
      // var elemLeftOffset;

      // this.storeElemLeftOffset = function (leftOffset) {
      //   elemLeftOffset = leftOffset;
      // };

      // this.getElemLeftOffset = function () {
      //   return elemLeftOffset;
      // };

      this.storeElemWidth = function (width) {
        elemWidth = width;
      };

      this.getElemWidth = function () {
        return elemWidth;
      };

      this.calcBg = function (mouseX, leftOffset) {
        var width = this.getElemWidth();

        //100 : elemWidth = x : mouseX 
        var bgSizes = {};
        bgSizes.overed = (mouseX - leftOffset) * 100 / this.getElemWidth();
        // bgSizes.free = 100 - bgSizes.overed;
        // bgSizes.free = 0;

        return bgSizes;
      };

      this.hexToRGBA = function (hex, opacity) {
        opacity = opacity || 90;

        hex = hex.replace('#','');
        r = parseInt(hex.substring(0,2), 16);
        g = parseInt(hex.substring(2,4), 16);
        b = parseInt(hex.substring(4,6), 16);

        result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
        return result;
      }

    },
    link: function (scope, element, attrs, ctrl) {
      // {background: linear-gradient(90deg, rgba(53,53,53,0.99) {{overed}}%, rgba(53,53,53,0.89) free%)}

      if (ctrl.getElemWidth() === undefined) {
        ctrl.storeElemWidth(element.width())
      }

      // console.log(element.offset())
      // ctrl.storeElemWidth(element.offset().left);

      var setBg = function (el, sizes) { 
        // console.log(sizes.overed, el.offset().left)
        el.css({'background': 'linear-gradient(90deg, rgba(177,102,24,0.96) ' + (sizes.overed) + '%, rgba(53,53,53,0.93) 0%)'})
      }

      var setColorBg = function (el, color, sizes) { 
        // console.log(sizes.overed, el.offset().left)
        var rgbaOver = ctrl.hexToRGBA(color, 100);
        var rgbaFree = ctrl.hexToRGBA(color, 90);
        el.css({'background': 'linear-gradient(90deg,  ' + rgbaOver + ' ' + (sizes.overed) + '%, ' + rgbaFree + ' 0%)'})
      }

      element.bind('mouseover', function (ev) {
        ev.stopPropagation();
        // console.log(ev);
        // console.log(ev.currentTarget)
        if (angular.element(ev.currentTarget).hasClass('level-two-items')) {
          var $levelOne = angular.element(ev.currentTarget).parents('.level-one')
          // console.log($levelOne)
          scope.$emit('resetBackgrounds', {target: 'level-two-items'});
          setBg($levelOne, {overed: 100});
        } else if (angular.element(ev.currentTarget).hasClass('level-one')) {
          scope.$emit('resetBackgrounds', {target: 'level-two-items'});
        } else if (angular.element(ev.currentTarget).hasClass('color-palette')) {
          // console.log('A')
          var $levelTwo = angular.element(ev.currentTarget).parents('.level-two-items')
          setBg($levelTwo, {overed: 100});
          scope.$emit('resetBackgrounds', {target: 'level-three-items'});
        } else if (angular.element(ev.currentTarget).hasClass('thickness')) {
          // console.log('A')
          var $levelTwo = angular.element(ev.currentTarget).parents('.level-two-items');
          // console.log($levelTwo)
          setBg($levelTwo, {overed: 100});
          scope.$emit('resetBackgrounds', {target: 'level-three-items'});
        }


      });

      element.bind('mousemove', function (ev) {
        ev.stopPropagation();

        var $el = angular.element(ev.currentTarget);
        // console.log('ev');
        if ($el.hasClass('level-one') || $el.hasClass('level-two-items') || $el.hasClass('thickness')) {
          // console.log('over level one');
          var bgSizes = ctrl.calcBg(ev.clientX, $el.offset().left);
          setBg($el, bgSizes);

        } else if ($el.hasClass('color-palette')) {
          var bgSizes = ctrl.calcBg(ev.clientX, $el.offset().left);
          setColorBg($el, scope.color, bgSizes);

        }
      });

      element.bind('mouseleave', function (ev) {

        var $elTarget = angular.element(ev.currentTarget);
        var $elToElement = angular.element(ev.toElement);

        // console.log($elTarget)
        if ($elTarget.hasClass('level-two-items')) {
          // console.log(ev)
          if ($elToElement.is('svg') || angular.element(ev.relatedTarget)[0].raphael) {
            // console.log(1)
            scope.$emit('resetBackgrounds', {target: 'all'});
          } else if ($elToElement.hasClass('wb-submenu-opener')) {
            // console.log(2)
            scope.$emit('resetBackgrounds', {target: 'all'});
          } else {
            // console.log(3)
            scope.$emit('resetBackgrounds', {target: 'level-two-items'});
          }
        } else if ($elTarget.hasClass('level-one')) {
          // console.log('reset!')
          scope.$emit('resetBackgrounds', {target: 'level-one'});
        } else if ($elTarget.hasClass('color-palette') || $elTarget.hasClass('thickness')) {
          if ($elToElement.is('svg') || angular.element(ev.relatedTarget)[0].raphael) {
            scope.$emit('resetBackgrounds', {target: 'all'});
          } else if ($elToElement.hasClass('wb-submenu-opener') || $elToElement.hasClass('level-three-items')) {
            // scope.$emit('resetBackgrounds', {target: 'all'});
            scope.$emit('resetBackgrounds', {target: ['color-palette', 'thickness']});
          } 
        }
      })

      scope.$on('resetTargetBackground', function (ev, msg) {
        // console.log('should reset color', element)
        if (msg.target === 'all') {
          // console.log('- ', element)
          element.hasClass('color-palette') ? setColorBg(element, scope.color, {overed: 0}) : setBg(element, {overed: 0});  
        } else if (element.hasClass('color-palette') && (msg.target === 'level-three-items' || msg.target === 'color-palette')) {
          // console.log(scope.color)
          setColorBg(element, scope.color, {overed: 0});
        } else if (element.hasClass('thickness') && (msg.target === 'level-three-items' || msg.target === 'thickness')) {
          setBg(element, {overed: 0});
        } else if (element.hasClass(msg.target)) {
          // console.log('here', msg.target)
          setBg(element, {overed: 0});
        }
        
      })

    }
  };
})
