// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Escrow {
    // 存储每个任务的托管资金
    mapping(uint256 => uint256) public taskFunds;
    address public factory;
    bool public factorySet = false;
    
    event FundsDeposited(uint256 indexed taskId, uint256 amount);// 存入资金事件
    event FundsReleased(uint256 indexed taskId, address recipient);// 释放资金事件
    event FundsRefunded(uint256 indexed taskId, address recipient, uint256 amount);// 退款事件

    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory can operate");
        _;
    }

    constructor(address _factory) {
        factory = _factory;
        if(_factory != address(0)) factorySet = true;
    }

    function setFactory(address _factory) external {
        require(!factorySet, "Factory already set");
        require(_factory != address(0), "Invalid address");
        factory = _factory;
        factorySet = true;
    }

    //存入资金到特定任务
    function depositFunds(uint256 taskId) external payable onlyFactory {
        require(msg.value > 0, "No funds sent");
        taskFunds[taskId] += msg.value;
        emit FundsDeposited(taskId, msg.value);
    }

    //释放资金给中标者
    function releaseFunds(uint256 _taskId, address _winner) external onlyFactory {
        require(_winner != address(0), "Invalid winner address");
        uint256 amount = taskFunds[_taskId];
        require(amount > 0, "No funds available");

        taskFunds[_taskId] = 0;
        payable(_winner).transfer(amount);

        emit FundsReleased(_taskId, _winner);
    }

    //退还资金给任务创建者（如任务取消或过期无人中标）
    function refundFunds(uint256 _taskId, address _creator) external onlyFactory {
        uint256 amount = taskFunds[_taskId];
        require(amount > 0, "No funds to refund");
        require(_creator != address(0), "Invalid creator address");

        taskFunds[_taskId] = 0;
        payable(_creator).transfer(amount);

        emit FundsRefunded(_taskId, _creator, amount);
    }

    //争议处理中扣除保证金逻辑（预留接口）
    function slashDeposit(uint256 _taskId, address _bidder) external onlyFactory {
        // 可根据实际需求实现保证金惩罚逻辑
    }
}