var appSumo = angular.module('appSumo', ['ngRoute']);

appSumo.config(['$locationProvider', '$routeProvider', '$httpProvider', function($locationProvider, $routeProvider, $httpProvider) {
    $locationProvider.html5Mode(true);

    //a simple way to show error for http RESTful requests, in production this would be more elegant
    $httpProvider.interceptors.push(function($q) {
        return {
            'responseError': function(response) {
                var errors = [];

                if(response.data.error)
                    typeof(response.data.error) == 'string' ? errors.push(response.data.error) :  errors.push(response.data.error.message);

                if(response.data.errors) {
                    response.data.errors.forEach(function(message) {
                        typeof(message) == 'string' ? errors.push(message) :  errors.push(message.message);
                    });
                }

                if(errors.length)
                    alert(errors.join('\n'));

                return $q.reject(response);
            }
        };
    });

    $routeProvider
        .when('/initialize', {
            controller:'initialize',
            templateUrl:'initialize',
            reloadOnSearch: false
        })
        .when('/', {
            controller:'answerQuestions',
            templateUrl:'answer-questions',
            reloadOnSearch: false
        })
        .when('/admin-login', {
            controller:'adminLogin',
            templateUrl:'admin-login',
            reloadOnSearch: false
        })
        .when('/create-questions', {
            controller:'createQuestions',
            templateUrl:'create-questions',
            reloadOnSearch: false
        })
        .when('/analytics', {
            controller:'analytics',
            templateUrl:'analytics',
            reloadOnSearch: false
        })
        .otherwise({
            resolve:{
                run:function($rootScope, $location) {
                    $location.path('/')
                }
            }
        });
}]);

appSumo.run(function($rootScope, $location, $route, $user) {
    var initialized = false;

    function runAcl() {
        var url = $location.url().split('?')[0],
            userIsAdmin = $rootScope.user && $rootScope.user.isAdmin;

        if(!initialized)
            return;

        //admin user doesn't have access to login page or initialize page
        if(userIsAdmin && ['/initialize', '/admin-login'].indexOf(url) != -1)
            $location.url('/').replace();
        //non-admin users don't have access to create-questions or analytics page
        else if(!userIsAdmin && ['/create-questions', '/analytics'].indexOf(url) != -1)
            $location.url('/').replace();
    }

    $rootScope.user = {};

    $rootScope.updateUser = function() {
        $user.get('me', function(err, data) {
            initialized = true;

            if(err)
                $rootScope.user = {};
            else
                $rootScope.user = data;

            runAcl();
        });
    };
    $rootScope.updateUser();

    $rootScope.$on('$routeChangeSuccess', function() {
        $("html, body").scrollTop(0);

        $rootScope.template = '';

        if($route.current.templateUrl)
            $rootScope.template = $route.current.templateUrl.replace(/\//g, '-');

        runAcl();
    });

    $rootScope.logout = function() {
        $user.logout(function() {
            window.location = '/';
        });
    }
});