var app = angular.module('app', [
    'ui.router',
    'ngAnimate',
    'ngSanitize',
    'ngStorage',
    'LocalStorageModule',
    'ngTable',
    'ui.bootstrap',
    'ngFileUpload',
    'ngMap',
    'ngImgCrop',
    'bootstrapLightbox',
    'ngFlash',
    'angular-loading-bar'
]);

app.run(function($rootScope, $location, $state, $localStorage, $anchorScroll, $stateParams) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {

    });
});

app.controller("MainCtrl", ['$scope', '$http',
    function ($scope, $http) {
    $scope.share = {};
}]);

