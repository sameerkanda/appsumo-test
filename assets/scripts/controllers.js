appSumo.controller('initialize', ['$rootScope', '$scope', '$location', '$user', function($rootScope, $scope, $location, $user) {
    $scope.signup = {};

    $scope.signupFormSubmit = function() {
        $user.signUp($scope.signup, function(err, status) {
            if(!err || status == 409)
                $location.path('/');

        });
    }
}]);

appSumo.controller('answerQuestions', ['$rootScope', '$scope', '$question', '$userAnswer', function($rootScope, $scope, $question, $userAnswer) {
    $scope.question = {};

    $scope.getNextQuestion = function() {
        $question.get('next', function(err, data) {
            if(err)
                $scope.question = false;
            else
                $scope.question = data;
        })
    };
    $scope.getNextQuestion();

    $scope.answerQuestionFormSubmit = function() {
        $userAnswer.create({answerId:$scope.userAnswer}, function(err, status) {
            $scope.getNextQuestion();
        });
    }
}]);

appSumo.controller('adminLogin', ['$rootScope', '$scope', '$user', function($rootScope, $scope, $user) {
    $scope.login = {};

    $scope.loginFormSubmit = function() {
        $user.login($scope.login, function() {
            $rootScope.updateUser();
        });
    }
}]);

appSumo.controller('createQuestions', ['$rootScope', '$scope', '$question', function($rootScope, $scope, $question) {
    $scope.question = {answers:['']};

    $scope.$watch('question', function() {
        var lastAnswer, isEmpty;

        if($scope.question.answers.length == 0)
            $scope.question.answers = [''];

        lastAnswer = $scope.question.answers[$scope.question.answers.length - 1];

        if(lastAnswer != '')
            $scope.question.answers.push('');
    }, true);

    $scope.createQuestionFormSubmit = function() {
        $question.create($scope.question, function(err, status) {
            if(!err) {
                alert('The question has been create!');

                $scope.question = {answers:['']};
            }
        });
    }
}]);

appSumo.controller('analytics', ['$rootScope', '$scope', function($rootScope, $scope) {

}]);