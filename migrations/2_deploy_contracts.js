var Payroll = artifacts.require("Payroll");
var SafeMath = artifacts.require("SafeMath");
var Ownable = artifacts.require("Ownable");
module.exports = function(deployer){
    deployer.deploy(SafeMath);
    deployer.deploy(Ownable).then(function(){
        return deployer.deploy(Payroll,Ownable.address);
      })
}
