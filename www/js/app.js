// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.config'])

.run(function ($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
    $rootScope.hospitalName = '浙江大学医学院附属第四医院';
})

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
         .state('login', {
             url: "/login",
             controller: "LoginCtrl",
             templateUrl: "templates/login.html"
         })

      // setup an abstract state for the tabs directive
      .state('tab', {
          url: '/tab',
          abstract: true,
          templateUrl: 'templates/tabs.html'
      })

    // Each tab has its own nav history stack:
    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })

    //.state('tab.oa', {
    //    url: '/oa',
    //    views: {
    //        'tab-oa': {
    //            templateUrl: 'templates/tab-chats.html',
    //            controller: 'ChatsCtrl'
    //        }
    //    }
    //})
    //  .state('tab.chat-detail', {
    //      url: '/chats/:chatId',
    //      views: {
    //          'tab-chats': {
    //              templateUrl: 'templates/chat-detail.html',
    //              controller: 'OACtrl'
    //          }
    //      }
    //  })

    //.state('tab.rounds', {
    //    url: '/rounds',
    //    views: {
    //        'tab-rounds': {
    //            templateUrl: 'templates/rounds/roundsTabs.html',
    //            controller: 'RoundsCtrl'
    //        }
    //    }
    //})

    .state('tab.search', {
        url: '/search',
        views: {
            'tab-search': {
                templateUrl: 'templates/search.html',
                controller: 'SearchCtrl'
            }
        }
    })

    .state('tab.me', {
        url: '/me',
        views: {
            'tab-me': {
                templateUrl: 'templates/me/docInfo.html',
                controller: 'MeCtrl'
            }
        }
    })
    .state('tab.rounds', {
        url: '/rounds',
        views: {
            'tab-rounds': {
                templateUrl: 'templates/rounds/bedCard.html',
                controller: 'RoundsCtrl'
            }
        }
    })

    .state('tab.func', {
        url: '/func',
        //abstract: true,
        views: {
            'tab-rounds': {
                templateUrl: 'templates/rounds/roundsTabs.html',
                controller: 'RoundsFuncCtrl'
            }
        }
    })

    .state('tab.func.diagnosis', {
        url: '/diagnosis',
        cache: 'false',
        views: {
            'rounds-diagnosis': {
                templateUrl: 'templates/rounds/tabs/diagnosis.html',
                controller: 'DiagnosisCtrl'
            }
        }
    })

    .state('tab.func.order', {
        url: '/order',
        cache: 'false',
        views: {
            'rounds-order': {
                templateUrl: 'templates/rounds/tabs/order.html',
                controller: 'OrderCtrl'
            }
        }
    })

    .state('tab.func.check', {
        url: '/check',
        cache: 'false',
        views: {
            'rounds-check': {
                templateUrl: 'templates/rounds/tabs/check.html',
                controller: 'CheckCtrl'
            }
        }
    })

    .state('tab.func.test', {
        url: '/test',
        cache: 'false',
        views: {
            'rounds-test': {
                templateUrl: 'templates/rounds/tabs/test.html',
                controller: 'TestCtrl'
            }
        }
    })

    .state('tab.func.blood', {
        url: '/blood',
        cache: 'false',
        views: {
            'rounds-blood': {
                templateUrl: 'templates/rounds/tabs/blood.html',
                controller: 'BloodCtrl'
            }
        }
    })

    .state('tab.func.medDoc', {
        url: '/medDoc',
        cache: 'false',
        views: {
            'rounds-medDoc': {
                templateUrl: 'templates/rounds/tabs/document.html',
                controller: 'MedDocCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');///tab/home

});
