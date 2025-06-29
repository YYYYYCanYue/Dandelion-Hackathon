// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// 此合约与前端的任务支付、资金托管、争议处理等页面交互
contract Escrow {

    // 存储每个任务的托管资金
    mapping(uint256 => uint256) public taskFunds;
    address public factory;
    bool public factorySet = false;
    
    // 平台资金池
    uint256 public platformPool;

    event FundsDeposited(uint256 indexed taskId, uint256 amount);// 存入资金事件
    event FundsReleased(uint256 indexed taskId, address recipient);// 释放资金事件
    event FundsRefunded(uint256 indexed taskId, address recipient, uint256 amount);// 退款事件
    event PoolAdded(uint256 indexed taskId, uint256 amount);
    event JurorRewarded(uint256 indexed taskId, address juror, uint256 amount);
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

    // 将恶意任务资金转入平台池
    function addToPool(uint256 _taskId, uint256 amount) external onlyFactory {
        require(taskFunds[_taskId] >= amount, "Insufficient task funds");
        taskFunds[_taskId] -= amount;
        platformPool += amount;
        emit PoolAdded(_taskId, amount);
    }

    //争议处理中扣除保证金逻辑（预留接口）
    function slashDeposit(uint256 _taskId, address _bidder) external onlyFactory {
        // 可根据实际需求实现保证金惩罚逻辑
    }

    // 奖励仲裁员（用于恶意任务仲裁奖励）
    function rewardJuror(uint256 _taskId, address juror, uint256 amount) external onlyFactory {
        require(taskFunds[_taskId] >= amount, "Insufficient task funds");
        require(juror != address(0), "Invalid juror address");
        taskFunds[_taskId] -= amount;
        payable(juror).transfer(amount);
        emit JurorRewarded(_taskId, juror, amount);
    }
}