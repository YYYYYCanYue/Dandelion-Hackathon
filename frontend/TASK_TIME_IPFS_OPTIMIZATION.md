# 任务时间显示和IPFS哈希优化

## 优化概述

本次优化主要针对任务大厅的两个关键问题：
1. **屏蔽无效的IPFS哈希**：避免显示损坏或无效的IPFS数据
2. **优化截止时间展示**：根据任务当前状态显示对应的截止时间

## 优化内容

### 1. 智能时间显示系统

#### 1.1 状态相关的截止时间
根据任务状态显示相应的截止时间类型：

| 任务状态 | 显示文本 | 时间计算逻辑 |
|---------|---------|-------------|
| 0 - 已创建 | 任务截止 | 显示主截止时间 |
| 1 - 竞标中 | 竞标截止 | 竞标期结束时间 vs 主截止时间（取较早者） |
| 2 - 开发中 | 开发截止 | 显示主截止时间 |
| 3 - 待雇主确认 | 确认截止 | 显示主截止时间 |
| 4 - 已完成 | 已完成 | 不显示截止时间 |
| 5 - 争议中 | 争议截止 | 争议截止时间 |
| 6 - 争议期 | 争议期截止 | 争议期截止时间 |

#### 1.2 时间计算函数

**`getCurrentDeadline(task)`**
- 根据任务状态计算当前相关的截止时间
- 竞标阶段：计算竞标期结束时间
- 开发阶段：使用主截止时间
- 争议阶段：使用争议截止时间

**`getTimeStatus(task)`**
- 返回状态相关的时间描述文本
- 动态显示当前阶段的时间类型

**`getTimeRemaining(task)`**
- 基于当前截止时间计算剩余时间
- 智能显示格式：天+小时 / 小时 / 分钟
- 已完成任务显示"已完成"

#### 1.3 时间颜色编码
- 🔴 红色：已过期或24小时内
- 🟡 黄色：72小时内
- 🟢 绿色：充足时间或已完成
- ⚫ 灰色：无截止时间

### 2. IPFS哈希验证和屏蔽

#### 2.1 无效哈希检测
```javascript
const shouldShowIPFSInfo = (task) => {
  // 检查哈希是否存在且有效
  if (!task.ipfsHash || task.ipfsHash === '0' || task.ipfsHash === '') {
    return false
  }
  
  // 使用IPFS存储的验证函数
  if (ipfsStore.isValidIPFSHash && !ipfsStore.isValidIPFSHash(task.ipfsHash)) {
    return false
  }
  
  // 检查错误标记
  if (task.metadata && task.metadata.error === 'Invalid IPFS hash') {
    return false
  }
  
  return true
}
```

#### 2.2 数据来源标识
为任务卡片添加数据来源标识（仅在调试模式显示）：

| 数据来源 | 标识 | 颜色 | 说明 |
|---------|------|------|------|
| 基础信息 | 📄 | 灰色 | 仅链上数据，无IPFS |
| 完整信息 | ✅ | 绿色 | 链上+IPFS完整数据 |
| 链上数据 | ⛓️ | 蓝色 | 仅链上数据可用 |
| 数据受限 | ⚠️ | 红色 | IPFS哈希无效 |

#### 2.3 IPFS哈希验证规则
在 `frontend/src/stores/ipfs.js` 中的验证逻辑：

```javascript
isValidIPFSHash(hash) {
  if (!hash || typeof hash !== 'string') return false
  if (hash.length < 10) return false
  
  // 支持多种IPFS哈希格式
  const ipfsV0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/  // v0 CID
  const ipfsV1Regex = /^b[a-z2-7]{58,}$/              // v1 CID
  const base58Regex = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/
  
  return ipfsV0Regex.test(hash) || 
         ipfsV1Regex.test(hash) || 
         (base58Regex.test(hash) && hash.length >= 44)
}
```

## 修改的文件

### 1. frontend/src/views/Tasks.vue
- ✅ 重构时间显示逻辑
- ✅ 添加IPFS哈希验证
- ✅ 优化时间状态文本
- ✅ 添加数据来源标识（调试模式）

### 2. 新增功能函数
- `getCurrentDeadline(task)` - 获取当前状态对应的截止时间
- `getTimeStatus(task)` - 获取时间状态文本
- `getTimeRemaining(task)` - 获取剩余时间显示
- `getTimeClass(task)` - 获取时间颜色样式
- `shouldShowIPFSInfo(task)` - 检查是否显示IPFS信息
- `getTaskDataSource(task)` - 获取数据来源标识

## 用户体验改进

### 1. 时间信息更精确
- 竞标阶段显示竞标截止时间
- 开发阶段显示开发截止时间
- 争议阶段显示争议截止时间
- 已完成任务不显示混淆的时间信息

### 2. 数据质量透明化
- 自动屏蔽无效IPFS数据
- 在调试模式下显示数据来源
- 用户可以了解任务信息的完整性

### 3. 视觉优化
- 颜色编码快速识别时间紧急程度
- 状态相关的时间描述更清晰
- 减少无效信息的干扰

## 调试功能

在URL中添加 `?debug=1` 参数可以查看：
- 任务数据来源标识
- IPFS哈希有效性状态
- 数据完整性警告

示例：`http://localhost:3000/tasks?debug=1`

## 向后兼容性

- 保持所有现有API接口不变
- 旧版本IPFS数据仍可正常显示
- 渐进式增强，不影响现有功能

## 技术细节

### 时间计算逻辑
```javascript
// 竞标阶段时间计算
if (task.createdAt && task.biddingPeriod) {
  const createdTime = new Date(task.createdAt)
  const biddingEndTime = new Date(createdTime.getTime() + (task.biddingPeriod * 60 * 60 * 1000))
  return biddingEndTime < mainDeadline ? biddingEndTime : mainDeadline
}
```

### IPFS数据处理
- 数据存储层已处理无效哈希的回退逻辑
- 前端显示层进一步过滤和优化
- 缓存有效性检查结果

## 预期效果

1. **时间信息更准确**：用户能清楚了解当前阶段的关键时间点
2. **数据质量更高**：屏蔽无效IPFS数据，避免显示错误信息
3. **用户体验更好**：减少混淆，提高信息的可读性和实用性
4. **调试更方便**：开发者可以快速识别数据问题

## 测试建议

1. 测试不同状态任务的时间显示
2. 验证无效IPFS哈希的屏蔽效果
3. 检查调试模式的信息显示
4. 确认时间颜色编码的准确性
5. 测试已完成任务的显示效果 