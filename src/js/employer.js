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
          console.log("添加员工：");
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
      console.log("查询员工工资：");
      for(var i = 0; i< $scope.count; i++){
        var temp = {};
        $rootScope.contracts.Payroll.deployed().then(function(instance){
          return instance.checkEmployee.call(i,{from : $rootScope.account});
        }).then(function(responce,res2){
          console.log(responce + res2);
        },function(e){
          console.log(e);
        })
      }
    })

  }
})
