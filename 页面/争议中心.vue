<template>
  <!-- 争议中心头部 -->
  <header class="arbitration-header">
    <div class="container">
      <div class="header-content">
        <h1 class="arbitration-title">争议处理中心</h1>
        <p class="arbitration-subtitle">基于DAO治理的透明仲裁系统，保障平台公平公正</p>
        
        <div class="arbitration-stats">
          <div class="stat-item">
            <div class="stat-value">8</div>
            <div class="stat-label">待处理争议</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">12</div>
            <div class="stat-label">进行中仲裁</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">142</div>
            <div class="stat-label">已解决争议</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">96.3%</div>
            <div class="stat-label">解决满意度</div>
          </div>
        </div>
      </div>
    </div>
  </header>
  
  <!-- 仲裁面板 -->
  <div class="container">
    <div class="arbitration-panel">
      <!-- 左侧仲裁员信息 -->
      <div class="arbitration-sidebar">
        <div class="arbitrator-info">
          <div class="arbitrator-avatar">
            {{ userInitials }}
          </div>
          <h3 class="arbitrator-name">{{ userName }}</h3>
          <div class="credit-score">
            <i class="fas fa-star"></i> 仲裁员评分: 9.2/10
          </div>
          
          <div class="arbitrator-stats">
            <div class="arbitrator-stat-item">
              <div class="arbitrator-stat-value">{{ arbitrationCount }}</div>
              <div class="arbitrator-stat-label">仲裁次数</div>
            </div>
            <div class="arbitrator-stat-item">
              <div class="arbitrator-stat-value">{{ accuracy }}%</div>
              <div class="arbitrator-stat-label">准确率</div>
            </div>
            <div class="arbitrator-stat-item">
              <div class="arbitrator-stat-value">{{ rewards }} ETH</div>
              <div class="arbitrator-stat-label">奖励</div>
            </div>
          </div>
        </div>
        
        <ul class="arbitration-menu">
          <li><a href="#" class="active"><i class="fas fa-inbox"></i> 待处理争议</a></li>
          <li><a href="#"><i class="fas fa-gavel"></i> 进行中仲裁</a></li>
          <li><a href="#"><i class="fas fa-check-circle"></i> 已解决争议</a></li>
          <li><a href="#"><i class="fas fa-coins"></i> 仲裁奖励</a></li>
          <li><a href="#"><i class="fas fa-chart-line"></i> 我的表现</a></li>
          <li><a href="#"><i class="fas fa-book"></i> 仲裁指南</a></li>
        </ul>
        
        <div class="arbitration-info">
          <h4><i class="fas fa-info-circle"></i> 当前仲裁轮次</h4>
          <p>轮次: #ARB-2023-Q4</p>
          <p>开始时间: 2023-10-01</p>
          <p>结束时间: 2023-12-31</p>
          <p>仲裁员人数: 127</p>
        </div>
      </div>
      
      <!-- 右侧内容区域 -->
      <div class="arbitration-content">
        <div class="content-header">
          <h2 class="content-title">待处理争议</h2>
          <div class="filters-row">
            <div class="filter-group">
              <span class="filter-label">排序:</span>
              <select class="filter-select" v-model="sortOption">
                <option value="newest">最新优先</option>
                <option value="reward">赏金最高</option>
                <option value="deadline">截止最近</option>
              </select>
            </div>
            
            <div class="filter-group">
              <span class="filter-label">任务类别:</span>
              <select class="filter-select" v-model="categoryFilter">
                <option value="all">全部类别</option>
                <option value="web3">Web3开发</option>
                <option value="design">UI/UX设计</option>
                <option value="marketing">市场推广</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- 争议列表 -->
        <div class="dispute-list">
          <div class="dispute-header">
            <div>争议ID</div>
            <div>任务名称</div>
            <div>任务类别</div>
            <div>状态</div>
            <div>操作</div>
          </div>
          
          <div class="dispute-item" v-for="dispute in filteredDisputes" :key="dispute.id">
            <div class="dispute-id">#{{ dispute.id }}</div>
            <div class="dispute-task">{{ dispute.task }}</div>
            <div>{{ dispute.category }}</div>
            <div class="dispute-status" :class="'status-' + dispute.status">{{ dispute.statusText }}</div>
            <div class="dispute-actions">
              <button class="btn btn-sm" :class="dispute.status === 'pending' ? 'btn-outline' : 'btn-primary'" @click="selectDispute(dispute)">
                {{ dispute.status === 'pending' ? '查看详情' : '参与仲裁' }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 争议详情 -->
        <div v-if="selectedDispute" class="dispute-detail">
          <div class="detail-header">
            <div>
              <h3 class="detail-title">{{ selectedDispute.task }}</h3>
              <p class="detail-subtitle">争议ID: #{{ selectedDispute.id }} | 任务赏金: {{ selectedDispute.reward }} ETH</p>
            </div>
            <div class="dispute-status" :class="'status-' + selectedDispute.status">{{ selectedDispute.statusText }}</div>
          </div>
          
          <div class="detail-grid">
            <div class="detail-section">
              <h4 class="section-title"><i class="fas fa-user-tie"></i> 雇主主张</h4>
              <p class="claim-content">{{ selectedDispute.employerClaim }}</p>
              
              <h5 class="section-title"><i class="fas fa-paperclip"></i> 雇主证据</h5>
              <div class="evidence-list">
                <div class="evidence-item" v-for="(evidence, index) in selectedDispute.employerEvidence" :key="index">
                  <i class="fas fa-file evidence-icon"></i>
                  <div class="evidence-name">{{ evidence.name }}</div>
                  <a :href="evidence.link" class="evidence-link" target="_blank">查看</a>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4 class="section-title"><i class="fas fa-code"></i> 执行者主张</h4>
              <p class="claim-content">{{ selectedDispute.executorClaim }}</p>
              
              <h5 class="section-title"><i class="fas fa-paperclip"></i> 执行者证据</h5>
              <div class="evidence-list">
                <div class="evidence-item" v-for="(evidence, index) in selectedDispute.executorEvidence" :key="index">
                  <i class="fas fa-file evidence-icon"></i>
                  <div class="evidence-name">{{ evidence.name }}</div>
                  <a :href="evidence.link" class="evidence-link" target="_blank">查看</a>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 链上数据 -->
          <div class="detail-section">
            <h4 class="section-title"><i class="fas fa-link"></i> 链上任务数据</h4>
            <div class="chain-data">
              <div class="data-item">
                <i class="fas fa-wallet"></i> 雇主地址: {{ selectedDispute.employerAddress }}
              </div>
              <div class="data-item">
                <i class="fas fa-wallet"></i> 执行者地址: {{ selectedDispute.executorAddress }}
              </div>
              <div class="data-item">
                <i class="fas fa-hashtag"></i> 任务合约: {{ selectedDispute.taskContract }}
              </div>
              <div class="data-item">
                <i class="fab fa-github"></i> GitHub提交: {{ selectedDispute.githubCommit }}
              </div>
              <div class="data-item">
                <i class="fas fa-database"></i> IPFS证据哈希: {{ selectedDispute.ipfsHash }}
              </div>
            </div>
          </div>
          
          <!-- 仲裁投票 -->
          <div v-if="selectedDispute.status === 'review'" class="voting-section">
            <h4 class="voting-title">请选择您的仲裁决定</h4>
            
            <div class="voting-options">
              <div class="voting-option employer" :class="{ selected: selectedOption === 'employer' }" @click="selectOption('employer')">
                <div class="voting-icon">
                  <i class="fas fa-user-tie"></i>
                </div>
                <div class="voting-label">支持雇主</div>
                <div class="voting-description">任务未完成或不符合要求</div>
              </div>
              
              <div class="voting-option" :class="{ selected: selectedOption === 'split' }" @click="selectOption('split')">
                <div class="voting-icon">
                  <i class="fas fa-balance-scale"></i>
                </div>
                <div class="voting-label">部分支付</div>
                <div class="voting-description">任务部分完成，按比例支付</div>
              </div>
              
              <div class="voting-option executor" :class="{ selected: selectedOption === 'executor' }" @click="selectOption('executor')">
                <div class="voting-icon">
                  <i class="fas fa-code"></i>
                </div>
                <div class="voting-label">支持执行者</div>
                <div class="voting-description">任务已完成并符合要求</div>
              </div>
            </div>
            
            <div class="voting-actions">
              <button class="btn btn-outline btn-lg" @click="cancelVote">
                <i class="fas fa-times"></i> 取消
              </button>
              <button class="btn btn-primary btn-lg" :disabled="!selectedOption" @click="submitVote">
                <i class="fas fa-vote-yea"></i> 提交仲裁决定
              </button>
            </div>
          </div>
          
          <!-- 仲裁进度 -->
          <div v-if="selectedDispute.status === 'review'" class="arbitration-progress">
            <h4 class="progress-title">仲裁进度</h4>
            
            <div class="progress-steps">
              <div class="progress-bar" :style="{ width: progressWidth }"></div>
              
              <div class="progress-step">
                <div class="step-icon" :class="{ active: currentStep >= 1 }">
                  <i class="fas fa-gavel"></i>
                </div>
                <div class="step-label">提交仲裁</div>
                <div class="step-status">已完成</div>
              </div>
              
              <div class="progress-step">
                <div class="step-icon" :class="{ active: currentStep >= 2 }">
                  <i class="fas fa-users"></i>
                </div>
                <div class="step-label">选取仲裁员</div>
                <div class="step-status">{{ selectedDispute.arbitratorsSelected }}/{{ selectedDispute.arbitratorsTotal }} 已选</div>
              </div>
              
              <div class="progress-step">
                <div class="step-icon" :class="{ active: currentStep >= 3 }">
                  <i class="fas fa-vote-yea"></i>
                </div>
                <div class="step-label">投票阶段</div>
                <div class="step-status">{{ selectedDispute.votesCount }}/{{ selectedDispute.arbitratorsTotal }} 已投票</div>
              </div>
              
              <div class="progress-step">
                <div class="step-icon" :class="{ active: currentStep >= 4 }">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="step-label">执行结果</div>
                <div class="step-status">待处理</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 用户数据
const userName = ref('张 仲裁员')
const userInitials = computed(() => {
  const names = userName.value.split(' ')
  if (names.length >= 2) {
    return names[0].charAt(0) + names[1].charAt(0)
  }
  return userName.value.charAt(0)
})
const arbitrationCount = ref(24)
const accuracy = ref(92)
const rewards = ref(3.8)

// 争议数据
const disputes = ref([
  {
    id: 'DIS-20231001',
    task: 'DEX交易平台前端开发',
    category: 'Web3开发',
    status: 'pending',
    statusText: '待处理',
    reward: '1.5',
    employerClaim: '执行者提交的前端代码存在严重安全漏洞，且未按需求实现钱包集成功能。提交的代码未经充分测试，无法正常运行。',
    executorClaim: '已完成所有需求功能，钱包集成完整，测试覆盖率达到85%。雇主在验收阶段提出新需求，超出原任务范围。',
    employerEvidence: [
      { name: '安全审计报告.pdf', link: '#' },
      { name: '测试失败记录.txt', link: '#' }
    ],
    executorEvidence: [
      { name: '完整前端代码.zip', link: '#' },
      { name: '测试覆盖率报告.pdf', link: '#' }
    ],
    employerAddress: '0x5a3C...E2d7',
    executorAddress: '0x8b4F...G3h9',
    taskContract: '0x9c7A...F5k2',
    githubCommit: 'a1b2c3d4e5',
    ipfsHash: 'QmXyZ...AbC1',
    arbitratorsTotal: 5,
    arbitratorsSelected: 3,
    votesCount: 1
  },
  {
    id: 'DIS-20231002',
    task: 'NFT艺术画廊UI设计',
    category: 'UI/UX设计',
    status: 'review',
    statusText: '仲裁中',
    reward: '0.8',
    employerClaim: '设计稿与需求不符，未使用指定的品牌色彩，排版混乱且未提供响应式设计。',
    executorClaim: '设计完全按照需求文档制作，品牌色彩使用准确，提供了移动端和桌面端设计。',
    employerEvidence: [
      { name: '需求文档.pdf', link: '#' },
      { name: '设计对比图.png', link: '#' }
    ],
    executorEvidence: [
      { name: 'Figma设计稿链接', link: '#' },
      { name: '设计规范.pdf', link: '#' }
    ],
    employerAddress: '0x6b4D...F3e8',
    executorAddress: '0x9c5G...H4j0',
    taskContract: '0x8d6B...G7l3',
    githubCommit: '',
    ipfsHash: 'QmYxZ...BcD2',
    arbitratorsTotal: 5,
    arbitratorsSelected: 5,
    votesCount: 3
  },
  {
    id: 'DIS-20231003',
    task: 'DeFi协议安全审计',
    category: 'Web3开发',
    status: 'pending',
    statusText: '待处理',
    reward: '5.0',
    employerClaim: '审计报告未覆盖所有关键功能，遗漏了重要漏洞。执行者缺乏DeFi安全审计经验。',
    executorClaim: '审计覆盖所有核心合约，发现3个高危漏洞并提供修复方案。报告符合行业标准。',
    employerEvidence: [
      { name: '漏洞重现步骤.txt', link: '#' },
      { name: '第三方审计对比.pdf', link: '#' }
    ],
    executorEvidence: [
      { name: '完整审计报告.pdf', link: '#' },
      { name: '测试用例文档.docx', link: '#' }
    ],
    employerAddress: '0x7c5E...G4f9',
    executorAddress: '0xAd6H...I5k1',
    taskContract: '0x7e8C...H9m4',
    githubCommit: 'd4e5f6g7h8',
    ipfsHash: 'QmZxY...CdE3',
    arbitratorsTotal: 7,
    arbitratorsSelected: 2,
    votesCount: 0
  }
])

// 筛选选项
const sortOption = ref('newest')
const categoryFilter = ref('all')
const selectedDispute = ref(null)
const selectedOption = ref(null)
const currentStep = ref(2)

// 过滤后的争议列表
const filteredDisputes = computed(() => {
  return disputes.value.filter(dispute => {
    // 类别筛选
    if (categoryFilter.value !== 'all') {
      if (categoryFilter.value === 'web3' && dispute.category !== 'Web3开发') return false
      if (categoryFilter.value === 'design' && dispute.category !== 'UI/UX设计') return false
      if (categoryFilter.value === 'marketing' && dispute.category !== '市场推广') return false
    }
    return true
  })
})

// 仲裁进度条宽度
const progressWidth = computed(() => {
  return (currentStep.value / 4 * 100) + '%'
})

// 选择争议
const selectDispute = (dispute) => {
  selectedDispute.value = dispute
  selectedOption.value = null
  
  if (dispute.status === 'review') {
    currentStep.value = 3
  } else {
    currentStep.value = 2
  }
}

// 选择投票选项
const selectOption = (option) => {
  selectedOption.value = option
}

// 提交投票
const submitVote = () => {
  if (!selectedOption.value) return
  
  // TODO: 与智能合约交互
  // 1. 验证用户身份和仲裁资格
  // 2. 提交投票到链上
  // 3. 更新争议状态
  
  alert(`仲裁决定已提交：${getOptionText(selectedOption.value)}`)
  
  // 更新状态
  selectedDispute.value.votesCount += 1
  
  // 如果是最后一个仲裁员
  if (selectedDispute.value.votesCount === selectedDispute.value.arbitratorsTotal) {
    selectedDispute.value.status = 'resolved'
    selectedDispute.value.statusText = '已解决'
    currentStep.value = 4
  }
}

// 取消投票
const cancelVote = () => {
  selectedOption.value = null
}

// 获取选项文本
const getOptionText = (option) => {
  switch(option) {
    case 'employer': return '支持雇主'
    case 'executor': return '支持执行者'
    case 'split': return '部分支付'
    default: return ''
  }
}

</script>

<style scoped>
/* 仲裁中心头部 */
.arbitration-header {
  background: var(--purple-gradient);
  color: white;
  padding: 80px 0 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 40px;
}

.arbitration-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.2;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.arbitration-title {
  font-size: 2.8rem;
  margin-bottom: 20px;
  font-weight: 800;
}

.arbitration-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 30px;
}

.arbitration-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
}

/* 仲裁面板 */
.arbitration-panel {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  margin-bottom: 60px;
}

.arbitration-sidebar {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 30px;
  height: fit-content;
}

.arbitration-content {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 30px;
}

/* 仲裁员信息 */
.arbitrator-info {
  text-align: center;
  padding-bottom: 25px;
  margin-bottom: 25px;
  border-bottom: 1px solid var(--border);
}

.arbitrator-avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background: var(--teal-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 auto 20px;
}

.arbitrator-name {
  font-size: 1.3rem;
  margin-bottom: 5px;
}

.arbitrator-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.arbitrator-stat-item {
  text-align: center;
}

.arbitrator-stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary);
}

.arbitrator-stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.credit-score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
  padding: 8px 15px;
  border-radius: var(--radius-full);
  font-weight: 600;
  margin: 20px 0;
}

/* 仲裁导航 */
.arbitration-menu {
  list-style: none;
  margin-bottom: 30px;
}

.arbitration-menu li {
  margin-bottom: 8px;
}

.arbitration-menu a {
  display: block;
  padding: 12px 15px;
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 10px;
}

.arbitration-menu a:hover, .arbitration-menu a.active {
  background-color: rgba(108, 99, 255, 0.1);
  color: var(--primary);
}

/* 内容区域 */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.content-title {
  font-size: 1.8rem;
}

.filters-row {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.filter-select {
  padding: 8px 15px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background-color: var(--card-bg);
  font-size: 0.9rem;
  min-width: 150px;
}

/* 争议列表 */
.dispute-list {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.dispute-header {
  padding: 20px;
  border-bottom: 1px solid var(--border);
  display: grid;
  grid-template-columns: 100px 1fr 120px 150px 120px;
  gap: 15px;
  font-weight: 600;
  color: var(--text-secondary);
}

.dispute-item {
  padding: 20px;
  border-bottom: 1px solid var(--border);
  display: grid;
  grid-template-columns: 100px 1fr 120px 150px 120px;
  gap: 15px;
  align-items: center;
  transition: var(--transition);
}

.dispute-item:hover {
  background-color: var(--background);
}

.dispute-id {
  font-weight: 600;
  color: var(--primary);
}

.dispute-task {
  font-weight: 500;
}

.dispute-status {
  padding: 5px 10px;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  text-align: center;
}

.status-pending {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.status-review {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--info);
}

.status-resolved {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.dispute-actions {
  display: flex;
  gap: 10px;
}

/* 争议详情 */
.dispute-detail {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 30px;
  margin-top: 30px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border);
}

.detail-title {
  font-size: 1.5rem;
}

.detail-subtitle {
  color: var(--text-secondary);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.detail-section {
  background-color: var(--background);
  border-radius: var(--radius-md);
  padding: 20px;
}

.section-title {
  font-size: 1.1rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: var(--primary);
}

.claim-content {
  line-height: 1.6;
  margin-bottom: 20px;
}

.evidence-list {
  margin-top: 15px;
}

.evidence-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.evidence-item:last-child {
  border-bottom: none;
}

.evidence-icon {
  color: var(--primary);
  margin-right: 10px;
  font-size: 1.2rem;
}

.evidence-name {
  flex: 1;
  font-size: 0.95rem;
}

.evidence-link {
  color: var(--primary);
  text-decoration: none;
}

/* 仲裁投票 */
.voting-section {
  background-color: var(--background);
  border-radius: var(--radius-md);
  padding: 30px;
  margin-top: 30px;
}

.voting-title {
  font-size: 1.3rem;
  margin-bottom: 20px;
  text-align: center;
}

.voting-options {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.voting-option {
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  padding: 20px;
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  width: 200px;
}

.voting-option:hover {
  background-color: var(--card-bg);
  box-shadow: var(--shadow-sm);
}

.voting-option.selected {
  border-color: var(--primary);
  background-color: rgba(108, 99, 255, 0.05);
}

.voting-option.employer.selected {
  border-color: var(--info);
  background-color: rgba(59, 130, 246, 0.05);
}

.voting-option.executor.selected {
  border-color: var(--success);
  background-color: rgba(16, 185, 129, 0.05);
}

.voting-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin: 0 auto 15px;
  background-color: var(--primary-light);
  color: var(--primary);
}

.voting-option.employer .voting-icon {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--info);
}

.voting-option.executor .voting-icon {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.voting-label {
  font-weight: 600;
  margin-bottom: 5px;
}

.voting-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.voting-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 12px 25px;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: var(--purple-gradient);
  color: white;
  box-shadow: 0 4px 6px rgba(108, 99, 255, 0.15);
}

.btn-primary:hover {
  box-shadow: 0 6px 8px rgba(108, 99, 255, 0.25);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-primary);
}

.btn-outline:hover {
  border-color: var(--primary);
  color: var(--primary);
  background-color: rgba(108, 99, 255, 0.05);
}

.btn-lg {
  padding: 15px 30px;
  font-size: 1.1rem;
}

/* 仲裁进度 */
.arbitration-progress {
  background-color: var(--background);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-top: 30px;
}

.progress-title {
  font-size: 1.2rem;
  margin-bottom: 20px;
  text-align: center;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 40px 0;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 4px;
  background-color: var(--border);
  z-index: 1;
}

.progress-bar {
  position: absolute;
  top: 20px;
  left: 0;
  height: 4px;
  background: var(--purple-gradient);
  z-index: 2;
  transition: width 0.5s ease;
}

.progress-step {
  position: relative;
  z-index: 3;
  text-align: center;
  width: 100px;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--card-bg);
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  transition: var(--transition);
}

.step-icon.active {
  border-color: var(--primary);
  background-color: var(--primary);
  color: white;
}

.step-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.step-status {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 5px;
}

/* 不要在这里定义 :root、body、h1 等全局样式 */
</style>