'use strict';

var app = angular.module('myApp',['ngRoute','ui.bootstrap','ngAnimate']);

// web3 合约的处理------------------
//创建web3对象
// 连接到以太坊节点
 var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
// // if (typeof web3 !== 'undefined') {
// //   web3 = new Web3(web3.currentProvider);
// // } else {
// //   // set the provider you want from Web3.providers
//
//
console.log(web3);
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

app.controller('employeeController',function($scope,$rootScope,$http,$location){
  $scope.id = $rootScope.id;
  $scope.obj = {};
  $scope.info = true;
  $rootScope.contracts = {};
  $rootScope.accounts = web3.eth.getAccounts(function(e,acs){
    $rootScope.account = acs[0];
    console.log(account);
  });
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
  $scope.sum = $scope.objs.length;
  $rootScope.contracts = {};

  $.getJSON('Payroll.json',function(data){
    $rootScope.contracts.Payroll = TruffleContract(data);
    //---终于改对！！！！  必须是web3.currentProvider!!!!!
    $rootScope.contracts.Payroll.setProvider(web3.currentProvider);
    $rootScope.contracts.Payroll.deployed().then(function(instance){
      console.log(instance);
    })
  })


  $scope.getinfos = function(){
    $scope.money = true;
  }
//删除员工
  $scope.deleteEmployee = function(temp){
    //打开模态窗口
    $scope.modalInstance1 = $uibModal.open({
      templateUrl:"deleteEmployee.html",
      controller:"deleteEmployeeController",
      resolve:{
         name:function(){
           return temp.name;
         }
      }
    })
    $scope.modalInstance1.result.then(function(responce){
      console.log(responce);
      if(responce == 'ok'){
        //删除用户
        ;
      }
      else return ;
    },function(e){
      console.log(e);
    })
  }
//添加员工
  $scope.addEmployee = function(){
    $scope.modalInstance2 = $uibModal.open({
      templateUrl:"addEmployee.html",
      controller:"addEmployeeController"
    })
    $scope.modalInstance2.result.then(function(result){
      if(result == 'close'){
        return ;
      }
      $rootScope.contracts.Payroll.deployed().then(function(instance){
        instance.addEmployee(result.payAccount, result.salary, $scope.sum, {from: $rootScope.account,gas:300000}).then(function(d){
          console.log(d);
        },function(e){
          console.log(e);
        });
      });
    },function(e){
      console.log(e);
    })
  }
//修改工资
  $scope.changSalary = function(){

  }
//账户充值
  $scope.addFund = function(){
    $scope.modalInstance3 = $uibModal.open({
      templateUrl:'addFund.html',
      controller:'addFundController'
    })
    $scope.modalInstance3.result.then(function(responce){
      if(responce == 'close'){
        return ;
      }
      //账户充值
      // $rootScope.contracts.Payroll.deployed().then(function(instance){
      //   instance.addFund(responce).then(function(responce){
      //     console.log("changzhichenggong!!!");
      //   },function(e){
      //     console.log(e);
      //   })
      // },function(e){
      //   console.log(e);
      // })
      //更改显示的值
    })
  }
//查看员工工资
  $scope.getpayinfo = function(){
    $scope.money = false;
    $scope.payobjs = [];
    // $scope.balance;
    // $scope.count;
    //员工人数---》一个一个的得到员工的工资，编号与json文件的编号相对应
    $rootScope.contracts.Payroll.deployed().then(function(instance){
      return instance.checkInfo.call();
    }).then(function(data){
      $scope.balance = data[0].c[0];
      $scope.count = data[2].c[0];
      console.log($scope.count);
    }).then(function(){
      //solidity不支持返回结构提数组，只能一个一个的查询
      for(var i = 0; i< $scope.count; i++){
        var temp = {};
        $rootScope.contracts.Payroll.deployed().then(function(instance){
          instance.checkEmployee(i, {from: $rootScope.account}).then(function(responce){
            console.log(responce);
          },function(e){
            console.log(e);
          })
        })
      }
    })

  }
})

app.controller('addFundController',function($scope,$uibModalInstance){
  $scope.fund;

  $scope.ok = function(){
    $uibModalInstance.close($scope.fund);
  }
  $scope.cancel = function(){
    $uibModalInstance.dismiss('close');
  }

})

app.controller('deleteEmployeeController',function($uibModalInstance,$scope,name){
  $scope.name = name;
  $scope.ok = function(){
    $uibModalInstance.close('ok');
  }
  $scope.cancel = function(){
    $uibModalInstance.dismiss('close');
  }
})

app.controller('addEmployeeController',function($uibModalInstance,$scope){
  $scope.obj = {};
  $scope.ok = function(){
    $scope.obj.name = $scope.name;
    $scope.obj.sex = $scope.sex;
    $scope.obj.birth = $scope.birth;
    $scope.obj.salary = $scope.salary;
    $scope.obj.position = $scope.position;
    $scope.obj.address = $scope.address;
    $scope.obj.account = $scope.account;
    $scope.obj.payAccount = $scope.payAccount;
    $uibModalInstance.close($scope.obj);
  }
  $scope.cancel = function(){
    $uibModalInstance.dismiss('close');
  }
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
