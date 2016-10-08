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
