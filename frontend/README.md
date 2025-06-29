# Dandelion - 去中心化任务悬赏平台

基于Avalanche Fuji测试网的Web3任务悬赏平台。

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 配置MetaMask
1. 安装MetaMask浏览器扩展
2. 添加Avalanche Fuji测试网络：
   - 网络名称: Avalanche Fuji
   - RPC URL: https://api.avax-test.network/ext/bc/C/rpc
   - 链ID: 43113
   - 货币符号: AVAX
   - 区块浏览器: https://testnet.snowtrace.io/

## 🔧 问题修复

### 已修复的问题

#### 1. Vue警告：mobileMenuOpen未定义
**问题**: `Property "mobileMenuOpen" was accessed during render but is not defined`
**解决**: 在`App.vue`的script setup中添加了`mobileMenuOpen`响应式变量

#### 2. Web3网络代理错误
**问题**: `TypeError: 'get' on proxy: property '_network' is a read-only and non-configurable data property`
**解决**: 
- 改进了provider初始化方式
- 添加了延迟初始化机制
- 手动设置网络配置，避免自动检测导致的代理问题
- 添加了重新连接Provider的功能

### 使用建议

#### 连接钱包
1. 确保MetaMask已安装并配置Avalanche Fuji网络
2. 点击"连接钱包"按钮
3. 如果出现Provider异常，点击"重新连接Provider"按钮

#### 发布任务
1. 连接钱包并确保网络正确
2. 访问`/create-task`页面
3. 填写任务信息
4. 确认交易（需要支付AVAX作为奖励和gas费用）

#### 测试合约功能
1. 访问`/test-contract`页面
2. 连接钱包
3. 测试读取合约数据功能
4. 创建测试任务验证合约交互

## 📋 合约地址

- TaskFactory: `0xFD333504a7850457f625516FD028E1747fEa5C6F`
- BiddingSystem: `0xb5AE1693d73de6cA78c6E5e767BDfE510B703Dd5`
- Escrow: `0xf3007729f70233d29f8c5Cb38975a6c329945211`
- DisputeDAO: `0x719Be548a3499A9eB719C84F8720123f819bA43F`

## 🛠️ 技术栈

- **前端**: Vue 3 + Vite + TailwindCSS
- **区块链**: Ethers.js v5 + Avalanche Fuji
- **存储**: IPFS (Pinata)
- **状态管理**: Pinia

## 📖 常见问题

### Q: 钱包连接后显示Provider异常怎么办？
A: 点击"重新连接Provider"按钮，或刷新页面重新连接钱包。

### Q: 交易失败怎么办？
A: 
1. 检查AVAX余额是否充足
2. 确认网络是否为Avalanche Fuji
3. 检查MetaMask是否有待处理的交易

### Q: 如何获取测试AVAX？
A: 访问 [Avalanche测试网水龙头](https://faucet.avax.network/) 获取免费测试AVAX

## 🔍 调试工具

访问`/test-contract`页面可以：
- 检查钱包连接状态
- 测试合约读取功能
- 创建测试任务
- 查看交易历史

## 📞 支持

如果遇到问题，请检查：
1. 浏览器控制台错误信息
2. MetaMask连接状态
3. 网络配置是否正确
4. 合约地址是否最新
