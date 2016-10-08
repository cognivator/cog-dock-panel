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
