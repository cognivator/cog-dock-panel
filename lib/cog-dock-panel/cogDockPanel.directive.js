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
