(function () {
  'use strict';

  /* globals
   angular
   */

  angular.module('ngDockPanel')
         .directive('dock', dockDirective);


  function dockDirective() {
    return {
      restrict: 'A',
      scope: true,
      controller: dockDirectiveController
    };
  }

  dockDirectiveController.$inject = ['$scope', '$element', 'dockService'];
  function dockDirectiveController($scope, $element, dockService) {
    var dockPosition = dockService.evalDockPosition($element.attr('dock'), $scope);
    $scope.__dock_id = String(Math.random()).replace(/\./g, '');
    var parentPanel = dockService.dockPanels[$scope.$parent.__dockPanel_id];
    parentPanel.addChild($element, dockPosition);
  }

})();
