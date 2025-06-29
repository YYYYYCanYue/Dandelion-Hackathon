# 智能合约调用指南

## 🎯 概述

项目已配置完整的智能合约调用功能，支持任务创建、竞价系统、资金托管和争议解决等所有功能。

## 📁 文件结构

```
frontend/src/
├── stores/web3.js              # Web3状态管理
├── utils/
│   ├── contracts.js            # 合约配置文件
│   ├── contractService.js      # 合约服务类
│   └── configTest.js          # 配置测试工具
└── test-contracts.js          # 测试脚本
```

## 🚀 快速开始

### 1. 运行配置测试
```bash
cd frontend
node src/test-contracts.js
```

### 2. 在Vue组件中使用

```vue
<template>
  <div>
    <button @click="connectWallet" :disabled="loading">
      {{ isConnected ? '已连接' : '连接钱包' }}
    </button>
    <button @click="createTask" v-if="isConnected">创建任务</button>
  </div>
</template>

<script setup>
import { useWeb3Store } from '@/stores/web3'

const web3Store = useWeb3Store()
const { isConnected, loading } = storeToRefs(web3Store)

const connectWallet = async () => {
  try {
    await web3Store.connectWallet()
    console.log('钱包连接成功!')
  } catch (error) {
    console.error('连接失败:', error)
  }
}

const createTask = async () => {
  try {
    await web3Store.createTask(
      '我的任务',
      'QmXXX...', // IPFS哈希
      '10',       // 10 AVAX奖励
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后截止
      1           // 任务类型
    )
    console.log('任务创建成功!')
  } catch (error) {
    console.error('创建任务失败:', error)
  }
}
</script>
```

## 🔧 主要功能

### Web3 Store 方法

| 方法 | 描述 | 参数 |
|------|------|------|
| `connectWallet()` | 连接MetaMask钱包 | 无 |
| `disconnectWallet()` | 断开钱包连接 | 无 |
| `switchToAvalanche()` | 切换到Avalanche网络 | 无 |
| `createTask()` | 创建新任务 | title, ipfsHash, reward, deadline, taskType |
| `participateInTask()` | 参与任务 | taskId, demoUrl, depositAmount |
| `selectWinner()` | 选择获胜者 | taskId, winnerAddress |
| `confirmTask()` | 确认任务完成 | taskId, approved |
| `createDispute()` | 创建争议 | taskId, description |
| `vote()` | 投票 | disputeId, decision, reason |
| `becomeArbitrator()` | 成为仲裁员 | stakeAmount |

### 合约服务类方法

#### TaskFactory合约
- `createTask()` - 创建任务
- `getAllTasks()` - 获取所有任务
- `getTaskById()` - 根据ID获取任务
- `participateInTask()` - 参与任务
- `selectWinner()` - 选择获胜者
- `employerConfirmTask()` - 雇主确认任务
- `cancelTask()` - 取消任务
- `disputeTask()` - 争议任务

#### BiddingSystem合约
- `openBidding()` - 开放竞价
- `placeBid()` - 投标
- `qualifyBidder()` - 资格认证投标者
- `selectWinnerBidding()` - 选择获胜者
- `getTaskBids()` - 获取任务投标信息

#### Escrow合约
- `depositFunds()` - 存入资金
- `releaseFunds()` - 释放资金
- `refundFunds()` - 退还资金
- `getTaskFunds()` - 获取任务资金信息

#### DisputeDAO合约
- `stake()` - 质押成为陪审员
- `unstake()` - 取消质押
- `vote()` - 投票
- `handleDispute()` - 处理争议
- `getActiveJurors()` - 获取活跃陪审员

## 🛠 配置

### 合约地址配置 (contracts.js)
```javascript
export const CONTRACT_ADDRESSES = {
  TASK_FACTORY: '0xEeE38935cfc450Fe1e5dfF85205212fe7AB711eE',
  BIDDING_SYSTEM: '0x1918929E38AF78115D0e751190d6493F64241878',
  ESCROW: '0x737C76EE516b2597511Bf2364681859fD321a2cb',
  DISPUTE_DAO: '0x015dbce5389dd0CD60e0d6F459e89761Fb2465B5'
}
```

### 网络配置
- 链ID: 43113 (Avalanche Fuji测试网)
- RPC: https://api.avax-test.network/ext/bc/C/rpc
- 浏览器: https://testnet.snowtrace.io/

## 🧪 测试

### 运行完整测试
```bash
node src/test-contracts.js
```

### 验证配置
```javascript
import { validateContractConfig } from '@/utils/contracts'

const validation = validateContractConfig()
if (validation.valid) {
  console.log('配置有效')
} else {
  console.log('配置错误:', validation.errors)
}
```

## ⚠️ 注意事项

1. **网络切换**: 确保MetaMask连接到Avalanche Fuji测试网
2. **测试代币**: 需要AVAX测试代币来支付gas费用
3. **地址更新**: 如果重新部署合约，需要更新CONTRACT_ADDRESSES
4. **错误处理**: 所有方法都包含错误处理，请查看控制台输出
5. **交易确认**: 等待交易确认后再进行下一步操作

## 🔍 故障排除

### 常见问题

**1. 连接失败**
- 检查MetaMask是否安装
- 确认网络设置正确
- 清除浏览器缓存

**2. 交易失败**
- 检查AVAX余额是否足够
- 确认gas价格设置合理
- 验证合约地址是否正确

**3. 合约调用失败**
- 运行配置测试检查ABI和地址
- 确认合约在目标网络上已部署
- 检查方法参数是否正确

### 调试命令
```bash
# 运行配置测试
node src/test-contracts.js

# 检查网络连接
npm run dev

# 查看详细错误
console.log(error.message, error.code)
```

## 📚 更多资源

- [Avalanche文档](https://docs.avax.network/)
- [ethers.js文档](https://docs.ethers.io/v5/)
- [MetaMask文档](https://docs.metamask.io/) 