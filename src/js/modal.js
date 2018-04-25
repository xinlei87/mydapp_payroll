app.controller('changSalaryController',function($scope,$uibModalInstance,temp){
  $scope.temp = temp;
  $scope.newsalary;

  $scope.cancel = function(){
    $uibModalInstance.dismiss('close');
  }
  $scope.ok = function(){
    $uibModalInstance.close($scope.newsalary);
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

app.controller('addEmployeeController',function($uibModalInstance,$scope,datePicker){
  //出生日期选择
  $scope.config = '2016-6-21';
  $scope.open = function() {
      // console.log(this)
      var p = datePicker.open($scope.config);
      p.then(function(s) {
          $scope.config = s
      })
  };

  $scope.obj = {};
  $scope.ok = function(){
    $scope.obj.name = $scope.name;
    $scope.obj.sex = $scope.sex;
    $scope.obj.birth = $scope.birth;
    $scope.obj.salary = $scope.salary;
    $scope.obj.position = $scope.position;
    $scope.obj.address = $scope.address;
    $scope.obj.accountname = $scope.accountname;
    $scope.obj.payAccount = $scope.payAccount;
    $uibModalInstance.close($scope.obj);
  }
  $scope.cancel = function(){
    $uibModalInstance.dismiss('close');
  }
})

app.controller('EmployeeinfoController',function($scope,$uibModalInstance,temp){
  $scope.temp = temp;
  $scope.close = function(){
    $uibModalInstance.dismiss('close');
  }
})
