'use strict';

var app = angular.module('myApp',['ngRoute','ui.bootstrap','ngAnimate']);

// web3 合约的处理------------------
//创建web3对象
// 连接到以太坊节点

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  //set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}
//
var connected = web3.isConnected();
if(!connected){
  console.log("node not connected!");
}else{
  console.log("node connected");
}
// //获取区块链上的账户

////--------------------

//angular 页面时间的处理-------------------
app.controller('loginController',function($scope,$location,$http,$rootScope){
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
    //提交用户名，密码
    // $scope.password = hex_md5($scope.password);
    $http({
      method:'POST',
      url:'http://localhost:8888/login',
      data:{
        accountname:$scope.accountname,
        password:$scope.password
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      transformRequest: function(obj) {
          var str = [];
          for (var s in obj) {
            str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
          }
          return str.join("&");
        }
      }).then(function(response){
          console.log("ok");
          $rootScope.userid = response.data.id;
          if($scope.accounttype == "employee"){
            //记录用户id
            $location.path("/employee");
          }
          else{
            $location.path("/employer");
          }
      },function(e){
          console.log("bad");
          console.log(e);
          alert("用户名或密码错误");
      })
  }

})

//路由控制
app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
  $locationProvider.hashPrefix('');
  $routeProvider.when(
    '/employee',
    {
      templateUrl:'./employee.html',
      controller:'employeeController'
    }
  )
  $routeProvider.when(
    '/employer',
    {
      templateUrl:'./employer.html',
      controller:'employerController'
    }
  )
  $routeProvider.when(
    '/',
    {
      templateUrl:'./login.html',
      controller:'loginController'
    }
  )
  .otherwise({redirectTo:'/'});
}])
