app.constant("config", {
    url : "http://182.23.70.28:3501",
    // url: "http://127.0.0.1:3500",
    // urlJson: "../app/assets/dummy_data",
    urlMap : "http://maps.google.com/maps/api/js?key=AIzaSyB-MYZD_nYGIVsmOenfyEsBI9ToD7mck1w&libraries=places"
});

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider

   .state('app', {
        url: '',
        templateUrl: 'app/views/app.html',
        controller: 'AppCtrl'
    })

    // state awal ketika mulai
    .state('app.home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'app/views/home.html'
    })

    // state login
    .state('login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'app/views/page-login.html'
    })

    // state register
    .state('register', {
        url: '/register',
        controller: 'RegisterCtrl',
        templateUrl: 'app/views/page-register.html'
    })

	// state forgot passward
	.state('forgotPass', {
        url: '/forgotPass',
		controller: 'ForgotPassCtrl',
        templateUrl: 'app/views/forgot-password.html',

    })

//----------------------------------------------------------

    .state('app.events', {
        url: '/events',
        controller: 'EventsCtrl',
        templateUrl: 'app/views/events/page-events.html'
    })

    .state('app.events_form', {
        url: '/events/form/:id',
        controller: 'EventsFormCtrl',
        templateUrl: 'app/views/events/form-events.html'
    })

    .state('app.events_list', {
        url: '/events/list',
        controller: 'EventsListCtrl',
        templateUrl: 'app/views/events/list-events.html'
    })

    .state('app.events_detail', {
        url: '/events/detail/:id',
        controller: 'EventsDetailCtrl',
        templateUrl: 'app/views/events/page-event-details.html'
    })

    .state('app.vacancy', {
        url: '/vacancy',
        controller: 'VacancyCtrl',
        templateUrl: 'app/views/vacancy/page-vacancies.html'
    })

    .state('app.vacancydetail', {
        url: '/vacancy/detail/:id',
        controller: 'VacancyDetailCtrl',
        templateUrl: 'app/views/vacancy/page-job-details.html'
    })

    .state('app.vacancy_form', {
        url: '/vacancy/form/:id',
        controller: 'VacancyFormCtrl',
        templateUrl: 'app/views/vacancy/form-vacancies.html'
    })

    .state('app.vacancy_list', {
        url: '/vacancy/list',
        controller: 'VacancyListCtrl',
        templateUrl: 'app/views/vacancy/list-vacancies.html'
    })

    .state('app.memories', {
        url: '/memories',
        controller: 'MemoryCtrl',
        templateUrl: 'app/views/memories/page-memories.html'
    })

    .state('app.memories_form', {
        url: '/memories/form/:id',
        controller: 'MemoryFormCtrl',
        templateUrl: 'app/views/memories/form-memories.html'
    })

    .state('app.memories_list', {
        url: '/memories/list',
        controller: 'MemoryListCtrl',
        templateUrl: 'app/views/memories/list-memories.html'
    })

    .state('app.memories_detail', {
        url: '/memories/detail/:id',
        controller: 'MemoryDetailCtrl',
        templateUrl: 'app/views/memories/page-memories-detail.html'
    })

    .state('app.alumni', {
        url: '/alumni',
        controller: 'AlumniCtrl',
        templateUrl: 'app/views/alumni/page-alumni.html'
    })

    .state('app.verified', {
        url: '/verified',
        controller: 'VerifiedCtrl',
        templateUrl: 'app/views/alumni/verified-account.html'
    })

    .state('app.unverified', {
        url: '/unverified',
        controller: 'UnverifiedCtrl',
        templateUrl: 'app/views/alumni/unverified-account.html'
    })

    .state('app.setting', {
        url: '/setting',
        controller: 'SettingCtrl',
        templateUrl: 'app/views/setting/page-setting.html'
    })

    .state('app.profile', {
        url: '/profile/:id',
        controller: 'ProfileCtrl',
        templateUrl: 'app/views/setting/profile.html'
    })

    .state('app.academic', {
        url: '/academic/:id',
        controller: 'AcademicCtrl',
        templateUrl: 'app/views/setting/academic.html'
    })

    .state('app.password', {
        url: '/password',
        controller: 'PasswordCtrl',
        templateUrl: 'app/views/setting/change-password.html'
    })

    .state('app.detail_user', {
        url: '/account/:id',
        controller: 'UserCtrl',
        templateUrl: 'app/views/alumni/detail-user.html'
    })

	.state('app.knowledgessharing', {
        url: '/knowledgessharing',
        controller: 'KnowledgessharingCtrl',
        templateUrl: 'app/views/knowledgessharing/page-knowledgessharing.html'
    })

    .state('app.knowledgessharing_form', {
        url: '/knowledgessharing/form/:id',
        controller: 'KnowledgessharingFormCtrl',
        templateUrl: 'app/views/knowledgessharing/form-knowledgessharing.html'
    })
	
	.state('app.knowledgessharing_popular', {
        url: '/knowledgessharing/popular/:id',
        controller: 'KnowledgessharingPopularCtrl',
        templateUrl: 'app/views/knowledgessharing/page-knowledgessharing-popular.html'
    })

    .state('app.knowledgessharing_list', {
        url: '/knowledgessharing/list',
        controller: 'KnowledgessharingListCtrl',
        templateUrl: 'app/views/knowledgessharing/list-knowledgessharing.html'
    })

    .state('app.knowledgessharing_detail', {
        url: '/knowledgessharing/detail/:id',
        controller: 'KnowledgessharingDetailCtrl',
        templateUrl: 'app/views/knowledgessharing/page-knowledgessharing-detail.html'
    })
	
	.state('app.knowledgessharing_category', {
        url: '/knowledgessharing/category/:idCategory',
        controller: 'KnowledgessharingCategoryCtrl',
        templateUrl: 'app/views/knowledgessharing/page-knowledgessharing-category.html'
    })
	
	.state('app.knowledgessharing-bycreator', {
        url: '/knowledgessharing/bycreator/:id',
        controller: 'KnowledgessharingByCreatorCtrl',
        templateUrl: 'app/views/knowledgessharing/page-knowledgessharing-bycreator.html'
    })
	
	.state('app.knowledgessharing_bookmarks', {
        url: '/knowledgessharing/bookmarks/:id',
        controller: 'KnowledgessharingBookmarksCtrl',
        templateUrl: 'app/views/knowledgessharing/page-knowledgessharing-bookmarks.html'
    })
	
	
    $urlRouterProvider.otherwise('/');

    $httpProvider.interceptors.push(function ($q, $location, localStorageService) {
        return {
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/login');
                    // Materialize.toast("Anda tidak memiliki hak akses.", 3000);
                } else if (response.status === 500) {
                    // Materialize.toast("Kesalahan jaringan, mohon periksa jaringan internet anda.", 3000);
                }else{
                    // Materialize.toast("Mohon maaf telah terjadi kesalahan sistem.", 3000);
                }
                return $q.reject(response);
            }
        };
    });


    $httpProvider.interceptors.push(function ($q, $location, localStorageService, Flash) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                var token = localStorageService.get("token");
                if (token) {
                    config.headers.Authorization = token;
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/login');
                    var message = "You dont have an Access.";
                    Flash.create('danger', message);
                } else if (response.status === 500) {
                    Flash.create('danger', response.data.message);
                }
                
                return $q.reject(response);
            }
        };
    });

});

app.run(function ($rootScope, $state, $stateParams, localStorageService) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name !== 'login' && toState.name !== 'register' && toState.name !== 'forgotPass' && localStorageService.get('user') == null) {
            event.preventDefault();
            $state.go('login');
        }
        $rootScope.root = {
            state: toState.name
        };
    });
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

});

app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('api');
    localStorageServiceProvider.setStorageType('localStorage'); // localStorage or sessionStorage
});

//angular flash message
(function() {
    'use strict';
    var app = angular.module('flash', []);

    app.run(function($rootScope) {
        // initialize variables
        $rootScope.flash = {};
        $rootScope.flash.text = '';
        $rootScope.flash.type = '';
        $rootScope.flash.timeout = 5000;
        $rootScope.hasFlash = false;
    });

    // Directive for compiling dynamic html
    app.directive('dynamic', function($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, ele, attrs) {
                scope.$watch(attrs.dynamic, function(html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    });

    // Directive for closing the flash message
    app.directive('closeFlash', function($compile, Flash) {
        return {
            link: function(scope, ele) {
                ele.on('click', function() {
                    Flash.dismiss();
                });
            }
        };
    });

    // Create flashMessage directive
    app.directive('flashMessage', function($compile, $rootScope) {
        return {
            restrict: 'A',
            template: '<div role="alert" ng-show="hasFlash" class="alert {{flash.addClass}} alert-{{flash.type}} alert-dismissible ng-hide alertIn alertOut "> <span dynamic="flash.text"></span> <button type="button" class="close" close-flash><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> </div>',
            link: function(scope, ele, attrs) {
                // get timeout value from directive attribute and set to flash timeout
                $rootScope.flash.timeout = parseInt(attrs.flashMessage, 10);
            }
        };
    });

    app.factory('Flash', ['$rootScope', '$timeout',
        function($rootScope, $timeout) {

            var dataFactory = {},
                timeOut;

            // Create flash message
            dataFactory.create = function(type, text, addClass) {
                var $this = this;
                $timeout.cancel(timeOut);
                $rootScope.flash.type = type;
                $rootScope.flash.text = text;
                $rootScope.flash.addClass = addClass;
                $timeout(function() {
                    $rootScope.hasFlash = true;
                }, 100);
                timeOut = $timeout(function() {
                    $this.dismiss();
                }, $rootScope.flash.timeout);
            };

            // Cancel flashmessage timeout function
            dataFactory.pause = function() {
                $timeout.cancel(timeOut);
            };

            // Dismiss flash message
            dataFactory.dismiss = function() {
                $timeout.cancel(timeOut);
                $timeout(function() {
                    $rootScope.hasFlash = false;
                });
            };
            return dataFactory;
        }
    ]);

}());
