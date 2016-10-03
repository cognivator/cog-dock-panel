(function () {
  'use strict';

  /* globals
   angular
   */

  angular.module('ngDockPanel')
         .directive('dockPanel', dockPanelDirective);


  function dockPanelDirective() {
    return {
      restrict: 'A',
      scope: true,
      controller: dockPanelDirectiveController
    };
  }

  dockPanelDirectiveController.$inject = ['$scope', '$element', 'dockService'];
  function dockPanelDirectiveController($scope, $element, dockService) {
    $scope.__dockPanel_id = String(Math.random()).replace(/\./g, '');
    dockService.dockPanels[$scope.__dockPanel_id] = new dockService.Panel($element, $scope);
  }

})();
