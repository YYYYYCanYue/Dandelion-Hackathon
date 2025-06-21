// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DisputeDAO {
    struct Juror {
        address addr;
        uint256 stakeAmount; // 质押金额
        bool isActive;
        uint256 lastDisputeId; // 记录最近参与仲裁编号
    }

    mapping(address => Juror) public jurors;
    address[] public jurorList; // 存储所有仲裁员地址
    // 最低质押金额
    uint256 public minStake = 0.1;
    // 每次仲裁需要的仲裁员数量
    uint256 public jurorsPerDispute = 3;
    address public taskFactory;
    bool public factorySet = false;
    uint256 public jurorCooldown = 3; // 仲裁员冷却轮数

    // 记录每次仲裁的仲裁员
    mapping(uint256 => address[]) public disputeJurors;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => address)) public votes; // disputeId => juror => winner
    mapping(uint256 => uint256) public voteCount;
    // 记录每个候选人获得的票数
    mapping(uint256 => mapping(address => uint256)) public candidateVotes;

    event JurorStaked(address indexed juror, uint256 amount); // 仲裁员质押事件
    event JurorUnstaked(address indexed juror, uint256 amount); // 仲裁员退出事件
    event DisputeStarted(uint256 indexed disputeId, address[] jurors); // 争议开始事件
    event Voted(uint256 indexed disputeId, address indexed juror, address winner); // 仲裁员投票事件
    event DisputeResolved(uint256 indexed disputeId, address winner); // 争议解决事件

    modifier onlyTaskFactory() {
        require(msg.sender == taskFactory, "Only TaskFactory");
       _;
    }

    constructor(address _taskFactory) {
        taskFactory = _taskFactory;
        if(_taskFactory != address(0)) factorySet = true;
    }

    function setFactory(address _factory) external {
        require(!factorySet, "Factory already set");
        require(_factory != address(0), "Invalid address");
        taskFactory = _factory;
        factorySet = true;
    }

    // 用户质押成为仲裁员
    function stake() external payable {
        require(msg.value >= minStake, "Insufficient stake");
        require(!jurors[msg.sender].isActive, "Already juror");
        jurors[msg.sender] = Juror({addr: msg.sender, stakeAmount: msg.value, isActive: true, lastDisputeId: 0});
        jurorList.push(msg.sender);
        emit JurorStaked(msg.sender, msg.value);
    }

    // 退出仲裁员，返还质押金
    function unstake() external {
        Juror storage juror = jurors[msg.sender];
        require(juror.isActive, "Not a juror");
        uint256 amount = juror.stakeAmount;
        juror.isActive = false;
        juror.stakeAmount = 0;
        payable(msg.sender).transfer(amount);
        emit JurorUnstaked(msg.sender, amount);
    }

    // TaskFactory 调用，发起争议，随机选取 jurorsPerDispute 个仲裁员，带轮换机制
    function handleDispute(uint256 disputeId) external onlyTaskFactory {
        require(disputeJurors[disputeId].length == 0, "Dispute already started");
        require(jurorList.length >= jurorsPerDispute, "Not enough jurors");
        address[] memory candidates = new address[](jurorList.length);
        uint256 candidateCount = 0;
        // 1. 筛选冷却期外的仲裁员
        for (uint256 jurorIndex = 0; jurorIndex < jurorList.length; jurorIndex++) {
            address jurorAddr = jurorList[jurorIndex];
            if (jurors[jurorAddr].isActive && disputeId > jurors[jurorAddr].lastDisputeId + jurorCooldown) {
                candidates[candidateCount++] = jurorAddr;
            }
        }
        // 2. 随机选取
        address[] memory selected = new address[](jurorsPerDispute);
        uint256 count = 0;
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, disputeId)));
        uint256 i = 0;
        while (count < jurorsPerDispute && i < candidateCount * 2) {
            address candidate = candidates[uint256(keccak256(abi.encodePacked(seed, i))) % candidateCount];
            bool alreadySelected = false;
            for (uint j = 0; j < count; j++) {
                if (selected[j] == candidate) {
                    alreadySelected = true;
                    break;
                }
            }
            if (!alreadySelected) {
                selected[count] = candidate;
                count++;
            }
            i++;
        }
        // 3. 若冷却期外仲裁员不足，从所有活跃仲裁员中补足
        if (count < jurorsPerDispute) {
            for (uint k = 0; k < jurorList.length && count < jurorsPerDispute; k++) {
                address jurorAddr = jurorList[k];
                if (jurors[jurorAddr].isActive) {
                    bool alreadySelected = false;
                    for (uint j = 0; j < count; j++) {
                        if (selected[j] == jurorAddr) {
                            alreadySelected = true;
                            break;
                        }
                    }
                    if (!alreadySelected) {
                        selected[count] = jurorAddr;
                        count++;
                    }
                }
            }
        }
        require(count == jurorsPerDispute, "Not enough unique jurors");
        disputeJurors[disputeId] = selected;
        // 4. 更新仲裁员最近参与记录
        for (uint j = 0; j < selected.length; j++) {
            jurors[selected[j]].lastDisputeId = disputeId;
        }
        emit DisputeStarted(disputeId, selected);
    }

    // 仲裁员投票，选出胜者
    function vote(uint256 disputeId, address winner) external {
        require(jurors[msg.sender].isActive, "Not a juror");
        // 必须是本次仲裁的仲裁员
        bool isJuror = false;
        for (uint i = 0; i < disputeJurors[disputeId].length; i++) {
            if (disputeJurors[disputeId][i] == msg.sender) {
                isJuror = true;
                break;
            }
        }
        require(isJuror, "Not selected juror");
        require(!hasVoted[disputeId][msg.sender], "Already voted");
        hasVoted[disputeId][msg.sender] = true;
        votes[disputeId][msg.sender] = winner;
        candidateVotes[disputeId][winner]++;
        voteCount[disputeId]++;
        emit Voted(disputeId, msg.sender, winner);
        // 达到票数，自动结算
        if (voteCount[disputeId] == jurorsPerDispute) {
            address finalWinner = winner;
            uint256 maxVotes = 0;
            for (uint i = 0; i < disputeJurors[disputeId].length; i++) {
                address candidate = votes[disputeId][disputeJurors[disputeId][i]];
                uint256 v = candidateVotes[disputeId][candidate];
                if (v > maxVotes) {
                    maxVotes = v;
                    finalWinner = candidate;
                }
            }
            // 通知TaskFactory
            (bool success, ) = taskFactory.call(
                abi.encodeWithSignature("resolveDispute(uint256,address)", disputeId, finalWinner)
            );
            require(success, "Resolve failed");
            emit DisputeResolved(disputeId, finalWinner);
        }
    }

    // 查询某次仲裁的仲裁员列表
    function getDisputeJurors(uint256 disputeId) external view returns (address[] memory) {
        return disputeJurors[disputeId];
    }

    // 查询仲裁员信息
    function getJurorInfo(address _jurorAddr) external view returns (uint256 stakeAmount, bool isActive, uint256 lastDisputeId) {
        Juror storage juror = jurors[_jurorAddr];
        return (juror.stakeAmount, juror.isActive, juror.lastDisputeId);
    }

    // 查询所有活跃仲裁员
    function getActiveJurors() external view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < jurorList.length; i++) {
            if (jurors[jurorList[i]].isActive) count++;
        }
        address[] memory actives = new address[](count);
        uint256 idx = 0;
        for (uint i = 0; i < jurorList.length; i++) {
            if (jurors[jurorList[i]].isActive) {
                actives[idx++] = jurorList[i];
            }
        }
        return actives;
    }
}