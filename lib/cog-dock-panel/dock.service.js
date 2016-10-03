(function () {
  'use strict';

  /* globals
   angular,
   $
   */

  var validPositions = ['top', 'right', 'bottom', 'left', 'fill'],
    dockPositionHandles = {top: 's', right: 'w', bottom: 'n', left: 'e'};
  var uiResizeClasses = {
    CUSTOM_RESIZE_HANDLE_CLASS: 'dock-resize-handle',
    CUSTOM_COLLAPSE_HANDLE_CLASS: 'dock-collapse-handle',
    JQUI_RESIZE_HANDLE_CLASS: 'ui-resizable-handle',
    JQUI_RESIZE_DIRECTION_PREFIX: 'ui-resizable-'
  };

  angular.module('ngDockPanel')
         .factory('dockService', dockService);


  function dockService() {
    return {
      dockPanels: {},
      validPositions: validPositions,
      dockPositionHandles: dockPositionHandles,
      uiResizeClasses: uiResizeClasses,
      evalDockPosition: evalDockPosition,
      Panel: panelFactory()
    };
  }

  function panelFactory() {

    function setPosition(dockPosition, dockAnchors, cssStyle) {
      cssStyle.position = 'absolute';

      if (dockPosition !== 'bottom') {
        cssStyle.top = dockAnchors.top;
      } else {
        cssStyle.top = 'auto';
      }
      if (dockPosition !== 'left') {
        cssStyle.right = dockAnchors.right;
      } else {
        cssStyle.right = 'auto';
      }
      if (dockPosition !== 'right') {
        cssStyle.left = dockAnchors.left;
      } else {
        cssStyle.left = 'auto';
      }
      if (dockPosition !== 'top') {
        cssStyle.bottom = dockAnchors.bottom;
      } else {
        cssStyle.bottom = 'auto';
      }
    }

    function decreaseSize(element, dockPosition, dockAnchors) {
      var size;

      if (!element.is(':visible')) {
        return;
      }

      if ('top|bottom'.indexOf(dockPosition) !== -1) {
        size = element.outerHeight(true);
      }
      if ('left|right'.indexOf(dockPosition) !== -1) {
        size = element.outerWidth(true);
      }

      switch (dockPosition) {
        case 'top':
          dockAnchors.top += size;
          break;
        case 'right':
          dockAnchors.right += size;
          break;
        case 'bottom':
          dockAnchors.bottom += size;
          break;
        case 'left':
          dockAnchors.left += size;
          break;
      }
    }

    function removeClasses(element) {
      validPositions.forEach(function (pos) {
        element.removeClass('dock-' + pos);
      });
    }

    function update(element, dockPosition, dockAnchors) {
      var cssStyle = {};
      removeClasses(element);
      setPosition(dockPosition, dockAnchors, cssStyle);
      element.addClass('dock-' + dockPosition);
      element.css(cssStyle);
      decreaseSize(element, dockPosition, dockAnchors);
    }

    return function Panel(element, scope) {
      var self = this;

      var dockAnchors = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      };
      var children = [];

      this.addChild = function (element, dockPosition) {
        var pos = evalDockPosition(dockPosition, scope);

        children.push({
          element: element,
          dockPosition: pos,
          order: children.length
        });

        update(element, pos, dockAnchors);
      };

      this.refresh = function (delay) {

        preCalcPositions();

        if (delay) {
          setTimeout(doUpdate, 0);
        } else {
          doUpdate();
        }

        function preCalcPositions() {
          children.forEach(function (child) {
            child.calcPosition = evalDockPosition(child.element.attr('dock'), scope);
          });
        }

        function doUpdate() {
          dockAnchors.top = 0;
          dockAnchors.bottom = 0;
          dockAnchors.left = 0;
          dockAnchors.right = 0;

          children.forEach(function (child) {
            update(child.element, child.calcPosition, dockAnchors);
          });
        }
      };

      $(window).resize(function () {
        self.refresh(false /* delay */);
      });

      scope.$watch(function () {
        self.refresh(true /* delay */);
      });
    };
  }

  function evalDockPosition(dockPosition, scope) {
    var pos = dockPosition;

    if (validPositions.indexOf(pos) === -1) {
      // may be an expression
      pos = scope.$eval(dockPosition);
    }

    if (validPositions.indexOf(pos) === -1) {
      // not a valid dock position
      throw {
        message: 'Invalid dock position "' + pos + '". Valid positions: ' + validPositions.join(', ')
      };
    }

    return pos;
  }

})();
