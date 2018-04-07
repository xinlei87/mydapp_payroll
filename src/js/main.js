'use strict';

var app = angular.module('myApp',['ngRoute']);
app.controller('loginController',function($scope,$location,$http){
  $scope.ok1 = true;
  $scope.ok2 = true;
  $scope.accountname = "";
  $scope.password = "";
  $scope.accounts = [];

  $scope.concel= function(){
    $scope.accountname = "";
    $scope.password = "";
  }
  $scope.chekLogin = function(){
    //验证用户名，密码
    if($scope.accountname == ""){
      $scope.ok1 = false;
      return ;
    }
    else if($scope.password == ""){
      $scope.ok2 = false;
      return ;
    }
    $http.get('/home/xinlei/mydapp/src/assets/account.json').then(function(response){
      $scope.accounts = response.data;
      for( var i = 0; i< $scope.accounts.length;i++){
        if($scope.accounts[i].accountname == $scope.accountname){
          if($scope.accounts[i].password == $scope.password && $scope.accounttype == $scope.accounts[i].type){
            $location.path("/employee");
            return;
          }
          else{
            alert("密码或账户类型错误！");
            return ;
          }
        }
      }
      alert("用户名不存在！");
      return;
    },function(date){
      console.log(data);
    })

  }
})
app.controller('employeeController',function($scope){

})
app.controller('employerController',function($scope){

})
app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
  $locationProvider.hashPrefix('');
  $routeProvider.when(
    '/employee',
    {
      templateUrl:'/home/xinlei/mydapp/src/employee.html',
      controller:'employeeController'
    }
  )
  $routeProvider.when(
    '/employer',
    {
      templateUrl:'/home/xinlei/mydapp/src/employer.html',
      controller:'employerController.html'
    }
  )
  $routeProvider.when(
    '/',
    {
      templateUrl:'/home/xinlei/mydapp/src/login.html',
      controller:'loginController'
    }
  )
  .otherwise({redirectTo:'/'});
}])