app.controller('employerController',function($scope,$http,$rootScope,$uibModal){
  $scope.objs = [];
  $scope.money = true;
  $http.get('./assets/employeeinfo.json').then(function(response){
    $scope.objs = response.data;
    $scope.sum = $scope.objs.length;
    console.log("sum:" + $scope.sum);
  });

  $rootScope.contracts = {};

  $.getJSON('Payroll.json',function(data){
    $rootScope.contracts.Payroll = TruffleContract(data);
    //---终于改对！！！！  必须是web3.currentProvider!!!!!
    $rootScope.contracts.Payroll.setProvider(web3.currentProvider);
    $rootScope.contracts.Payroll.deployed().then(function(instance){
      //避免要多次获取合约实例
      $rootScope.contracts.Payroll.instance = instance;
      $rootScope.contracts.Payroll.address = instance.address;
      // console.log(instance.address);
    })
  })


  $scope.getinfos = function(){
    $scope.money = true;
  }
//删除员工 ok
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
        $rootScope.contracts.Payroll.instance.removeEmployee(temp.address,{from:$rootScope.account,gas:300000}).then(function(re){
          console.log(re);
        },function(e){
          console.log(e);
        })
      }
      else return ;
    },function(e){
      console.log(e);
    })
  }
//添加员工 ok
  $scope.addEmployee = function(){
    $scope.modalInstance2 = $uibModal.open({
      templateUrl:"addEmployee.html",
      controller:"addEmployeeController"
    })
    $scope.modalInstance2.result.then(function(result){
      if(result == 'close'){
        return ;
      }
      // $rootScope.contracts.Payroll.deployed().then(function(instance){
        $rootScope.contracts.Payroll.instance.addEmployee(result.payAccount, result.salary, $scope.sum, {from: $rootScope.account,gas:300000}).then(function(re){
          $scope.sum ++;
          console.log("re:");
          console.log(re);
        },function(e){
          console.log(e);
        });
      // })
    },function(e){
      console.log(e);
    })
  }
//修改工资 ok
  $scope.changSalary = function(temp){
    //用户输入新工资
    $scope.modalInstance4 = $uibModal.open({
      templateUrl:'changSalary.html',
      controller:'changSalaryController',
      resolve:{
          temp: function (){
            return temp;
          }
      }
    })

    $scope.modalInstance4.result.then(function(re){
      if(re == 'close'){
        return;
      }
      else{
        console.log("newsalary:");
        console.log(re);
        $rootScope.contracts.Payroll.instance.updateEmployee(temp.address,re,{from:$rootScope.account,gas:300000}).then(function(re){
          console.log(re);
        },function(e){
          console.log(e);
        })
      }
    },function(e){
      console.log(e);
    })
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
      //账户充值-----!!!!
      // $rootScope.contracts.Payroll.instance.sendTransaction({from:$rootScope.contracts.Payroll.account,gas:30000,to:$rootScope.contracts.Payroll.address,value:responce},function(re){
      //   console.log("ok");
      // }).then(function(re){
      //   console.log(re);
      //   $rootScope.contracts.Payroll.instance.addFund.call().then(function(re){
      //     console.log(re);
      //   })
      // })

      //更改显示的值
    },function(e){
      console.log(e);
    })
  }
//查看员工工资 ok
  $scope.getpayinfo = function(){
    $scope.money = false;
    $scope.payobjs = [];
    $scope.pays = [];
    $scope.balance;
    $scope.count;
    //员工人数---》一个一个的得到员工的工资，编号与json文件的编号相对应
    $rootScope.contracts.Payroll.instance.checkInfo.call().then(function(data){
    $scope.balance = data[0].c[0];
    $scope.count = data[2].c[0];
    console.log("员工人数：" + $scope.count);
    }).then(function(){
      $scope.$apply('balance');
      //solidity不支持返回结构提数组，只能一个一个的查询
      for(var i = 0; i< $scope.count; i++){
          //一定要进行类型转换，不然会抛出 invalid opcode 错误
          var j = parseInt(i);
          //找了一天的bug
          // console.log("j:" + j);
          $rootScope.contracts.Payroll.instance.checkEmployee.call(j,{from : $rootScope.account,gas:300000}).then(function(responce){
            console.log(responce.toLocaleString());
            var temp = responce.toLocaleString().split(',');
            $scope.payobjs.push(temp);
            //不可用 $scope.payobjs[j] = responce !!!
            //js 的闭包是大问题！！！
          },function(e){
            console.log(e);
          }).then(function(){
            // console.log("length:");
            // console.log($scope.payobjs.length);
            if($scope.payobjs.length == $scope.count){
              console.log("is ok");
              for(var i = 0; i< $scope.count; i++){
                var tempobj = new Object();
                tempobj.address = $scope.payobjs[i][0];
                tempobj.salary = web3.fromWei($scope.payobjs[i][1],'ether');
                tempobj.lastPayday = $scope.payobjs[i][2];
                tempobj.number = $scope.payobjs[i][3];
                $scope.pays.push(tempobj);
              }
            }
          }).then(function(){
            //触发更新视图
            $scope.$apply('pays');
          })
      }
    }).then(function(){
      console.log($scope.pays);
    });
  }
})
