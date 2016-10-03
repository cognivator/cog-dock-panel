(function () {
  'use strict';
// Sample script to obtain dynamic dock
  var dockapp = angular.module('testdock', ['ngDockPanel']);

  dockapp.controller('sampleController', function ($scope) {
    $scope.div2 = {
      dock: 'left'
    };
    $scope.toggleLeftRight = function () {
      if ($scope.div2.dock === 'left') {
        $scope.div2.dock = 'right';
      } else {
        $scope.div2.dock = 'left';
      }
    };
    $scope.isBarVisible = [ true, true, true, false, true, true, false, true, true ];
  });

})();
