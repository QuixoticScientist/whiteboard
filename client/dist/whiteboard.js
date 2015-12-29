angular.module('whiteboard', [
  'btford.socket-io',
  'whiteboard.services.receive',
  'whiteboard.services.broadcast',
  'whiteboard.services.shapebuilder',
  'whiteboard.services.shapeeditor',
  'whiteboard.services.shapemanipulation',
  'whiteboard.services.snap',
  'whiteboard.services.auth',
  'whiteboard.services.token',
  'whiteboard.services.sockets',
  'whiteboard.services.boarddata',
  'whiteboard.services.eventhandler',
  'whiteboard.services.inputhandler',
  'whiteboard.services.zoom',
  'whiteboard.services.leapMotion',
  'whiteboard.services.visualizer',
  // 'whiteboard.services.menuhandler',
  // 'colorpicker.module',
  'ngRoute'
])
.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        resolve: {
          'something': function (Sockets, Auth, $location) {
            var roomId = Auth.generateRandomId(5);
            Sockets.emit('roomId', {roomId: roomId});
            $location.path('/' + roomId);
          }
        }
      })
      .when('/:id', {
        templateUrl: 'views/board.html',
        resolve: {
          'somethingElse': function (Sockets, $location) {
            Sockets.emit('roomId', {roomId: $location.path().slice(1)});
          }
        },
        authenticate: true
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}]);
;angular.module('whiteboard')
.directive('wbBoard', ['BoardData', 'Broadcast', 'Receive', 'LeapMotion', function (BoardData) {
  return {
    restrict: 'A',
    require: ['wbBoard'],
    replace: true,
    template: 
      '<div id="board-container">' +
      '   <div wb-toolbar></div>' +
      '   <div wb-layers></div>' +
      '</div>',
    controller: function (InputHandler) {
      this.handleEvent = function (ev) {
        InputHandler[ev.type](ev);
      }
    },
    link: function (scope, element, attrs, ctrls) {
      var boardCtrl = ctrls[0];
      BoardData.createBoard(element);
      BoardData.getCanvas().bind('mousedown mouseup mousemove dblclick', boardCtrl.handleEvent);

      $('body').on('keypress', function (ev) {
        boardCtrl.handleEvent(ev);
      });

      // Required for menu handling
      // BoardData.getCanvas().bind('mouseover', function (ev) {
      //   console.log('mouseover')
      //   scope.$broadcast('menu', {
      //     action: 'close',
      //     ev: ev
      //   });
      // });      
    }
  }
}]);
;angular.module('whiteboard')
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
          console.log('wbToolbar: closing all submenus')
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
          if (ev.type === 'mouseover' && attrs.wbLevel === '2') {
            console.log('Should open submenu', ev);
            submenuOpenerCtrl.submenuOpener({action: 'show', level: '2'});
          } else if (ev.type === 'mouseover' && attrs.wbLevel === '3') {
            console.log('Should open the color palette!')
            submenuOpenerCtrl.submenuOpener({action: 'show', level: '3'});
          } else if (ev.type === 'mouseleave' && angular.element(ev.toElement).hasClass('menu-text')){
            console.log('Should close submenu');
            submenuOpenerCtrl.submenuCloser({action: 'hide', level: '2'});
          } else if (ev.type === 'mouseleave' && angular.element(ev.toElement).hasClass('level-three')) {
            // console.log(ev) 
            submenuOpenerCtrl.submenuCloser({action: 'hide', level: '3'});
          } else if (ev.type === 'mouseleave' && angular.element(ev.toElement).hasClass('wb-submenu-opener')) {
            console.log('Here is where i broke D:');
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
        console.log('Sono qui?')
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
        ev.stopPropagation();
        // console.log(attrs.wbTool)
      })

      element.bind('mouseleave', function (ev) {
        ev.stopPropagation();
        console.log('!!!!!!!!!!!!!!!!!', attrs.wbTool, angular.element(ev.relatedTarget));
        if (attrs.wbTool && (angular.element(ev.relatedTarget).is('svg') || angular.element(ev.relatedTarget)[0].raphael)) {
          submenuItemsCtrl.setTool(attrs.wbTool)
          scope.$emit('activateMenu', 'hide');
        } else if (attrs.wbColor && (angular.element(ev.relatedTarget).is('svg') || angular.element(ev.relatedTarget)[0].raphael)) {
          submenuItemsCtrl.setColors(attrs.wbColorType, attrs.wbColor);
          scope.$emit('activateMenu', 'hide');
        } else if (angular.element(ev.relatedTarget).hasClass('menu')) {
          scope.$emit('toggleAllSubmenu', {action: 'hide', level: '3'});
        }
        // console.log(angular.element(ev.relatedTarget).is('svg'))
      })
    }
  };
});angular.module('whiteboard.services.auth', [])
.factory('Auth', function ($http, $window) {

  var generateRandomId = function (length) {
    var id = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  };

  return {
    generateRandomId: generateRandomId
  };
});
;angular.module('whiteboard.services.boarddata', [])
.factory('BoardData', function () {
  //svgWidth/Height are the width and height of the DOM element
  var svgWidth = 1500; //sizeX
  var svgHeight = 1000; //sizeY
  //offsetX/Y measure the top-left point of the viewbox
  var offsetX = 0;
  var offsetY = 0;
  //scalingFactor is the level of zooming relative to the start
  var scalingFactor = 1;

  var board;
  var $canvas;
  //canvasMarginX/Y are the left and top margin of the SVG in the browser
  var canvasMarginX; //canvasX
  var canvasMarginY; //canvasY
  //viewBoxWidth/Height are needed for zooming
  var viewBoxWidth;// = svgWidth;
  var viewBoxHeight;// = svgHeight;
  var cursor;
  var shapeStorage = {};
  var currentShape;
  var currentShapeId;
  var editorShape;
  var socketId;

  var tool = {
    name: 'path',
    'stroke-width': 1,
    colors: {
      fill: 'transparent',
      stroke: '#000000'
    }
  };

  function createBoard (element) {

    ResizeSensorApi.create(document.getElementsByClassName('app-container')[0], handleWindowResize);

    board = Raphael(element[0]);
    board.setViewBox(0, 0, svgWidth, svgHeight, true);
    board.canvas.setAttribute('preserveAspectRatio', 'none');

    $canvas = element.find('svg');
    canvasMarginX = $canvas.position().left;
    canvasMarginY = $canvas.position().top;
  }

  function handleWindowResize (newPageSize) {
    svgWidth = newPageSize.width;
    svgHeight = newPageSize.height;

    viewBoxWidth = svgWidth * scalingFactor;
    viewBoxHeight = svgHeight * scalingFactor;
    var offset = getOffset();
    board.setViewBox(offset.x, offset.y, viewBoxWidth, viewBoxHeight, true);
  }

  function getBoard () {
    return board;
  }

  function getCursor () {
    return cursor;
  }

  function setCursor () {
    cursor = board.circle(window.innerWidth / 2, window.innerHeight / 2, 5);
    return cursor;
  }

  function moveCursor (screenPosition) {
    cursor.attr({
      cx: Math.floor(screenPosition[0]),
      cy: Math.floor(screenPosition[1])
    })
  }

  function setEditorShape (shape) {
    editorShape = shape //shapeStorage[shape.socketId][shape.myid];
  }

  function unsetEditorShape () {
    editorShape = null;
  }

  function getEditorShape () {
    return editorShape;
  }

  function getViewBoxDims () {
    return {
      width: viewBoxWidth,
      height: viewBoxHeight
    };
  }

  function setViewBoxDims (newViewBoxDims) {
    viewBoxWidth = newViewBoxDims.width;
    viewBoxHeight = newViewBoxDims.height;
  }

  function getOriginalDims () {
    return {
      width: svgWidth,
      height: svgHeight
    };
  }

  function getCanvasMargin () {
    return {
      x: canvasMarginX,
      y: canvasMarginY
    };
  }

  function getScalingFactor () {
    return scalingFactor;
  }

  function getOffset () {
    return {
      x: offsetX,
      y: offsetY
    }
  }

  function setOffset (newOffset) {
    offsetX = newOffset.x;
    offsetY = newOffset.y;
  }

  function getCanvas () {
    return $canvas;
  }

  function setSocketId (id) {
    socketId = id;
  }

  function getSocketId () {
    return socketId;
  }

  function pushToStorage (id, socketId, shape) {
    if (!shapeStorage[socketId]) {
      shapeStorage[socketId] = {};
    }
    shapeStorage[socketId][id] = shape;
  }

  function getShapeById (id, socketId) {
    return shapeStorage[socketId][id];
  }

  function getCurrentShape () {
    return currentShape;
  }

  function setCurrentShape (id) {
    currentShape = shapeStorage[socketId][id];
  }

  function unsetCurrentShape () {
    currentShape = null;
  }

  function getCurrentShapeId () {
    return currentShapeId;
  }

  function generateShapeId () {
    currentShapeId = Raphael._oid;
    return currentShapeId;
  }

  function getCurrentTool () {
    return tool;
  }

  function setCurrentToolName (name) {
    tool.name = name;
  }

  function setColors (fill, stroke) {
    fill = fill || tool.colors.fill;
    stroke = stroke || tool.colors.stroke;
    
    tool.colors.fill = fill;
    tool.colors.stroke = stroke; 
  }

  function setZoomScale (scale) {
    scalingFactor = 1 / scale;
  };

  function getZoomScale () {
    return scalingFactor;
  }

  function getShapeStorage () {
    return shapeStorage;
  }

  function setStrokeWidth (width) {
    tool['stroke-width'] = width;
  }

  function getStrokeWidth () {
    return tool['stroke-width'];
  }

  return {
    getShapeStorage: getShapeStorage,
    getCursor: getCursor,
    setCursor: setCursor,
    moveCursor: moveCursor,
    createBoard: createBoard,
    getCurrentShape: getCurrentShape,
    getShapeById: getShapeById,
    getCurrentTool: getCurrentTool,
    generateShapeId: generateShapeId,
    getCurrentShapeId: getCurrentShapeId,
    setColors: setColors,
    setZoomScale: setZoomScale,
    getZoomScale: getZoomScale,
    getCanvas: getCanvas,
    setSocketId: setSocketId,
    getSocketId: getSocketId,
    setCurrentToolName: setCurrentToolName,
    getBoard: getBoard,
    getScalingFactor: getScalingFactor,
    getOffset: getOffset,
    getCanvasMargin: getCanvasMargin,
    pushToStorage: pushToStorage,
    setCurrentShape: setCurrentShape,
    unsetCurrentShape: unsetCurrentShape,
    getViewBoxDims: getViewBoxDims,
    setViewBoxDims: setViewBoxDims,
    setOffset: setOffset,
    getOriginalDims: getOriginalDims,
    setEditorShape: setEditorShape,
    unsetEditorShape: unsetEditorShape,
    getEditorShape: getEditorShape,
    setStrokeWidth: setStrokeWidth,
    getStrokeWidth: getStrokeWidth
  }
});
;angular.module('whiteboard.services.broadcast', [])
.factory('Broadcast', function (Sockets) {

  var socketUserId;

  var getSocketId = function () {
    return socketUserId;
  };

  var saveSocketId = function (id) {
    socketUserId = id;
  };

  Sockets.emit('idRequest');

  var newShape = function (myid, socketId, tool, mouseX, mouseY) {
    Sockets.emit('newShape', {
      myid: myid,
      socketId: socketId,
      tool: tool,
      initX: mouseX,
      initY: mouseY
    });
  };

  var editShape = function (myid, socketId, currentTool, mouseX, mouseY) {
    var data = {};
    data.mouseX = mouseX;
    data.mouseY = mouseY;
    data.myid = myid;
    data.socketId = socketId;
    data.tool = currentTool;
    Sockets.emit('editShape', data);
  };

  var finishPath = function (myid, currentTool, pathDProps) {
    Sockets.emit('pathCompleted', {
      myid: myid,
      tool: currentTool,
      pathDProps: pathDProps
    });
  };

  var finishShape = function (myid, currentTool) {
    Sockets.emit('shapeCompleted', {
      myid: myid,
      tool: currentTool
    });
  };

  var deleteShape = function (myid, socketId) {
    Sockets.emit('deleteShape', {
      myid: myid,
      socketId: socketId
    })
  };

  var moveShape = function (shape, x, y) {
    var type = shape.type;
    Sockets.emit('moveShape', {
      myid: shape.myid,
      socketId: shape.socketId,
      x: x,
      y: y,
      attr: shape.attr()
    });
  };

  var finishMovingShape = function (shape) {
    Sockets.emit('finishMovingShape', {
      myid: shape.myid,
      socketId: shape.socketId,
      attr: shape.attr()
    })
  }

  return {
    getSocketId: getSocketId,
    saveSocketId: saveSocketId,
    newShape: newShape,
    editShape: editShape,
    finishPath: finishPath,
    finishShape: finishShape,
    deleteShape: deleteShape,
    finishMovingShape: finishMovingShape,
    moveShape: moveShape
  };

});
;angular.module('whiteboard.services.eventhandler', [])
.factory('EventHandler', ['BoardData', 'ShapeBuilder', 'ShapeEditor', 'ShapeManipulation', 'Snap', function (BoardData, ShapeBuilder, ShapeEditor, ShapeManipulation, Snap) {

  function setSocketId (socketId) {
    BoardData.setSocketId(socketId);
  };

  function createShape (id, socketId, tool, x, y) {
    ShapeBuilder.newShape(id, socketId, tool, x, y);
  }

  function editShape (id, socketId, tool, x, y) {
  	ShapeEditor.editShape(id, socketId, tool, x, y);
  }

  function finishShape (id, socketId, tool) {
    ShapeEditor.finishShape(id, socketId, tool);
  }

  function deleteShape (id, socketId) {
    ShapeEditor.deleteShape(id, socketId);
  }

  function moveShape (shape, x, y) {
    ShapeManipulation.moveShape(shape.myid, shape.socketId, x, y);
  }

  function finishMovingShape (id, socketId) {
    ShapeManipulation.finishMovingShape (id, socketId);
  }

  function drawExistingPath (shape) {
    ShapeBuilder.drawExistingPath(shape);
    var currentShape = BoardData.getShapeById(shape.myid, shape.socketId);
    ShapeManipulation.pathSmoother(currentShape);
  }

  function cursor (screenPosition) {
    var cursor = BoardData.getCursor() || BoardData.setCursor();
    BoardData.moveCursor(screenPosition);
  }

  function grabShape (screenPosition) {
    var x = Math.floor(screenPosition[0]);
    var y = Math.floor(screenPosition[1]);

    var currentEditorShape;

    currentEditorShape = BoardData.getEditorShape();

    if (!currentEditorShape) {
      var shape = BoardData.getBoard().getElementByPoint(x, y);
      if (shape) {
        BoardData.setEditorShape(shape);
        currentEditorShape = BoardData.getEditorShape();
      }
    } else {
      moveShape(currentEditorShape, x, y);
    }
  }

  return {
    cursor: cursor,
    setSocketId: setSocketId,
    createShape: createShape,
    editShape: editShape,
    finishShape: finishShape,
    deleteShape: deleteShape,
    moveShape: moveShape,
    finishMovingShape: finishMovingShape,
    drawExistingPath: drawExistingPath,
    grabShape: grabShape
  };
}]);
;angular.module('whiteboard.services.inputhandler', [])
.factory('InputHandler', ['BoardData','Snap', 'EventHandler', 'Broadcast', 'Visualizer', 'Zoom', function (BoardData, Snap, EventHandler, Broadcast, Visualizer, Zoom) {
  var toggleAttrs = {};
  function toggle (attr) {
    if (!toggleAttrs[attr]) {
      toggleAttrs[attr] = true;
    } else {
      toggleAttrs[attr] = false;
    }
  }
  function isToggled (attr) {
    return toggleAttrs[attr];
  }

  var actions = {};

  actions.eraser = {
    mouseDown: function (ev) {
    },
    mouseHold: function (ev) {
      var shape = BoardData.getBoard().getElementByPoint(ev.clientX, ev.clientY);
      if (shape) {
        Broadcast.deleteShape(shape.myid, shape.socketId);
        EventHandler.deleteShape(shape.myid, shape.socketId);
      }
    },
    mouseUp: function (ev) {
    },
    mouseOver: function (ev) {
    }
  };

  actions.pan = {
    mouseDown: function (ev) {
    },
    mouseHold: function (ev) {
      Zoom.pan(ev);
    },
    mouseUp: function (ev) {
      Zoom.resetPan();
    },
    mouseOver: function (ev) {
    }
  };

  actions.move = {
    mouseDown: function (ev) {
      var shape = BoardData.getBoard().getElementByPoint(ev.clientX, ev.clientY);
      if (shape) {
        console.log('Shape found!')
        BoardData.setEditorShape(shape);
      } else {
        toggle('move');
      }
    },
    mouseHold: function (ev) {
      var currentEditorShape = BoardData.getEditorShape();
      var mouseXY = getMouseXY(ev);

      Visualizer.clearSelection();
      EventHandler.moveShape(currentEditorShape, mouseXY.x, mouseXY.y);
      Broadcast.moveShape(currentEditorShape, mouseXY.x, mouseXY.y);
    },
    mouseUp: function (ev) {
      var editorShape = BoardData.getEditorShape();
      var currentTool = BoardData.getCurrentTool();

      Broadcast.finishMovingShape(editorShape);
      EventHandler.finishMovingShape(editorShape.myid, editorShape.socketId);
      BoardData.unsetEditorShape();
    },
    mouseOver: function (ev) {
      Visualizer.visualizeSelection(ev);
    }
  };

  actions.text = {
    mouseDown: function (ev) {
      var id = BoardData.generateShapeId();
      var mouseXY = getMouseXY(ev);
      var socketId = BoardData.getSocketId();
      var currentTool = BoardData.getCurrentTool();
      currentTool.text = 'Insert Text';

      EventHandler.createShape(id, socketId, currentTool, mouseXY.x, mouseXY.y);
      BoardData.setCurrentShape(id);
      Broadcast.newShape(id, socketId, currentTool, mouseXY.x, mouseXY.y);
      var currentShape = BoardData.getCurrentShape();

      document.onkeypress = function (ev) {
        BoardData.setEditorShape(currentShape);
        var editorShape = BoardData.getEditorShape();
        if (editorShape.attr('text') === 'Insert Text') {
          editorShape.attr('text', '');
          currentTool.text = '';
        }
        
        if (ev.keyCode === 13) {
          // enter key to complete text insertion process
          editorShape.tool = currentTool;
          Broadcast.finishShape(id, currentTool);
          EventHandler.finishShape(editorShape);
          editorShape = null;
        } else {
          // typing text
          editorShape.attr('text', editorShape.attr('text') + String.fromCharCode(ev.keyCode));
          currentTool.text = editorShape.attr('text');
          Broadcast.editShape(id, socketId, currentTool, editorShape.initX, editorShape.initY);
          EventHandler.editShape(id, socketId, currentTool, editorShape.initX, editorShape.initY);
        }
      }

      document.onkeydown = function (ev) {
        BoardData.setEditorShape(currentShape);
        var editorShape = BoardData.getEditorShape();
        if (ev.which === 8) {
          ev.preventDefault();
          if (editorShape) {
            editorShape.attr('text', editorShape.attr('text').slice(0, editorShape.attr('text').length - 1));
            currentTool.text = editorShape.attr('text');
            Broadcast.editShape(id, socketId, currentTool, editorShape.initX, editorShape.initY);
            EventHandler.editShape(id, socketId, currentTool, editorShape.initX, editorShape.initY);
          }
        }
      }

    },
    mouseHold: function (ev) {
    },
    mouseUp: function (ev) {
    },
    mouseOver: function (ev) {
    }
  };

  actions.shape = {
    mouseDown: function (ev) {
      var socketId = BoardData.getSocketId();
      var currentTool = BoardData.getCurrentTool();
      var mouseXY = getMouseXY(ev);
      var coords = Snap.snapToPoints(mouseXY.x, mouseXY.y);
      var id = BoardData.generateShapeId();

      EventHandler.createShape(id, socketId, currentTool, coords[0], coords[1]);
      BoardData.setCurrentShape(id);
      Broadcast.newShape(id, socketId, currentTool, coords[0], coords[1]);
    },
    mouseHold: function (ev) {
      var id = BoardData.getCurrentShapeId();
      var socketId = BoardData.getSocketId();
      var currentTool = BoardData.getCurrentTool();
      var mouseXY = getMouseXY(ev);

      Broadcast.editShape(id, socketId, currentTool, mouseXY.x, mouseXY.y);
      EventHandler.editShape(id, socketId, currentTool, mouseXY.x, mouseXY.y);
    },
    mouseUp: function (ev) {
      var id = BoardData.getCurrentShapeId();
      var socketId = BoardData.getSocketId();
      var currentTool = BoardData.getCurrentTool();
      var shape = BoardData.getCurrentShape();
      shape.tool = currentTool;

      EventHandler.finishShape(id, socketId, currentTool);
      BoardData.unsetCurrentShape();
      Visualizer.clearSnaps();

      if (currentTool.name === 'path') {
        Broadcast.finishPath(id, currentTool, shape.pathDProps);
      } else {
        Broadcast.finishShape(id, currentTool);
      }
    },
    mouseOver: function (ev) {
      var mouseXY = getMouseXY(ev);
      Snap.snapToPoints(mouseXY.x, mouseXY.y);
    }
  };

  actions.magnify = {
    mouseDown: function (ev) {
    },
    mouseHold: function (ev) {
      var mouseXY = getMouseXY(ev);

      Zoom.zoom(ev, mouseXY);
    },
    mouseUp: function (ev) {
      Zoom.resetZoom();
    },
    mouseOver: function (ev) {
    }
  };

  actions.noTool = {
    mouseDown: function (ev) {
    },
    mouseHold: function (ev) {
    },
    mouseUp: function (ev) {
    },
    mouseOver: function (ev) {
    }
  };

  function getMouseXY (ev) {
    var canvasMarginXY = BoardData.getCanvasMargin();
    var scalingFactor = BoardData.getScalingFactor();
    var offsetXY = BoardData.getOffset();
    return {
      x: (ev.clientX - canvasMarginXY.x) * scalingFactor + offsetXY.x,
      y: (ev.clientY - canvasMarginXY.y) * scalingFactor + offsetXY.y
    };
  }

  var shapeTools = ['line','circle','path','rectangle','arrow'];
  function parseToolName (toolName) {
    for (var i = 0; i < shapeTools.length; i++) {
      if (toolName === shapeTools[i]) {
        toolName = 'shape';
      }
    }
    if (!toolName) {
      toolName = 'noName';
    }
    return toolName;
  }

  function mouseDown (ev) {
    var toolName = parseToolName(BoardData.getCurrentTool().name);

    toggle(toolName);
    actions[toolName].mouseDown(ev);
  }

  function mouseMove (ev) {
    var toolName = parseToolName(BoardData.getCurrentTool().name);

    if (isToggled(toolName)) {
      actions[toolName].mouseHold(ev);
    } else {
      actions[toolName].mouseOver(ev);
    }
  }

  function mouseUp (ev) {
    var toolName = parseToolName(BoardData.getCurrentTool().name);

    if (isToggled(toolName)) {
      toggle(toolName);
      actions[toolName].mouseUp(ev);
    }
  }

  function doubleClick (ev) {
    //just in case
  }

  function keyPress (ev) {
    var toolName = parseToolName(BoardData.getCurrentTool().name);

    if (toolName !== 'text') {
      // keycode value for lowercase m
      if (ev.keyCode === 109) {
        console.log('m has been typed');
      }
    }
  }

  return {
    mousedown: mouseDown,
    mousemove: mouseMove,
    mouseup: mouseUp,
    dblclick: doubleClick,
    keypress: keyPress
  };
}]);
;angular.module('whiteboard.services.leapMotion', [])
.factory('LeapMotion', ['EventHandler', function (EventHandler) {

  var controller = new Leap.Controller({enableGestures: true})
    .use('screenPosition', {scale: 0.25})
    .connect()
    .on('frame', function(frame){

      // if (frame.valid && frame.gestures.length > 0) {
      //   frame.gestures.forEach(function(gesture){
      //       switch (gesture.type){
      //         case "circle":
      //           console.log("Circle Gesture");
      //           break;
      //         case "keyTap":
      //           console.log("Key Tap Gesture");
      //           break;
      //         case "screenTap":
      //           console.log("Screen Tap Gesture");
      //           break;
      //         case "swipe":
      //           console.log("Swipe Gesture");
      //           break;
      //       }
      //   });
      // }

      frame.hands.forEach(function (hand, index) {
        console.log(hand.indexFinger.touchZone);
        EventHandler.cursor(hand.indexFinger.screenPosition());
        if (hand.indexFinger.extended) {
          //
        } 
        if (hand.grabStrength === 1) {
          // console.log('grabStrength === 1')
          EventHandler.grabShape(hand.screenPosition());
          //console.log(hand.pinchStrength)
        }

        if (hand.pinchStrength === 1) {
          // console.log('pinchStrength === 1');
        }
      });
    })

  return {};
}]);
;angular.module('whiteboard.services.menuhandler', [])
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

}]);;angular.module('whiteboard.services.receive', [])
.factory('Receive', function (Sockets, EventHandler) {
  Sockets.on('showExisting', function (data) {
    console.log(data);
    for (socketId in data) {
      if (Object.keys(data[socketId]).length) {
        for (id in data[socketId]) {
          var thisShape = data[socketId][id];
          if (thisShape.tool.name === 'path') {
            EventHandler.drawExistingPath(thisShape);
          } else if (thisShape.initX && thisShape.initY) {
            EventHandler.createShape(id, socketId, thisShape.tool, thisShape.initX, thisShape.initY);
            if (thisShape.tool.name !== 'text') {
              EventHandler.editShape(id, socketId, thisShape.tool, thisShape.mouseX, thisShape.mouseY);
            }
            EventHandler.finishShape(thisShape.myid, thisShape.socketId, thisShape.tool);
          }
        }
      }
    }
  });

  Sockets.on('socketId', function (data) {
    EventHandler.setSocketId(data.socketId);
  });

  Sockets.on('shapeEdited', function (data) {
    EventHandler.editShape(data.myid, data.socketId, data.tool, data.mouseX, data.mouseY);
  });

  Sockets.on('shapeCompleted', function (data) {
    EventHandler.finishShape(data);
  });

  Sockets.on('shapeCreated', function (data) {
    EventHandler.createShape(data.myid, data.socketId, data.tool, data.initX, data.initY);
  });

  Sockets.on('shapeMoved', function (data) {
    EventHandler.moveShape(data, data.x, data.y);
  });

  Sockets.on('shapeFinishedMoving', function (data) {
    EventHandler.finishMovingShape(data.myid, data.socketId);
  });

  Sockets.on('shapeDeleted', function (data) {
    EventHandler.deleteShape(data.myid, data.socketId);
  });

  return {};

});
;angular.module('whiteboard.services.shapebuilder', [])
.factory('ShapeBuilder', ['BoardData', function (BoardData) {

  function setColor (shape, colors) {
    if (shape.type === 'path') {
      shape.attr('stroke', colors.stroke);
    } else {
      shape.attr('stroke', colors.stroke);
      shape.attr('fill', colors.fill);
    }
  }

  function drawExistingPath (shape) {
    newShape(shape.myid, shape.socketId, shape.tool, shape.initX, shape.initY);
    var existingPath = BoardData.getShapeById(shape.myid, shape.socketId);
    existingPath.customSetPathD(shape.pathDProps);
    existingPath.pathDProps = shape.pathDProps;
    BoardData.pushToStorage(shape.myid, shape.socketId, existingPath);
  }

  function newShape (id, socketId, tool, x, y) {
    var shapeConstructors = {
      'circle': function (x, y) {
        return BoardData.getBoard().circle(x, y, 0);
      },
      'line': function (x, y) {
        return BoardData.getBoard().path("M" + String(x) + "," + String(y));
      },
      'path': function (x, y) {
        var path = BoardData.getBoard().path("M" + String(x) + "," + String(y));
        // Do we wanna change this?
        path.pathDProps = '';
        return path;
      },
      'rectangle': function (x,y) {
        return BoardData.getBoard().rect(x, y, 0, 0);
      },
      'text': function (x, y, text) {
        return !!text ? BoardData.getBoard().text(x, y, text) : BoardData.getBoard().text(x, y, 'Insert Text');
      },
      'arrow': function (x, y) {
        var arrow = BoardData.getBoard().path("M" + String(x) + ',' + String(y));
        arrow.attr('arrow-end', 'classic-wide-long');
        return arrow;
      }
    };
    var shape = !!tool.text ? shapeConstructors[tool.name](x, y, tool.text) : shapeConstructors[tool.name](x, y);
    // shape.myid = id;
    shape.initX = x;
    shape.initY = y;
    setColor(shape, tool.colors);
    shape.myid = id;
    shape.socketId = socketId;
    shape.attr('stroke-width', BoardData.getStrokeWidth());
    BoardData.pushToStorage(id, socketId, shape);
  };

  return {
    newShape: newShape,
    drawExistingPath: drawExistingPath
  };
  
}]);
;angular.module('whiteboard.services.shapeeditor', [])
.factory('ShapeEditor', ['BoardData', 'Snap', 'ShapeManipulation', function (BoardData, Snap, ShapeManipulation) {

  var changeCircle = function (shape, x, y) {
    var coords = Snap.snapToPoints(x, y);
    if (!(shape.initX === coords[0] && shape.initY === coords[1])) {
      x = coords[0];
      y = coords[1];
    }
    var deltaX = x - shape.initX;
    var deltaY = y - shape.initY;
    var newRadius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    shape.attr('r', newRadius);
  };

  var changeLine = function (shape, x, y) {
    //"M10,20L30,40"
    var deltaX = x - shape.initX;
    var deltaY = y - shape.initY;

    if (Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2)) > 20) {
      if (Math.abs(deltaY) < 5) {
        y = shape.initY;
      } else if (Math.abs(deltaX) < 5) {
        x = shape.initX;
      }
    }

    var coords = Snap.snapToPoints(x, y);
    if (!(shape.initX === coords[0] && shape.initY === coords[1])) {
      x = coords[0];
      y = coords[1];
    }

    var linePathOrigin = "M" + String(shape.initX) + "," + String(shape.initY);
    var linePathEnd = "L" + String(x) + "," + String(y);
    shape.attr('path', linePathOrigin + linePathEnd);
  };

  var changePath = function (shape, x, y) {
    //"M10,20L30,40"

    shape.pathDProps += shape.pathDProps === '' ? 'M' + shape.initX + ',' + shape.initY + 'L' + x + ',' + y : 'L' + x + ',' + y;
    //this custom function is in raphael
    shape.customSetPathD(shape.pathDProps);
  };

  var changeRectangle = function (shape, x, y) {
    var coords = Snap.snapToPoints(x, y);
    var left, top;
    
    if (x < shape.initX && y < shape.initY) {
      left = coords[0];
      top = coords[1];
      width = shape.initX - left;
      height = shape.initY - top;
    } else if (x < shape.initX) {
      left = coords[0];
      top = shape.initY;
      width = shape.initX - left;
      height = coords[1] - shape.initY;
    } else if (y < shape.initY) {
      left = shape.attr('x');
      top = coords[1];
      width = coords[0] - shape.initX;
      height = shape.initY - top;
    } else {
      left = shape.attr('x');
      top = shape.attr('y');
      width = coords[0] - shape.initX;
      height = coords[1] - shape.initY;
    }
    
    shape.attr({
      x: left,
      y: top,
      width: width,
      height: height
    });
  }

  var changeText = function (shape, x, y, tool) {
    shape.attr({
      x: x,
      y: y,
      text: tool.text
    });
  };

  function editShape (id, socketId, tool, x, y) {
    var shapeHandlers = {
      'circle': changeCircle,
      'path': changePath,
      'line': changeLine,
      'arrow': changeLine,
      'rectangle': changeRectangle,
      'text': changeText
    };
    var shape = BoardData.getShapeById(id, socketId);
    
    // optional tool argument for text change
    shapeHandlers[tool.name](shape, x, y, tool);
  };

  function finishShape (id, socketId, tool) {
    var shape = BoardData.getShapeById(id, socketId);

    if (shape.type === 'text') {
      shape.attr({
        text: tool.text
      });
    }

    Snap.createSnaps(shape);
    if ((shape.myid || shape.myid === 0) && tool.name === 'path') ShapeManipulation.pathSmoother(shape);
  };

  function deleteShape (id, socketId) {
    var shape = BoardData.getShapeById(id, socketId);

    Snap.deleteSnaps(shape);
    shape.remove();
  };

  return {
    editShape: editShape,
    finishShape: finishShape,
    deleteShape: deleteShape
  };

}]);
;angular.module('whiteboard.services.shapemanipulation', [])
.factory('ShapeManipulation', ['BoardData', 'ShapeBuilder', 'Snap', function (BoardData, ShapeBuilder, Snap) {

  var pathSmoother = function (pathElement) {
    var path = pathElement.attr('path');
    path = path.length > 1 ? path : Raphael.parsePathString(pathElement.pathDProps);
    var interval = 5;

    var newPath = path.reduce(function (newPathString, currentPoint, index, path) {
      if (!(index % interval) || index === (path.length - 1)) {
        return newPathString += currentPoint[1] + ',' + currentPoint[2] + ' ';
      } else {
        return newPathString;
      }
    }, path[0][0] + path[0][1] + ',' + path[0][2] + ' ' + "R");

    pathElement.attr('path', newPath);
  };

  var grabPoint;
  var origin;
  function moveCircle (shape, x, y) {
    var deltaX = x - grabPoint.x;
    var deltaY = y - grabPoint.y;
    var circleProps = shape.attr();
    shape.attr({
      cx: origin.cx + deltaX,
      cy: origin.cy + deltaY
    });
  }

  function moveRectangle (shape, x, y) {
    var deltaX = x - grabPoint.x;
    var deltaY = y - grabPoint.y;
    shape.attr({
      x: origin.x + deltaX,
      y: origin.y + deltaY
    });
  }

  function moveShape (id, socketId, x, y) {
    var shapeHandlers = {
      'circle': moveCircle,
      // 'path': movePath,
      // 'line': moveLine,
      'rect': moveRectangle
      // 'text': moveText
    };
    var shape = BoardData.getShapeById(id, socketId).toFront();
    if (!grabPoint) {
      grabPoint = {x: x, y: y};
      origin = shape.attr();
    }
    shapeHandlers[shape.type](shape, x, y);
  }

  function finishMovingShape (id, socketId) {
    grabPoint = null;
    origin = null;

    var shape = BoardData.getShapeById(id, socketId);
    Snap.createSnaps(shape);
  }

  return {
    pathSmoother: pathSmoother,
    moveShape: moveShape,
    finishMovingShape: finishMovingShape
  };

}]);
;angular.module('whiteboard.services.snap', [])
.factory('Snap', ['BoardData', 'Visualizer', function (BoardData, Visualizer) {
  var endSnapTree;
  function Point (x, y) {
    this.x = x;
    this.y = y;
  }

  function Node (val, left, right) {
    this.val = val;
    this.left = left || null;
    this.right = right || null;
  }

  function Rectangle (x0, y0, x1, y1) {
    this.left = x0;
    this.bottom = y0;
    this.right = x1;
    this.top = y1;
  }

  function KDTree (points, depth) {
    var split, sortedPoints;
    points = points || generatePoints(10);
    depth = depth || 0;
    if (points.length <= 1) {
      return points[0];
    }
    else {
      var mid = Math.ceil(points.length / 2);
      if ((depth % 2) === 0) {
        sortedPoints = points.slice().sort(function (a,b) {
          return a.x - b.x;
        });
        split = sortedPoints[mid].x;
      } else {
        sortedPoints = points.slice().sort(function (a,b) {
          return a.y - b.y;
        });
        split = sortedPoints[mid].y;
      }
      var left = new KDTree(sortedPoints.slice(0, mid), depth + 1);
      var right = new KDTree(sortedPoints.slice(mid), depth + 1);
      return new Node(split, left, right);
    }
  }

  function reportSubtree (node) {
    if (node instanceof Node) {
      var returnArr = [];
      return returnArr.concat(reportSubtree(node.left), reportSubtree(node.right));
    } else {
      return node;
    }
  }

  function pointIsInRange (point, range) {
    return point.x >= range.left && point.x <= range.right && point.y >= range.bottom && point.y <= range.top;
  }

  function regionIntersection (r1, r2) {
    var left = Math.max(r1.left, r2.left);
    var bottom = Math.max(r1.bottom, r2.bottom);
    var right = Math.min(r1.right, r2.right);
    var top = Math.min(r1.top, r2.top);
    if (right < left || top < bottom) {
      return null;
    } else {
      return new Rectangle(left, bottom, right, top);
    }
  }

  function regionContainedInRange (region, range) {
    return region.left > range.left && region.bottom > range.bottom && region.right < range.right && region.top < range.top;
  }

  function searchKDTree (node, range, nodeRange, depth) {
    depth = depth || 0;
    nodeRange = nodeRange || new Rectangle(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    // base case if node is a leaf
    if (typeof node.x === 'number' && typeof node.y === 'number') {
      if (pointIsInRange(node, range)) {
        return node;
      }
    } else {
      var leftRange = new Rectangle(nodeRange.left, nodeRange.bottom, nodeRange.right, nodeRange.top);
      var rightRange = new Rectangle(nodeRange.left, nodeRange.bottom, nodeRange.right, nodeRange.top);
      if ((depth % 2) === 0) {
        // split on x
        leftRange.right = node.val;
        rightRange.left = node.val;
      } else {
        // split on y
        leftRange.top = node.val;
        rightRange.bottom = node.val;
      }
      var returnArr = [];
      var subtreeNodes;
      /*check if left region is fully contained in range*/
      if (regionContainedInRange(leftRange, range)) {
        subtreeNodes = reportSubtree(node.left);
        if (subtreeNodes) returnArr = returnArr.concat(subtreeNodes);
      /*else check if left region intersects range*/
      } else if (regionIntersection(leftRange, range)) {
        subtreeNodes = searchKDTree(node.left, range, leftRange, depth + 1);
        if (subtreeNodes) returnArr = returnArr.concat(subtreeNodes);
      }
      /*check if right region is fully contained in range*/
      if (regionContainedInRange(rightRange, range)) {
        subtreeNodes = reportSubtree(node.right);
        if (subtreeNodes) returnArr = returnArr.concat(subtreeNodes);
      /*else check if right region intersects range*/
      } else if (regionIntersection(rightRange, range)) {
        subtreeNodes = searchKDTree(node.right, range, rightRange, depth + 1);
        if (subtreeNodes) returnArr = returnArr.concat(subtreeNodes);
      }
      return returnArr;
    }
  }

  var findSnaps = function (shape) {
    var newSnaps = [];
    if (shape.type === 'rect') {
      var x = shape.attr('x');
      var y = shape.attr('y');
      var width = shape.attr('width');
      var height = shape.attr('height');
      var cornerSnaps = [
        new Point(x, y),
        new Point(x + width, y),
        new Point(x, y + height),
        new Point(x + width, y + height)
      ];
      var cardinalSnaps = [
        new Point(x + width / 2, y),
        new Point(x, y + height / 2),
        new Point(x + width, y + height / 2),
        new Point(x + width / 2, y + height),
      ];
      cornerSnaps.forEach(function (snap) {
        newSnaps.push(snap);
      }.bind(this));
      cardinalSnaps.forEach(function (snap) {
        newSnaps.push(snap);
      }.bind(this));
    } else if (shape.type === 'path') {
      if (shape.pathDProps !== undefined) {
        shape.attr('path', shape.pathDProps);
      }
      var path = shape.attr('path');
      if (path.length <= 1) {
        shape.remove();
      } else if (path.length === 2) {
        startPoint = new Point(path[0][1], path[0][2]);
        endPoint = new Point(path[1][1], path[1][2]);
        midPoint = new Point(startPoint.x + (endPoint.x - startPoint.x) / 2, startPoint.y + (endPoint.y - startPoint.y) / 2);
        newSnaps.push(startPoint, midPoint, endPoint);
      } else {
        startPoint = new Point(path[0][1], path[0][2]);
        endPoint = new Point(path[path.length - 1][1], path[path.length - 1][2]);
        newSnaps.push(startPoint, endPoint);
      }
    } else if (shape.type === 'circle') {
      var cx = shape.attr('cx');
      var cy = shape.attr('cy');
      var r = shape.attr('r');
      var centerSnap = new Point(cx, cy);
      cardinalSnaps = [
        new Point(cx + r, cy),
        new Point(cx - r, cy),
        new Point(cx, cy + r),
        new Point(cx, cy - r)
      ];
      newSnaps.push(centerSnap);
      cardinalSnaps.forEach(function (snap) {
        newSnaps.push(snap);
      });
    }
    return newSnaps;
  }

  var createSnaps = function (shape) {
    Visualizer.clearSnaps();
    this.endSnaps[shape.myid] = findSnaps(shape);
    recreateKDTree(this.endSnaps);
  };

  var deleteSnaps = function (shape) {
    this.endSnaps[shape.myid] = null;
    recreateKDTree(this.endSnaps);
  }

  var recreateKDTree = function (snaps) {
    var flatSnaps = [];
    for (var key in snaps) {
      if (snaps[key] !== null) {
        flatSnaps = flatSnaps.concat(snaps[key]);
      }
    }
    endSnapTree = new KDTree(flatSnaps);
  }

  function objectKeysAreEmpty (object) {
    for (var key in object) {
      if (Object.keys(object[key]).length !== 0) {
        return false;
      }
    }
    return true;
  }

  var snapToPoints = function (x, y, tolerance) {
    var scale = BoardData.getZoomScale();
    if (!this.snapsEnabled || !endSnapTree || !endSnapTree.val) return [x, y];
    if (!tolerance) tolerance = this.tolerance;
    tolerance *= scale;
    var buffer = 50 * scale;
    var searchBox = new Rectangle(x - (tolerance + buffer), y - (tolerance + buffer), x + (tolerance + buffer), y + (tolerance + buffer));
    var localTree = searchKDTree(endSnapTree, searchBox);
    for (var i = 0; i < localTree.length; i++) {
      var pointX = localTree[i].x;
      var pointY = localTree[i].y;
      var dist = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));
      if (dist < tolerance && (!closest || dist < closestDist)) {
        var closest = localTree[i];
        var closestDist = dist;
      }
    }
    Visualizer.visualizeSnaps(localTree, closest);
    if (closest) {
      return [closest.x, closest.y];
    } else {
      return [x,y];
    }
  };

  return {
    endSnaps: {},
    snapsEnabled: true,
    tolerance: 7,
    createSnaps: createSnaps,
    deleteSnaps: deleteSnaps,
    snapToPoints: snapToPoints
  };

}]);
;angular.module('whiteboard.services.sockets', [])
.factory('Sockets', function (socketFactory) {
  var myIoSocket = io.connect();

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
});
;angular.module('whiteboard.services.token', [])
.factory('AttachTokens', function ($window) {
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('token');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        
        return object;
      }
    };
    return attach;
  })
;angular.module('whiteboard.services.visualizer', [])
.factory('Visualizer', ['BoardData', function (BoardData) {
  var selectionGlow;
  var selected;
  function visualizeSelection (ev) {
    var board = BoardData.getBoard();
    var scale = BoardData.getZoomScale()
    var selection = board.getElementByPoint(ev.clientX, ev.clientY);
    if (!selection || !(selection === selected)) {
      if (selectionGlow) {
        selectionGlow.remove();
        selectionGlow.clear();
        selected = null;
      }
    }
    if (selection && (!selectionGlow || selectionGlow.items.length === 0)) {
      selected = selection;
      selectionGlow = selection.glow({
        'color': 'blue',
        'width': 10 * scale
      });
    }
  }

  function clearSelection () {
    if (selectionGlow) {
      selectionGlow.remove();
      selectionGlow.clear();
      selected = null;
    }
  }

  var displayedSnaps;
  function visualizeSnaps (snaps, closest) {
    var board = BoardData.getBoard();
    var scale = BoardData.getZoomScale();
    if (!displayedSnaps) {
      displayedSnaps = BoardData.getBoard().set();
    } else {
      displayedSnaps.remove();
      displayedSnaps.clear();
    }
    for (var snap in snaps) {
      if (snaps[snap] === closest) {
        displayedSnaps.push(board.circle(snaps[snap].x, snaps[snap].y, 5 * scale).attr({'stroke': 'red', 'stroke-width': 1 * scale}));
      } else {
        displayedSnaps.push(board.circle(snaps[snap].x, snaps[snap].y, 3.5 * scale).attr({'stroke': 'green', 'stroke-width': 1 * scale}));
      }
    }
  }

  function clearSnaps () {
    if (displayedSnaps) {
      displayedSnaps.remove();
      displayedSnaps.clear();
    }
  }

  return {
    visualizeSelection: visualizeSelection,
    visualizeSnaps: visualizeSnaps,
    clearSelection: clearSelection,
    clearSnaps: clearSnaps
  }
}]);
;angular.module('whiteboard.services.zoom', [])
.factory('Zoom', ['BoardData', function (BoardData) {
  var last;
  function zoom (ev, mouseXY) {
    var board = BoardData.getBoard();
    var scalingFactor = BoardData.getZoomScale();
    var offset = BoardData.getOffset();
    var originalDims = BoardData.getOriginalDims();
    var currentDims = BoardData.getViewBoxDims();

    if (mouseXY) {
      if (last) {
        var up;
        if (ev.clientY > last) {
          up = 1.05;
        } else if (ev.clientY < last) {
          up = 0.95;
        } else {
          up = 1;
        }
        scalingFactor = scalingFactor * up;
        BoardData.setZoomScale(1 / scalingFactor);
      }
      last = ev.clientY;
    }

    var newViewBoxDims = {
      width: originalDims.width * scalingFactor,
      height: originalDims.height * scalingFactor
    };
    BoardData.setViewBoxDims(newViewBoxDims);

    if (mouseXY) {
      var newOffset = {
        x: offset.x,
        y: offset.y
        // x: mouseXY.x - newViewBoxDims.width / 2,
        // y: mouseXY.y - newViewBoxDims.height / 2
      };
    } else {
      var newOffset = {
        x: offset.x + currentDims.width / 2 - newViewBoxDims.width / 2,
        y: offset.y + currentDims.height / 2 - newViewBoxDims.height / 2
      };
    }
    BoardData.setOffset(newOffset);

    board.setViewBox(newOffset.x, newOffset.y, newViewBoxDims.width, newViewBoxDims.height);
  };

  function resetZoom () {
    last = null;
  }

  var startPanCoords;
  var startPanOffset;
  var newOffset;
  function pan (ev) {
    var board = BoardData.getBoard();
    var scalingFactor = BoardData.getScalingFactor();
    var offset = BoardData.getOffset();
    var currentDims = BoardData.getViewBoxDims();
    var canvasMargin = BoardData.getCanvasMargin();

    var mousePosition = {
      x: (ev.clientX - canvasMargin.x) * scalingFactor + offset.x,
      y: (ev.clientY - canvasMargin.y) * scalingFactor + offset.y
    };

    if (!startPanCoords) {
      startPanCoords = mousePosition;
      startPanOffset = offset;
    } else {
      newOffset = {
        x: startPanOffset.x + (startPanCoords.x - mousePosition.x),
        y: startPanOffset.y + (startPanCoords.y - mousePosition.y)
      };

      board.setViewBox(newOffset.x, newOffset.y, currentDims.width, currentDims.height);
    }
  }

  function resetPan () {
    startPanCoords = startPanOffset = null;
    BoardData.setOffset(newOffset);
  }

  return {
    zoom: zoom,
    resetZoom: resetZoom,
    pan: pan,
    resetPan: resetPan
  }
}]);
