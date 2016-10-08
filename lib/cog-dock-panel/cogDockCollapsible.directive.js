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
