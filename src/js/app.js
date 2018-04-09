'use strict';

var app = angular.module('myApp',['ngRoute','ui.bootstrap']);

// web3 合约的处理------------------
//创建web3对象
// 连接到以太坊节点
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
// if (typeof web3 !== 'undefined') {
//   web3 = new Web3(web3.currentProvider);
// } else {
//   // set the provider you want from Web3.providers


console.log(web3);
var connected = web3.isConnected();
if(!connected){
  console.log("node not connected!");
}else{
  console.log("node connected");
}
//获取区块链上的账户
var accounts = web3.eth.accounts;
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
      console.log(data);
    })

  }
})

app.controller('employeeController',function($scope,$rootScope,$http,$location){
  $scope.id = $rootScope.id;
  $scope.obj = {};
  $scope.info = true;
  $rootScope.contracts = {};
  $http.get('./assets/employeeinfo.json').then(function(response){
    $scope.obj = response.data[$scope.id];
    console.log($scope.obj.img);
  },function(response){
    console.log(response);
  });
  $scope.getpayinfo = function(){
    $scope.info = false;
    //发工资----与合约交互
    if($rootScope.contracts == null||angular.equals({}, $rootScope.contracts)){
      $.getJSON('Payroll.json',function(data){
        $rootScope.contracts.Payroll = TruffleContract(data);
        //---终于改对！！！！  必须是web3.currentProvider!!!!!
        $rootScope.contracts.Payroll.setProvider(web3.currentProvider);
        $rootScope.contracts.Payroll.deployed().then(function(instance){
          console.log(instance);
        })
      })
    }
  }
  $scope.getinfo = function(){
    $scope.info = true;
  }
  $scope.logout = function(){
    $location.path("/");
  }
})

app.controller('employerController',function($scope,$http,$rootScope,$uibModal){
  $scope.objs = [];
  $scope.money = true;
  $http.get('./assets/employeeinfo.json').then(function(response){
    $scope.objs = response.data;
  });

  $scope.getinfos = function(){
    $scope.money = true;
  }

  $scope.deleteEmployee = function(){
    //打开模态窗口
    $scope.modalInstance1 = $uiMmodal.open({
      templateUrl:"deleteEmployee.html",
      controller:"deleteEmployeeController",
      // resolve({
        // data:function(){
          // return $scope.name
        // }
      })
  }

  $scope.addEmployee = function(){
    $scope.modalInstance2 = $uibModal.open({
      templateUrl:"addEmployee.html",
      controller:"addEmployeeController"

    })
  }

  $scope.changSalary = function(){

  }
})
app.controller('deleteEmployeeController',function($uibModalInstance,$scope){

})
app.controller('addEmployeeController',function($uibModalInstance,$scope){

})
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
