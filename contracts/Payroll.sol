pragma solidity ^0.4.14;

import './SafeMath.sol';
import './Ownable.sol';


contract Payroll is Ownable {
    using SafeMath for uint;

    struct Employee {
        address id;//用户地址
        uint salary;//工资
        uint lastPayday;//上次发工资时间
        uint number;//用户编号
    }

    uint constant payDuration = 30 days;//每30天发一次工资

    uint totalSalary;//总工资
    uint totalEmployee;//总员工数
    address[] employeeList;//员工的地址列表
    mapping(address => Employee) public employees;//地址到员工工资情况的映射

    event NewEmployee(
        address employee
    );
    event UpdateEmployee(
        address employee
    );
    event RemoveEmployee(
        address employee
    );
    event NewFund(
        uint balance
    );
    event GetPaid(
        address employee
    );
//员工是否存在
    modifier employeeExit(address employeeId) {
        var employee = employees[employeeId];
        assert(employee.id != 0x0);
        _;
    }
//提前发工资
    function _partialPaid(Employee employee) private {//支付部分工资
        /* uint payment = employee.salary
            .mul(now.sub(employee.lastPayday))//计算工资
            .div(payDuration); */
        uint daypayment = employee.salary.div(21);
        uint payment = daypayment.mul(now.sub(employee.lastPayday).div(1 days));
        employee.id.transfer(payment);
    }
//查询工资情况
    function checkEmployee(uint index) returns (address employeeId, uint salary, uint lastPayday,uint number) {
        employeeId = employeeList[index];
        var employee = employees[employeeId];
        salary = employee.salary;
        lastPayday = employee.lastPayday;
        number = employee.number;
    }
//查询所有员工工资情况
    function searchEmployees() returns(Employee[] employeeArray){
      for(var i = 0; i< totalEmployee; i++){
        var id = employeeList[i];
        var employee = employees[id];
        employeeArray[i].salary = employee.salary;
        employeeArray[i].lastPayday = employee.lastPayday;
        employeeArray[i].number = employee.lastPayday;
      }
    }
//添加员工
    function addEmployee(address employeeId, uint salary, uint number) onlyOwner {
        var employee = employees[employeeId];
        assert(employee.id == 0x0);//检查员工是否存在

        employees[employeeId] = Employee(employeeId, salary.mul(1 ether), now,number);
        totalSalary = totalSalary.add(employees[employeeId].salary);
        totalEmployee = totalEmployee.add(1);
        employeeList.push(employeeId);
        NewEmployee(employeeId);//触发事件
    }
//删除员工
    function removeEmployee(address employeeId) onlyOwner employeeExit(employeeId) {
        var employee = employees[employeeId];

        _partialPaid(employee);//结算工资
        totalSalary = totalSalary.sub(employee.salary);
        delete employees[employeeId];
        totalEmployee = totalEmployee.sub(1);
        RemoveEmployee(employeeId);
    }
//设置新工资
    function updateEmployee(address employeeId, uint salary) onlyOwner employeeExit(employeeId) {
        var employee = employees[employeeId];

        _partialPaid(employee);
        totalSalary = totalSalary.sub(employee.salary);
        employee.salary = salary.mul(1 ether);
        employee.lastPayday = now;
        totalSalary = totalSalary.add(employee.salary);
        UpdateEmployee(employeeId);
    }
//????
    function addFund() payable returns (uint) {
        NewFund(this.balance);
        return this.balance;
    }

    function calculateRunway() returns (uint) {
        return this.balance.div(totalSalary);
    }

    function hasEnoughFund() returns (bool) {
        return calculateRunway() > 0;
    }

    function getPaid() employeeExit(msg.sender) {
        var employee = employees[msg.sender];

        uint nextPayday = employee.lastPayday.add(payDuration);//下次发工资的时间
        assert(nextPayday < now);

        employee.lastPayday = nextPayday;//更新发工资日期
        employee.id.transfer(employee.salary);
        GetPaid(employee.id);
    }

    function checkInfo() returns (uint balance, uint runway, uint employeeCount) {
        balance = this.balance;
        employeeCount = totalEmployee;
        runway = 0;
        if (totalSalary > 0) {
            runway = calculateRunway();
        }
    }
}
