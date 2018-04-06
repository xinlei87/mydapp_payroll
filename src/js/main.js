var app = angular.module('myApp',['ngRoute']);
app.controller('login',function($scope,$location){
  $scope.concel= function(){
    accoutname = "";
    password = "";
  }
  $scope.chekLogin = function(){
    //验证用户名，密码
    $location.path("/employee");
  }
})
app.controller('employeeController',function($scope){

})
app.controller('employerController',function($scope){

})
app.config(['$routeProvide','$locationProvider',function($routeProvide,$locationProvider){
  $locationProvider.hashPrefix('');
  $routeProvide.when(
    '/employee',
    {
      templateUrl:'../employee.html',
      controller:'employeeController'
    }
  )
  $routeProvide.when(
    '/employer',
    {
      templateUrl:'../employer.html',
      controller:'employerController.html'
    }
  )
  $routeProvide.when(
    '/',
    {
      templateUrl:'../login.html',
      controller:'loginController'
    }
  )
  .otherwise({redirectTo:'/'});
}])
