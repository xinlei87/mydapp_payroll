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
