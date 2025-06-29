// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// 此合约与前端的任务创建、任务管理、任务状态更新等页面交互
// 主要负责任务的创建、状态管理、生命周期控制等功能
contract TaskFactory {
    enum TaskStatus {
        Created,
        Bidding,
        InProgress, // 进行中
        PendingEmployerConfirm, // 待雇主确认
        Completed,
        Disputed, // 争议中
        PendingDisputePeriod // 雇主否认后进入争议期
    }

    // 将 description 字段替换为 ipfsHash 字段，用于存储任务详细信息的 IPFS 哈希
    struct Task {
        uint256 id;
        string title;
        string ipfsHash; // IPFS哈希，存储任务详细信息
        string completeUrl; // 完成任务的URL
        string firstDemoUrl; // 第一次提交的demo URL
        address creator;
        uint256 reward;
        TaskStatus status;
        address winner;
        uint256 deadline;
        address[] participants;
        uint256 disputeDeadline; // 雇主确认后争议期截止时间
        bool locked; // 争议期过后锁定
        string taskType; // 任务类型
    }

    mapping(uint256 => Task) public tasks;
    mapping(uint256 => string) public TaskType; // 任务类型映射
    uint256 public taskCount;
    uint256 public constant DISPUTE_PERIOD = 1 days; // 争议期为1天

    address public biddingSystem;
    address public escrow;
    address public disputeDAO;
    mapping(uint256 => bool) public taskVerificationPending;

    // 平台费用相关状态变量
    address public platformAddress; // 平台收费地址
    uint256 public platformFeeRate; // 平台费率，以基点为单位 (例如：50 = 0.5%)
    uint256 public totalPlatformFees; // 累计平台费用
    
    // 事件
    event TaskCreated(uint256 indexed taskId, address indexed creator, uint256 reward, string ipfsHash);
    event TaskUpdated(uint256 indexed taskId, TaskStatus status, address winner);
    event TaskRemoved(uint256 indexed taskId);
    event PlatformFeeCollected(uint256 indexed taskId, uint256 feeAmount); // 平台费用收取事件
    event PlatformFeeRateUpdated(uint256 oldRate, uint256 newRate);
    event PlatformAddressUpdated(address oldAddress, address newAddress);
    event EmergencyWithdrawal(address to, uint256 amount);

    modifier onlyTaskCreator(uint256 _taskId) {
        require(tasks[_taskId].creator == msg.sender, "Only creator can operate");
        _;
    }

    modifier taskExists(uint256 _taskId) {
        require(tasks[_taskId].id == _taskId, "Task does not exist");
        _;
    }

    modifier onlyPlatform() {
        require(msg.sender == platformAddress, "Only platform can call this function");
        _;
    }

    constructor(address _biddingSystem, address _escrow, address _disputeDAO, address _platformAddress) {
        biddingSystem = _biddingSystem;
        escrow = _escrow;
        disputeDAO = _disputeDAO;
        platformAddress = _platformAddress;
        platformFeeRate = 50; // 默认0.5%平台费率 (50/10000 = 0.005 = 0.5%)
        taskCount = 0;

        // 初始化任务类型
        TaskType[1] = "web3";
        TaskType[2] = "UI/UX";
        TaskType[3] = "Market Promotion";
        TaskType[4] = "Content Production";
        TaskType[5] = "Data Analytics";
        TaskType[0] = "Other"; 
    }
    
    // 创建新任务，任务详细信息通过IPFS哈希存储
    function createTask(
        string memory _taskTitle,
        string memory _ipfsHash,
        uint256 _reward,
        uint256 _deadline, // 传入标准Unix时间戳（秒）
        uint256 _taskTypeNumber // 任务类型代码
    ) external payable {
        require(_reward > 0, "Reward must be greater than zero");
        require(bytes(_taskTitle).length > 0, "Task title cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(
                keccak256(abi.encodePacked(TaskType[_taskTypeNumber])) == keccak256(abi.encodePacked("Other")) ||
                keccak256(abi.encodePacked(TaskType[_taskTypeNumber])) == keccak256(abi.encodePacked("UI/UX")) ||
                keccak256(abi.encodePacked(TaskType[_taskTypeNumber])) == keccak256(abi.encodePacked("Data Analytics")) ||
                keccak256(abi.encodePacked(TaskType[_taskTypeNumber])) == keccak256(abi.encodePacked("Content Production")) ||
                keccak256(abi.encodePacked(TaskType[_taskTypeNumber])) == keccak256(abi.encodePacked("Market Promotion")) ||
                keccak256(abi.encodePacked(TaskType[_taskTypeNumber])) == keccak256(abi.encodePacked("web3")),
            "Invalid task type"
        );

        // 计算平台费用
        uint256 platformFee = (_reward * platformFeeRate) / 10000;
        uint256 totalRequired = _reward + platformFee;
        
        require(msg.value == totalRequired, "Must send reward + platform fee");

        uint256 taskId = taskCount++;

        tasks[taskId] = Task({
            id: taskId,
            title: _taskTitle,
            ipfsHash: _ipfsHash,
            completeUrl: "",
            firstDemoUrl: "", 
            creator: msg.sender,
            reward: _reward,
            status: TaskStatus.Created,
            winner: address(0),
            deadline: _deadline,
            participants: new address[](0), 
            disputeDeadline: 0,
            locked: false,
            taskType: TaskType[_taskTypeNumber]
        });

        // 将奖励金额存入托管合约
        (bool success, ) = escrow.call{value: _reward}(
            abi.encodeWithSignature("depositFunds(uint256)", taskId)
        );
        require(success, "Escrow deposit failed");

        // 收取平台费用
        if (platformFee > 0) {
            totalPlatformFees += platformFee;
            (bool feeSuccess, ) = payable(platformAddress).call{value: platformFee}("");
            require(feeSuccess, "Platform fee transfer failed");
            emit PlatformFeeCollected(taskId, platformFee);
        }

        emit TaskCreated(taskId, msg.sender, _reward, _ipfsHash);
    }
    

   // 开始竞标
    function startBidding(uint256 _taskId) external taskExists(_taskId) onlyTaskCreator(_taskId) {
        require(tasks[_taskId].status == TaskStatus.Created, "Task is not in Created status");
        tasks[_taskId].status = TaskStatus.Bidding;
        (bool success, ) = biddingSystem.call(
            abi.encodeWithSignature("openBidding(uint256)", _taskId)
        );
        require(success, "Bidding open failed");
        emit TaskUpdated(_taskId, TaskStatus.Bidding, address(0));
    }

    // 参与任务（参与者需提交任务demo（或任务计划书）供雇主参考）
    function participateInTask(uint256 _taskId, string memory _url) external taskExists(_taskId) {
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Bidding, "Task is not open for participation");
        for (uint i = 0; i < task.participants.length; i++) {
            require(task.participants[i] != msg.sender, "Already participated");
        }
        require(bytes(_url).length > 0, "Your URL cannot be empty");
        task.participants.push(msg.sender);
        task.firstDemoUrl = _url; // 存储第一次提交的demo URL
        
    }

    // 获取任务参与者列表
    function getTaskParticipants(uint256 _taskId) external view taskExists(_taskId) returns (address[] memory) {
        Task storage task = tasks[_taskId];
        return (task.participants);
    }

    // 选择中标者
    function selectWinner(uint256 _taskId, address _winner) external taskExists(_taskId) onlyTaskCreator(_taskId) {
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Bidding, "Task is not in Bidding status");
        bool found = false;
        for (uint i = 0; i < task.participants.length; i++) {
            if (task.participants[i] == _winner) {
                found = true;
                break;
            }
        }
        require(found, "Winner must be a participant");
        task.winner = _winner;
        task.status = TaskStatus.InProgress;
        emit TaskUpdated(_taskId, TaskStatus.InProgress, _winner);
    }

    // 申请任务完成验证（由中标者发起）
    function requestTaskVerification(uint256 _taskId, string memory _completeUrl) external taskExists(_taskId) {
        Task storage task = tasks[_taskId];
        require(msg.sender == task.winner, "Only winner can request verification");
        require(task.status == TaskStatus.InProgress, "Task is not in InProgress status");
        require(!taskVerificationPending[_taskId], "Verification already pending");
        require(bytes(_completeUrl).length > 0, "Completion URL cannot be empty");
        task.completeUrl = _completeUrl;
        // 设置任务状态为待雇主确认
        task.status = TaskStatus.PendingEmployerConfirm;
        // 标记任务验证为待处理
        taskVerificationPending[_taskId] = true;
    }
    // 雇主确认任务完成
    function employerConfirmTask(uint256 taskId, bool isConfirm) external taskExists(taskId) onlyTaskCreator(taskId) {
        Task storage task = tasks[taskId];
        require(taskVerificationPending[taskId], "Task verification not pending"); // 确认任务验证状态
        require(task.status == TaskStatus.PendingEmployerConfirm, "Task not pending employer confirm"); // 检查任务状态
        task.disputeDeadline = block.timestamp + DISPUTE_PERIOD; // 设置争议截止时间
        task.locked = false;
        if (isConfirm) {
            task.status = TaskStatus.Completed;
            (bool escSuccess,) = escrow.call(
                abi.encodeWithSignature("releaseFunds(uint256,address)", taskId, task.winner)
            );
            require(escSuccess, "Escrow release failed");
            emit TaskUpdated(taskId, TaskStatus.Completed, task.winner);
        } else {
            task.status = TaskStatus.PendingDisputePeriod;
            emit TaskUpdated(taskId, TaskStatus.PendingDisputePeriod, address(0));
        }
    }

    // 仲裁任务（允许winner在争议期内发起）
    function disputeTask(uint256 _taskId) external taskExists(_taskId) {
        Task storage task = tasks[_taskId];
        if ((task.status == TaskStatus.Completed || task.status == TaskStatus.PendingDisputePeriod) && !task.locked) {
            require(msg.sender == task.winner, "Only winner can dispute after employer confirm/deny");
            require(block.timestamp <= task.disputeDeadline, "Dispute period expired");
            task.status = TaskStatus.Disputed;
            (bool success, ) = disputeDAO.call(
                abi.encodeWithSignature("handleDispute(uint256)", _taskId)
            );
            require(success, "Dispute handling failed");
            emit TaskUpdated(_taskId, TaskStatus.Disputed, address(0));
        } else if ((msg.sender == task.winner || msg.sender == task.creator) && task.status == TaskStatus.InProgress) {
            task.status = TaskStatus.Disputed;
            (bool success, ) = disputeDAO.call(
                abi.encodeWithSignature("handleDispute(uint256)", _taskId)
            );
            require(success, "Dispute handling failed");
            emit TaskUpdated(_taskId, TaskStatus.Disputed, address(0));
        } else {
            revert("No right or wrong status to dispute");
        }
    }

    // 争议期过后结算任务，任何人可调用
    function settleTask(uint256 _taskId) external taskExists(_taskId) {
        Task storage task = tasks[_taskId];
        require(!task.locked, "Task already locked");
        require(
            (task.status == TaskStatus.Completed || task.status == TaskStatus.PendingDisputePeriod) &&
            block.timestamp > task.disputeDeadline,
            "Not eligible to settle"
        );
        if (task.status == TaskStatus.Completed) {
            // 已释放，无需处理
            task.locked = true;
        } else if (task.status == TaskStatus.PendingDisputePeriod) {
            // 雇主否认且未仲裁，资金退回雇主
            (bool refundSuccess, ) = escrow.call(
                abi.encodeWithSignature("refundFunds(uint256,address)", _taskId, task.creator)
            );
            require(refundSuccess, "Escrow refund failed");
            task.locked = true;
            emit TaskUpdated(_taskId, TaskStatus.PendingDisputePeriod, address(0));
        }
    }

    // 取消任务
    function cancelTask(uint256 _taskId) external taskExists(_taskId) onlyTaskCreator(_taskId) {
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Created || task.status == TaskStatus.Bidding, "Task cannot be cancelled");
        (bool success, ) = escrow.call(
            abi.encodeWithSignature("refundFunds(uint256,address)", _taskId, task.creator)
        );
        require(success, "Escrow refund failed");
        delete tasks[_taskId];
        emit TaskRemoved(_taskId);
    }

    // 移除过期任务
    function removeExpiredTask(uint256 _taskId) external taskExists(_taskId) {
        Task storage task = tasks[_taskId];
        require(task.winner == address(0), "Task already has a winner");
        require(task.status == TaskStatus.Created || task.status == TaskStatus.Bidding, "Task cannot be removed");
        require(block.timestamp > task.deadline, "Task not expired");
        (bool success, ) = escrow.call(
            abi.encodeWithSignature("refundFunds(uint256,address)", _taskId, task.creator)
        );
        require(success, "Escrow refund failed");
        delete tasks[_taskId];
        emit TaskRemoved(_taskId);
    }

    // 获取所有任务信息
    function getAllTasks() external view returns (Task[] memory) {
        Task[] memory allTasks = new Task[](taskCount);
        for (uint256 i = 0; i < taskCount; i++) {
            allTasks[i] = tasks[i];
        }
        return allTasks;
    }
    // 通过ID获取任务信息
    function getTaskById(uint256 _taskId) external view taskExists(_taskId) returns (Task memory) {
        return tasks[_taskId];
    }

    // 通过创建者地址获取任务信息
    function getTaskByOwner(address _owner) external view returns (Task[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < taskCount; i++) {
            if (tasks[i].creator == _owner) {
                count++;
            }
        }
        Task[] memory ownerTasks = new Task[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < taskCount; i++) {
            if (tasks[i].creator == _owner) {
                ownerTasks[index++] = tasks[i];
            }
        }
        return ownerTasks;
    }

    // 由DisputeDAO仲裁结果回调，处理任务最终归属
    function resolveDispute(uint256 _taskId, address _winner) external {
        require(msg.sender == disputeDAO, "Only DisputeDAO can resolve");
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Disputed, "Task is not in Disputed status");
        require(!task.locked, "Task already locked");
        // 记录仲裁结果
        task.winner = _winner;
        task.locked = true;
        if (_winner != address(0)) {
            // 仲裁胜者获得奖励
            (bool escSuccess,) = escrow.call(
                abi.encodeWithSignature("releaseFunds(uint256,address)", _taskId, _winner)
            );
            require(escSuccess, "Escrow release failed");
            task.status = TaskStatus.Completed;
        } else {
            // 无胜者，资金退回雇主
            (bool refundSuccess, ) = escrow.call(
                abi.encodeWithSignature("refundFunds(uint256,address)", _taskId, task.creator)
            );
            require(refundSuccess, "Escrow refund failed");
            task.status = TaskStatus.PendingDisputePeriod;
        }
        emit TaskUpdated(_taskId, task.status, _winner);
    }

    // 由DisputeDAO仲裁恶意任务，奖金归平台池并奖励仲裁员
    function resolveMaliciousTask(uint256 _taskId, address[] calldata jurors, uint256 jurorReward) external {
        require(msg.sender == disputeDAO, "Only DisputeDAO can resolve malicious");
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Disputed, "Task is not in Disputed status");
        require(!task.locked, "Task already locked");
        task.locked = true;
        uint256 totalReward = task.reward;
        uint256 totalJurorReward = jurorReward * jurors.length;
        require(totalJurorReward <= totalReward, "Juror reward exceeds total");
        // 1. 分发仲裁员奖励
        for (uint i = 0; i < jurors.length; i++) {
            (bool sent, ) = escrow.call(
                abi.encodeWithSignature("rewardJuror(uint256,address,uint256)", _taskId, jurors[i], jurorReward)
            );
            require(sent, "Juror reward failed");
        }
        // 2. 剩余资金转入平台池
        uint256 poolAmount = totalReward - totalJurorReward;
        (bool poolSuccess, ) = escrow.call(
            abi.encodeWithSignature("addToPool(uint256,uint256)", _taskId, poolAmount)
        );
        require(poolSuccess, "Add to pool failed");
        // 3. 记录状态
        task.status = TaskStatus.Disputed;
        emit TaskUpdated(_taskId, TaskStatus.Disputed, address(0));
    }

    // =============== 平台费用管理函数 ===============

    // 设置平台费率（只有平台可以调用）
    function setPlatformFeeRate(uint256 _newRate) external onlyPlatform {
        require(_newRate <= 1000, "Fee rate cannot exceed 10%"); // 最高10%
        uint256 oldRate = platformFeeRate;
        platformFeeRate = _newRate;
        emit PlatformFeeRateUpdated(oldRate, _newRate);
    }

    // 更改平台地址（只有当前平台地址可以调用）
    function setPlatformAddress(address _newPlatformAddress) external onlyPlatform {
        require(_newPlatformAddress != address(0), "Platform address cannot be zero");
        address oldAddress = platformAddress;
        platformAddress = _newPlatformAddress;
        emit PlatformAddressUpdated(oldAddress, _newPlatformAddress);
    }

    // 计算指定奖励金额的平台费用
    function calculatePlatformFee(uint256 _reward) external view returns (uint256) {
        return (_reward * platformFeeRate) / 10000;
    }

    // 计算创建任务所需的总金额（奖励 + 平台费用）
    function calculateTotalAmount(uint256 _reward) external view returns (uint256, uint256, uint256) {
        uint256 platformFee = (_reward * platformFeeRate) / 10000;
        uint256 totalAmount = _reward + platformFee;
        return (totalAmount, _reward, platformFee);
    }

    // 获取平台费用统计信息
    function getPlatformFeeInfo() external view returns (
        address platformAddr,
        uint256 feeRate,
        uint256 totalFees
    ) {
        return (platformAddress, platformFeeRate, totalPlatformFees);
    }

    // 紧急提取平台费用（只有平台可以调用，用于紧急情况）
    function emergencyWithdrawPlatformFees() external onlyPlatform {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(platformAddress).call{value: balance}("");
        require(success, "Emergency withdrawal failed");
        
        emit EmergencyWithdrawal(platformAddress, balance);
    }
}