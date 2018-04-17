app.controller('employeeController',function($scope,$rootScope,$http,$location){
  if($rootScope.userid == null){
    $location.path('/');
  }
  $scope.id = $rootScope.userid;
  //职员id
  console.log("id:" + $scope.id);
  // $scope.obj = {};
  $scope.info = true;
  $scope.pay = {};
  $rootScope.contracts = {};
  $rootScope.accounts = web3.eth.getAccounts(function(e,acs){
    $rootScope.account = acs[0];
    console.log("account:" + $rootScope.account);
  });
  //根据职员id 获取职员详情
  $http({
    method:'GET',
    url:'http://localhost:8888/employeeinfo',
    params:{
      id:$rootScope.userid
    }
  }).then(function(response){
    $scope.obj = response.data[0];
    console.log($scope.obj);
    $.getJSON('Payroll.json',function(data){
      $rootScope.contracts.Payroll = TruffleContract(data);
      //---终于改对！！！！  必须是web3.currentProvider!!!!!
      $rootScope.contracts.Payroll.setProvider(web3.currentProvider);
      $rootScope.contracts.Payroll.deployed().then(function(instance){
        console.log(instance);
        $rootScope.contracts.Payroll.instance = instance;
      })
    })
  },function(e){
    console.log(e);
  })
  $scope.getpayinfo = function(){
    $scope.info = false;
    //获取员工工资信息
    console.log($rootScope.account);
    $rootScope.contracts.Payroll.instance.checkEmployee.call($rootScope.userid -1,{from : $rootScope.account,gas:300000}).then(function(response){
      console.log("response:" + response);
      var temp = response.toLocaleString().split(',');
      $scope.pay.address = temp[0];
      $scope.pay.salary = web3.fromWei(temp[1],'ether');
      $scope.pay.lastPayday = temp[2];
    },function(e){
      console.log(e);
    }).then(function(){

    })
  }
  $scope.getpay = function (){
    $rootScope.contracts.Payroll.instance.getPaid({from:$rootScope.account,gas:300000}).then(function(response){
      console.log(response);
      alert("工资领取成功");
    },function(e){
      console.log(e);
    })
  }
  $scope.getinfo = function(){
    $scope.info = true;
  }
  $scope.logout = function(){
    $location.path("/");
  }
})
