(function () {
  'use strict';

  angular.module('ngDockPanel')
         .directive('dockResizable', dockResizableDirective);


  function dockResizableDirective() {
    return {
      require: 'dock',
      restrict: 'A',
      controller: dockResizableDirectiveController
    };
  }

  dockResizableDirectiveController.$inject = ['$scope', '$element', 'dockService'];
  function dockResizableDirectiveController($scope, $element, dockService) {

    var resizeClasses = dockService.uiResizeClasses;

    var dockPosition = dockService.evalDockPosition($element.attr('dock'), $scope),
      resizeHandleDirection;


    enableResize();

    $scope.$watch(function () {
      var newDockPosition = dockService.evalDockPosition($element.attr('dock'), $scope);

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
      resizeHandleDirection = dockService.dockPositionHandles[dockPosition];
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
      var optionsAttr = $scope.$eval($element.attr('dock-resizable'));
      return angular.isObject(optionsAttr) && optionsAttr || {};
    }
  }

})();
