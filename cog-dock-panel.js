(function () {
  'use strict';

  angular.module('cogDockPanel', []);

})();

(function () {
  'use strict';

  /* globals
   angular
   */

  angular.module('cogDockPanel')
         .directive('cogDock', cogDockDirective);


  function cogDockDirective() {
    return {
      restrict: 'A',
      scope: true,
      controller: cogDockDirectiveController
    };
  }

  cogDockDirectiveController.$inject = ['$scope', '$element', 'cogDockPanelService'];
  function cogDockDirectiveController($scope, $element, cogDockPanelService) {
    var dockPosition = cogDockPanelService.evalDockPosition($element.attr('cog-dock'), $scope);
    $scope.__cogDock_id = String(Math.random()).replace(/\./g, '');
    var parentPanel = cogDockPanelService.dockPanels[$scope.$parent.__cogDockPanel_id];
    parentPanel.addChild($element, dockPosition);
  }

})();

(function () {
  'use strict';

  angular.module('cogDockPanel')
         .directive('cogDockCollapsible', cogDockCollapsibleDirective);


  function cogDockCollapsibleDirective() {
    return {
      require: 'dock',
      restrict: 'A',
      controller: cogDockCollapsibleDirectiveController,
      controllerAs: 'vm'
    };
  }

  cogDockCollapsibleDirectiveController.$inject = ['$scope', '$element', 'cogDockPanelService'];
  function cogDockCollapsibleDirectiveController($scope, $element, cogDockPanelService) {
    var vm = this;

    var resizeClasses = cogDockPanelService.uiResizeClasses;

    var stylePlaceholder = {
      height: {
        'height': $element.css('height'),
        'max-height': $element.css('max-height'),
        'min-height': $element.css('min-height')
      },
      width: {
        'width': $element.css('width'),
        'max-width': $element.css('max-width'),
        'min-width': $element.css('min-width')
      }
    };

    var dockPosition = cogDockPanelService.evalDockPosition($element.attr('cog-dock'), $scope),
        resizeHandleDirection;

    vm.toggleCollapse = _collapse;

    enableCollapse();

    $scope.$watch(function () {
      var newDockPosition = cogDockPanelService.evalDockPosition($element.attr('cog-dock'), $scope);

      if (newDockPosition !== dockPosition) {
        dockPosition = newDockPosition;
        enableCollapse();
      }
    });

    function _collapse() {
      var dimension = "top|bottom".indexOf(dockPosition) !== -1 ? 'height' : 'width';
      var minName = ['min', dimension].join('-'),
          maxName = ['max', dimension].join('-');
      var cssZero = '0px';

      if ($element.css(maxName) === cssZero) {
        angular.forEach(stylePlaceholder[dimension], function (val, key) {
          $element.css(key, val);
        });
      } else {
        angular.forEach(stylePlaceholder[dimension], function (val, key) {
          stylePlaceholder[dimension][key] = $element.css(key);
        });
        $element.css(maxName, cssZero);
        $element.css(minName, cssZero);
      }
    }

    function enableCollapse() {
      if (dockPosition !== 'fill') {
        // custom dock-collapse-handle
        var collapseHandle = $element.find('.' + resizeClasses.CUSTOM_COLLAPSE_HANDLE_CLASS).first();
        if (collapseHandle.length) {
          addJquiClasses(collapseHandle);
        }

      }
    }

    function addJquiClasses(handle) {
      handle.addClass([
        resizeClasses.JQUI_RESIZE_HANDLE_CLASS,
        resizeClasses.JQUI_RESIZE_DIRECTION_PREFIX + resizeHandleDirection
      ].join(' '));
    }
  }

})();

(function () {
  'use strict';

  /* globals
   angular
   */

  angular.module('cogDockPanel')
         .directive('cogDockPanel', cogDockPanelDirective);


  function cogDockPanelDirective() {
    return {
      restrict: 'A',
      scope: true,
      controller: cogDockPanelDirectiveController
    };
  }

  cogDockPanelDirectiveController.$inject = ['$scope', '$element', 'cogDockPanelService'];
  function cogDockPanelDirectiveController($scope, $element, cogDockPanelService) {
    $scope.__cogDockPanel_id = String(Math.random()).replace(/\./g, '');
    cogDockPanelService.dockPanels[$scope.__cogDockPanel_id] = new cogDockPanelService.Panel($element, $scope);
  }

})();

(function () {
  'use strict';

  /* globals
   angular,
   $
   */

  var validPositions = ['top', 'right', 'bottom', 'left', 'fill'],
    dockPositionHandles = {top: 's', right: 'w', bottom: 'n', left: 'e'};
  var uiResizeClasses = {
    CUSTOM_RESIZE_HANDLE_CLASS: 'cog-dock-resize-handle',
    CUSTOM_COLLAPSE_HANDLE_CLASS: 'cog-dock-collapse-handle',
    JQUI_RESIZE_HANDLE_CLASS: 'ui-resizable-handle',
    JQUI_RESIZE_DIRECTION_PREFIX: 'ui-resizable-'
  };

  angular.module('cogDockPanel')
         .factory('cogDockPanelService', cogDockPanelService);


  function cogDockPanelService() {
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
        element.removeClass('cog-dock-' + pos);
      });
    }

    function update(element, dockPosition, dockAnchors) {
      var cssStyle = {};
      removeClasses(element);
      setPosition(dockPosition, dockAnchors, cssStyle);
      element.addClass('cog-dock-' + dockPosition);
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
            child.calcPosition = evalDockPosition(child.element.attr('cog-dock'), scope);
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

(function () {
  'use strict';

  angular.module('cogDockPanel')
         .directive('cogDockResizable', cogDockResizableDirective);


  function cogDockResizableDirective() {
    return {
      require: 'dock',
      restrict: 'A',
      controller: cogDockResizableDirectiveController
    };
  }

  cogDockResizableDirectiveController.$inject = ['$scope', '$element', 'cogDockPanelService'];
  function cogDockResizableDirectiveController($scope, $element, cogDockPanelService) {

    var resizeClasses = cogDockPanelService.uiResizeClasses;

    var dockPosition = cogDockPanelService.evalDockPosition($element.attr('cog-dock'), $scope),
      resizeHandleDirection;


    enableResize();

    $scope.$watch(function () {
      var newDockPosition = cogDockPanelService.evalDockPosition($element.attr('cog-dock'), $scope);

      if (newDockPosition !== dockPosition) {
        dockPosition = newDockPosition;
        $element.resizable('destroy');
        enableResize();
      }
    });


    function enableResize() {
      if (dockPosition !== 'fill') {
        $element.resizable(resolveResizeOptions());
      }
    }

    function resolveResizeOptions() {
      resizeHandleDirection = cogDockPanelService.dockPositionHandles[dockPosition];
      var defaultOptions = {
          handles: resizeHandleDirection
        },
        customOptions = {},
        optionsAttr = evalResizeOptions();

      // custom dock-resize-handle
      var resizeHandle = $element.find('.' + resizeClasses.CUSTOM_RESIZE_HANDLE_CLASS).first();
      if (resizeHandle.length) {
        addJquiClasses(resizeHandle);
        (customOptions.handles = customOptions.handles || {})[resizeHandleDirection] = '.' + resizeClasses.CUSTOM_RESIZE_HANDLE_CLASS;
      }

      return angular.merge({}, defaultOptions, customOptions, optionsAttr);
    }

    function addJquiClasses(handle) {
      handle.addClass([
        resizeClasses.JQUI_RESIZE_HANDLE_CLASS,
        resizeClasses.JQUI_RESIZE_DIRECTION_PREFIX + resizeHandleDirection
      ].join(' '));
    }

    function evalResizeOptions() {
      var optionsAttr = $scope.$eval($element.attr('cog-dock-resizable'));
      return angular.isObject(optionsAttr) && optionsAttr || {};
    }
  }

})();
