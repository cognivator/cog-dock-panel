(function () {
  'use strict';

  angular.module('ngDockPanel')
         .directive('dockCollapsible', dockCollapsibleDirective);


  function dockCollapsibleDirective() {
    return {
      require: 'dock',
      restrict: 'A',
      controller: dockCollapsibleDirectiveController,
      controllerAs: 'vm'
    };
  }

  dockCollapsibleDirectiveController.$inject = ['$scope', '$element', 'dockService'];
  function dockCollapsibleDirectiveController($scope, $element, dockService) {
    var vm = this;

    var resizeClasses = dockService.uiResizeClasses;

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

    var dockPosition = dockService.evalDockPosition($element.attr('dock'), $scope),
        resizeHandleDirection;

    vm.toggleCollapse = _collapse;

    enableCollapse();

    $scope.$watch(function () {
      var newDockPosition = dockService.evalDockPosition($element.attr('dock'), $scope);

      if (newDockPosition !== dockPosition) {
        dockPosition = newDockPosition;
        enableCollapse();
      }
    });

    function _collapse() {
      console.log('in _collapse...');
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
