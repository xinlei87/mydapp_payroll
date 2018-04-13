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

// $.getJSON('Payroll.json',function(data){
//   // console.log("ok");
//
// });


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
    $http.get('./assets/account.json').then(function(response){
      $scope.accounts = response.data;
      for( var i = 0; i< $scope.accounts.length;i++){
        if($scope.accounts[i].accountname == $scope.accountname){
          if($scope.accounts[i].password == $scope.password && $scope.accounttype == $scope.accounts[i].type){
            $rootScope.id = $scope.accounts[i].id;
            if($scope.accounttype == "employee"){
              $location.path("/employee");
            }
            else{
              $location.path("/employer");
            }
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
      console.log("shibai");
      console.log(date);
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
