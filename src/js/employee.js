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
