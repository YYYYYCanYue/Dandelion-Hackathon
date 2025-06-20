<template>
  <div id="app">
    <div class="container">
      <div class="profile-container">
        <!-- 左侧个人信息 -->
        <div class="profile-sidebar">
          <div class="user-profile">
            <div class="user-avatar">
              {{ userInitials }}
            </div>
            <h2 class="user-name">{{ userName }}</h2>
            <div class="user-wallet">
              <span v-if="isConnected">{{ shortAccount }}</span>
              <button v-else class="btn btn-primary" @click="connectWallet()">
                <i class="fas fa-wallet"></i> 连接钱包
              </button>
            </div>
            
            <div class="credit-score">
              <i class="fas fa-star"></i>
              <span>信用评分: {{ creditScore }}</span>
              <span
                v-if="creditScore >= 90"
                class="top-executor-badge"
              >顶级执行者</span>
            </div>
            
            <div class="user-stats">
              <div class="stat-item">
                <div class="stat-value">{{ contributionValue }}</div>
                <div class="stat-label">贡献值</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ completedTasks }}</div>
                <div class="stat-label">完成任务</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ arbitrationCount }}</div>
                <div class="stat-label">仲裁次数</div>
              </div>
            </div>
          </div>
          
          <div class="progress-container">
            <div class="progress-label">
              <span>信用等级进度</span>
              <span>{{ creditScore }}/100</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: creditScore + '%' }"></div>
            </div>
          </div>
          
          <div class="progress-container">
            <div class="progress-label">
              <span>DAO投票权重</span>
              <span>{{ votingPower }}票</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: votingPowerPercent + '%' }"></div>
            </div>
            <p class="dao-tip">每100点贡献值增加1票基础权重</p>
          </div>
          
          <ul class="profile-menu">
            <li><a href="#" :class="{active: currentPage === 'profile'}" @click="currentPage = 'profile'">
              <i class="fas fa-user"></i> 个人资料
            </a></li>
            <li><a href="#" :class="{active: currentPage === 'tasks'}" @click="currentPage = 'tasks'">
              <i class="fas fa-tasks"></i> 我的任务
            </a></li>
            <li><a href="#" :class="{active: currentPage === 'history'}" @click="currentPage = 'history'">
              <i class="fas fa-history"></i> 任务历史
            </a></li>
            <li><a href="#" :class="{active: currentPage === 'wallet'}" @click="currentPage = 'wallet'">
              <i class="fas fa-coins"></i> 钱包管理
            </a></li>
            <li><a href="#" :class="{active: currentPage === 'arbitration'}" @click="currentPage = 'arbitration'">
              <i class="fas fa-gavel"></i> 仲裁记录
            </a></li>
            <li><a href="#" :class="{active: currentPage === 'credit'}" @click="currentPage = 'credit'">
              <i class="fas fa-chart-line"></i> 信用记录
            </a></li>
            <li><a href="#" :class="{active: currentPage === 'settings'}" @click="currentPage = 'settings'">
              <i class="fas fa-cog"></i> 账户设置
            </a></li>
            <li><a href="#" :class="{active: currentPage === 'security'}" @click="currentPage = 'security'">
              <i class="fas fa-shield-alt"></i> 安全设置
            </a></li>
          </ul>
        </div>
        
        <!-- 右侧内容区域 -->
        <div class="profile-content">
          <div class="content-header">
            <h2 class="content-title">{{ pageTitles[currentPage] }}</h2>
            <div class="actions">
              <button class="btn btn-outline" v-if="currentPage === 'history'">
                <i class="fas fa-download"></i> 导出记录
              </button>
              <button class="btn btn-primary" v-if="currentPage === 'profile'">
                <i class="fas fa-save"></i> 保存更改
              </button>
            </div>
          </div>
          
          <!-- 个人资料页面 -->
          <div class="page-content" :class="{active: currentPage === 'profile'}">
            <div class="profile-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="profile-name">
                    <i class="fas fa-user"></i> 用户名
                  </label>
                  <input type="text" class="form-input" id="profile-name" name="profile-name" v-model="userProfile.name">
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="profile-email">
                    <i class="fas fa-envelope"></i> 电子邮箱
                  </label>
                  <input type="email" class="form-input" id="profile-email" name="profile-email" v-model="userProfile.email">
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label" for="profile-website">
                  <i class="fas fa-globe"></i> 个人网站
                </label>
                <input type="url" class="form-input" id="profile-website" name="profile-website" v-model="userProfile.website">
              </div>
              
              <div class="form-group">
                <label class="form-label" for="profile-location">
                  <i class="fas fa-map-marker-alt"></i> 所在地
                </label>
                <input type="text" class="form-input" id="profile-location" name="profile-location" v-model="userProfile.location">
              </div>
              
              <div class="form-group">
                <label class="form-label" for="profile-occupation">
                  <i class="fas fa-briefcase"></i> 职业
                </label>
                <input type="text" class="form-input" id="profile-occupation" name="profile-occupation" v-model="userProfile.occupation">
              </div>
              
              <div class="form-group">
                <label class="form-label" for="profile-skills">
                  <i class="fas fa-graduation-cap"></i> 技能
                </label>
                <textarea class="form-input" id="profile-skills" name="profile-skills" v-model="userProfile.skills" placeholder="输入您的技能，用逗号分隔"></textarea>
              </div>
              
              <div class="form-group">
                <label class="form-label" for="profile-bio">
                  <i class="fas fa-file-alt"></i> 个人简介
                </label>
                <textarea class="form-input" id="profile-bio" name="profile-bio" rows="5" v-model="userProfile.bio"></textarea>
              </div>
              
              <div class="form-actions">
                <button class="btn btn-outline">取消</button>
                <button class="btn btn-primary">保存更改</button>
              </div>
            </div>
          </div>
          
          <!-- 我的任务页面 -->
          <div class="page-content" :class="{active: currentPage === 'tasks'}">
            <div class="task-filters">
              <div class="filters-row">
                <select class="form-input task-type-select" id="task-type-filter" name="task-type-filter" v-model="taskFilter">
                  <option value="all">全部任务</option>
                  <option value="created">我创建的</option>
                  <option value="executed">我执行的</option>
                </select>
                <select class="form-input task-status-select" id="task-status-filter" name="task-status-filter" v-model="taskStatusFilter">
                  <option value="all">全部状态</option>
                  <option value="bidding">竞标中</option>
                  <option value="developing">开发中</option>
                  <option value="reviewing">评审中</option>
                  <option value="disputed">争议中</option>
                </select>
              </div>
            </div>
            <div class="task-grid">
              <div class="task-card" v-for="task in filteredTasks" :key="task.id">
                <div class="task-header">
                  <div class="task-title">
                    <span>{{ task.title }}</span>
                    <span class="task-status" :class="'status-' + task.status">{{ task.statusText }}</span>
                  </div>
                  <div class="task-meta">
                    <div><i class="far fa-clock"></i> 截止: {{ task.deadline }}</div>
                    <div><i class="far fa-user"></i> 参与: {{ task.participants }}</div>
                  </div>
                </div>
                <div class="task-body">
                  <p class="task-description">{{ task.description }}</p>
                </div>
                <div class="task-footer">
                  <div class="reward">{{ task.reward }} ETH</div>
                  <button class="btn btn-primary btn-sm" @click="openManageTask(task)">管理任务</button>
                </div>
                <div class="task-role-badge" :class="task.type">
                  {{ task.type === 'created' ? '发布者' : '执行者' }}
                </div>
              </div>
            </div>
            <div class="empty-state" v-if="filteredTasks.length === 0">
              <div class="empty-icon">
                <i class="fas fa-tasks"></i>
              </div>
              <h3 class="empty-title">暂无任务</h3>
              <p class="empty-description">您还没有创建或执行任何任务，开始探索任务市场吧！</p>
              <button class="btn btn-primary">
                <i class="fas fa-search"></i> 浏览任务市场
              </button>
            </div>
            <!-- 管理任务弹窗 -->
            <ManageTask
              v-if="showManageTask"
              :task="selectedTask"
              :is-creator="selectedTask && selectedTask.type === 'created'"
              @close="closeManageTask"
              @updateTask="updateTask"
            />
          </div>
          
          <!-- 任务历史页面 -->
          <div class="page-content" :class="{active: currentPage === 'history'}">
            <div class="history-container">
              <div class="history-header">
                <h3 class="history-title">任务历史记录</h3>
                <div class="history-filters">
                  <select class="filter-select" id="history-year" name="history-year" v-model="historyYear">
                    <option>2023年</option>
                    <option>2022年</option>
                    <option>2021年</option>
                  </select>
                  <select class="filter-select" id="history-type" name="history-type" v-model="historyType">
                    <option value="all">全部类型</option>
                    <option value="created">我创建的</option>
                    <option value="executed">我执行的</option>
                  </select>
                </div>
              </div>
              <div class="history-list">
                <div class="arbitration-item" v-for="task in taskHistory" :key="task.id">
                  <div class="arbitration-id">#{{ task.id }}</div>
                  <div class="arbitration-task">{{ task.title }}</div>
                  <div class="arbitration-date">{{ task.date }}</div>
                  <div class="arbitration-amount">{{ task.amount }} ETH</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 钱包管理页面 -->
          <div class="page-content" :class="{active: currentPage === 'wallet'}">
            <div class="wallet-grid">
              <div class="wallet-card">
                <div class="wallet-header">
                  <div class="wallet-icon">
                    <i class="fab fa-ethereum"></i>
                  </div>
                  <div>
                    <h3 class="wallet-title">主钱包</h3>
                    <div class="wallet-address">0x8a3C5F7d12E3B2cD45a9a8F2d8c1B0eF4a3D2F7</div>
                  </div>
                </div>
                <div class="wallet-balance">3.542 ETH</div>
                <p>≈ $6,320.50 USD</p>
                <div class="wallet-actions">
                  <button class="btn btn-outline">充值</button>
                  <button class="btn btn-outline">提现</button>
                  <button class="btn btn-primary">交易记录</button>
                </div>
              </div>
              
              <div class="wallet-card">
                <div class="wallet-header">
                  <div class="wallet-icon">
                    <i class="fas fa-coins"></i>
                  </div>
                  <div>
                    <h3 class="wallet-title">质押钱包</h3>
                    <div class="wallet-address">0x8a3C5F7d12E3B2cD45a9a8F2d8c1B0eF4a3D2F7</div>
                  </div>
                </div>
                <div class="wallet-balance">2.150 ETH</div>
                <p>质押中，不可用</p>
                <div class="wallet-actions">
                  <button class="btn btn-outline">查看详情</button>
                </div>
              </div>
              
              <div class="wallet-card">
                <div class="wallet-header">
                  <div class="wallet-icon">
                    <i class="fas fa-piggy-bank"></i>
                  </div>
                  <div>
                    <h3 class="wallet-title">奖励钱包</h3>
                    <div class="wallet-address">0x8a3C5F7d12E3B2cD45a9a8F2d8c1B0eF4a3D2F7</div>
                  </div>
                </div>
                <div class="wallet-balance">0.842 ETH</div>
                <p>DAO奖励和返佣</p>
                <div class="wallet-actions">
                  <button class="btn btn-outline">转入主钱包</button>
                </div>
              </div>
            </div>
            
            <div class="chart-container wallet-chart-container">
              <h3 class="chart-title">资产分布</h3>
              <div id="walletChart" class="wallet-chart"></div>
            </div>
          </div>
          
          <!-- 仲裁记录页面 -->
          <div class="page-content" :class="{active: currentPage === 'arbitration'}">
            <div class="arbitration-list">
              <div class="arbitration-item">
                <div class="arbitration-id">#DIS-20231001</div>
                <div class="arbitration-task">DeFi协议安全审计</div>
                <div class="arbitration-status status-resolved">已解决</div>
                <button class="btn btn-outline btn-sm">查看详情</button>
              </div>
              
              <div class="arbitration-item">
                <div class="arbitration-id">#DIS-20230928</div>
                <div class="arbitration-task">NFT市场UI设计</div>
                <div class="arbitration-status status-resolved">已解决</div>
                <button class="btn btn-outline btn-sm">查看详情</button>
              </div>
              
              <div class="arbitration-item">
                <div class="arbitration-id">#DIS-20230922</div>
                <div class="arbitration-task">跨链桥智能合约开发</div>
                <div class="arbitration-status status-in-progress">仲裁中</div>
                <button class="btn btn-outline btn-sm">参与仲裁</button>
              </div>
              
              <div class="arbitration-item">
                <div class="arbitration-id">#DIS-20230915</div>
                <div class="arbitration-task">区块链游戏开发</div>
                <div class="arbitration-status status-pending">待处理</div>
                <button class="btn btn-outline btn-sm">查看详情</button>
              </div>
            </div>
          </div>
          
          <!-- 信用记录页面 -->
          <div class="page-content" :class="{active: currentPage === 'credit'}">
            <div class="credit-records">
              <div class="credit-card">
                <h3 class="chart-title">加分记录</h3>
                <div class="record-list">
                  <div class="record-item" v-for="record in positiveRecords" :key="record.id">
                    <div class="record-reason">{{ record.reason }}</div>
                    <div class="record-date">{{ record.date }}</div>
                    <div class="record-change positive">+{{ record.points }}</div>
                  </div>
                </div>
              </div>
              
              <div class="credit-card">
                <h3 class="chart-title">扣分记录</h3>
                <div class="record-list">
                  <div class="record-item" v-for="record in negativeRecords" :key="record.id">
                    <div class="record-reason">{{ record.reason }}</div>
                    <div class="record-date">{{ record.date }}</div>
                    <div class="record-change negative">-{{ record.points }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chart-container credit-chart-container">
              <h3 class="chart-title">信用评分趋势</h3>
              <div id="creditChart" class="credit-chart"></div>
            </div>
          </div>
          
          <!-- 账户设置页面 -->
          <div class="page-content" :class="{active: currentPage === 'settings'}">
            <div class="settings-grid">
              <div class="setting-group">
                <h3 class="setting-title">通知设置</h3>
                
                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-name">任务通知</div>
                    <div class="setting-description">接收任务状态更新通知</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" checked>
                    <span class="slider"></span>
                  </label>
                </div>
                
                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-name">竞价通知</div>
                    <div class="setting-description">接收竞价相关通知</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" checked>
                    <span class="slider"></span>
                  </label>
                </div>
                
                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-name">仲裁通知</div>
                    <div class="setting-description">接收仲裁相关通知</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" checked>
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="setting-group">
                <h3 class="setting-title">显示设置</h3>
                
                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-name">主题模式</div>
                    <div class="setting-description">切换亮色/暗色主题</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" id="theme-switch">
                    <span class="slider"></span>
                  </label>
                </div>
                
                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-name">货币单位</div>
                    <div class="setting-description">设置默认货币单位</div>
                  </div>
                  <select class="form-select currency-select" id="currency-unit" name="currency-unit">
                    <option>ETH</option>
                    <option>USD</option>
                    <option>CNY</option>
                  </select>
                </div>
                
                <div class="setting-item">
                  <div class="setting-info">
                    <div class="setting-name">语言设置</div>
                    <div class="setting-description">设置平台显示语言</div>
                  </div>
                  <select class="form-select language-select" id="language-setting" name="language-setting">
                    <option>简体中文</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 安全设置页面 -->
          <div class="page-content" :class="{active: currentPage === 'security'}">
            <div class="security-grid">
              <div class="security-card">
                <div class="security-info">
                  <h3 class="security-title">密码</h3>
                  <div class="security-status status-active">
                    <i class="fas fa-check-circle"></i> 已设置
                  </div>
                  <p class="security-description">最后更新: 2023-09-15</p>
                </div>
                <button class="btn btn-outline">修改密码</button>
              </div>
              
              <div class="security-card">
                <div class="security-info">
                  <h3 class="security-title">双重验证</h3>
                  <div class="security-status status-inactive">
                    <i class="fas fa-times-circle"></i> 未启用
                  </div>
                  <p class="security-description">增强账户安全性</p>
                </div>
                <button class="btn btn-primary">启用</button>
              </div>
              
              <div class="security-card">
                <div class="security-info">
                  <h3 class="security-title">钱包连接</h3>
                  <div class="security-status status-active">
                    <i class="fas fa-check-circle"></i> 已连接
                  </div>
                  <p class="security-description">MetaMask (0x8a3C...F2d7)</p>
                </div>
                <button class="btn btn-outline">管理</button>
              </div>
              
              <div class="security-card">
                <div class="security-info">
                  <h3 class="security-title">登录历史</h3>
                  <div class="security-status status-active">
                    <i class="fas fa-clock"></i> 最近登录: 刚刚
                  </div>
                  <p class="security-description">查看所有登录记录</p>
                </div>
                <button class="btn btn-outline">查看记录</button>
              </div>
              
              <div class="security-card">
                <div class="security-info">
                  <h3 class="security-title">会话管理</h3>
                  <div class="security-status status-active">
                    <i class="fas fa-laptop"></i> 2个活跃会话
                  </div>
                  <p class="security-description">管理所有设备上的登录状态</p>
                </div>
                <button class="btn btn-outline">管理会话</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
import { storeToRefs } from 'pinia'
import ManageTask from '../组件/管理任务.vue'
import { useWalletStore  } from '../../composables/useWallet.js'

const walletStore = useWalletStore()
const { isConnected, account, shortAccount } = storeToRefs(walletStore)
const { connectWallet } = walletStore

// 用户数据
const userName = ref('张 开发者')
const creditScore = ref(92)
const contributionValue = ref(1250)
const completedTasks = ref(28)
const arbitrationCount = ref(7)
const votingPower = computed(() => Math.floor(contributionValue.value / 100))
const votingPowerPercent = computed(() => Math.min(100, votingPower.value))
const userInitials = computed(() => {
  const names = userName.value.split(' ')
  if (names.length >= 2) {
    return names[0].charAt(0) + names[1].charAt(0)
  }
  return userName.value.charAt(0)
})

// 当前页面状态
const route = useRoute()
const currentPage = ref('profile')
const pageTitles = ref({
  profile: '个人资料',
  tasks: '我的任务',
  history: '任务历史',
  wallet: '钱包管理',
  arbitration: '仲裁记录',
  credit: '信用记录',
  settings: '账户设置',
  security: '安全设置'
})
        
// 用户个人资料
const userProfile = ref({
  name: '张 开发者',
  email: 'developer@example.com',
  website: 'https://portfolio.example.com',
  location: '上海, 中国',
  occupation: '区块链全栈开发工程师',
  skills: 'Solidity, React, Node.js, Web3, Ethereum',
  bio: '拥有5年区块链开发经验，专注于DeFi和NFT领域。擅长智能合约开发和DApp前端实现。'
})
        
// 用户钱包地址
const walletAddress = computed(() => walletStore.account)

// 更新模拟任务数据，添加雇主和执行者字段
const tasks = ref([
  // {
  //   id: 1,
  //   title: 'DEX交易平台前端开发',
  //   description: '为去中心化交易所开发响应式前端界面，要求兼容MetaMask钱包',
  //   status: 'developing',
  //   statusText: '开发中',
  //   deadline: '2023-10-15',
  //   participants: '1/1',
  //   reward: '1.5',
  //   type: 'executed',
  //   employer: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  //   executor: walletAddress.value // 当前用户是执行者
  // },
  // {
  //   id: 2,
  //   title: 'NFT艺术画廊UI设计',
  //   description: '设计现代简约风格的NFT艺术画廊界面',
  //   status: 'reviewing',
  //   statusText: '评审中',
  //   deadline: '2023-10-20',
  //   participants: '1/1',
  //   reward: '0.8',
  //   type: 'created',
  //   employer: walletAddress.value, // 当前用户是雇主
  //   executor: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'
  // },
  // {
  //   id: 3,
  //   title: 'DAO治理合约开发',
  //   description: '开发基于ERC-20的DAO治理合约',
  //   status: 'completed',
  //   statusText: '已完成',
  //   deadline: '2023-10-05',
  //   participants: '1/1',
  //   reward: '2.2',
  //   type: 'executed',
  //   employer: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  //   executor: walletAddress.value // 当前用户是执行者
  // }
])
        
// 任务筛选
const taskFilter = ref('all')
const taskStatusFilter = ref('all')
const filteredTasks = computed(() => {
  // 只显示与当前钱包地址相关的任务
  return tasks.value.filter(task => {
    // 类型筛选
    if (taskFilter.value !== 'all') {
      if (taskFilter.value === 'created' && task.type !== 'created') return false;
      if (taskFilter.value === 'executed' && task.type !== 'executed') return false;
    }
    // 状态筛选
    if (taskStatusFilter.value !== 'all') {
      if (taskStatusFilter.value === 'bidding' && task.status !== 'bidding') return false;
      if (taskStatusFilter.value === 'developing' && task.status !== 'developing') return false;
      if (taskStatusFilter.value === 'reviewing' && task.status !== 'reviewing') return false;
      if (taskStatusFilter.value === 'disputed' && task.status !== 'disputed') return false;
    }
    // 新增：检查任务是否属于当前用户
    const isTaskForCurrentUser = (
      (task.type === 'created' && task.employer === walletAddress.value) ||
      (task.type === 'executed' && task.executor === walletAddress.value)
    );
    return isTaskForCurrentUser;
  });
})
        
// 任务历史数据
const taskHistory = ref([
  { id: 'TASK-20231001', title: 'DEX交易平台前端开发', date: '2023-10-05', amount: '1.50' },
  { id: 'TASK-20231002', title: 'NFT艺术画廊UI设计', date: '2023-10-03', amount: '0.80' },
  { id: 'TASK-20231003', title: 'DAO治理合约开发', date: '2023-09-28', amount: '2.20' },
  { id: 'TASK-20231004', title: 'DeFi协议安全审计', date: '2023-09-25', amount: '5.00' },
  { id: 'TASK-20231005', title: '区块链白皮书撰写', date: '2023-09-20', amount: '0.75' },
  { id: 'TASK-20231006', title: '加密货币交易数据分析', date: '2023-09-18', amount: '1.20' },
  { id: 'TASK-20231007', title: '跨链桥智能合约开发', date: '2023-09-15', amount: '3.50' },
  { id: 'TASK-20231008', title: 'DApp用户增长策略', date: '2023-09-10', amount: '1.00' }
])
        
// 信用记录数据
const positiveRecords = ref([
  { id: 1, reason: '高质量完成DEX前端开发任务', date: '2023-10-06', points: 3 },
  { id: 2, reason: '成功仲裁DIS-20230922争议', date: '2023-09-25', points: 2 },
  { id: 3, reason: '连续完成5个任务无争议', date: '2023-09-18', points: 5 },
  { id: 4, reason: '帮助改进平台功能', date: '2023-09-10', points: 2 },
  { id: 5, reason: 'NFT设计任务获得雇主好评', date: '2023-08-28', points: 3 }
])
        
const negativeRecords = ref([
  { id: 1, reason: 'DeFi审计任务争议处理', date: '2023-09-26', points: 2 },
  { id: 2, reason: '延迟提交任务成果', date: '2023-08-15', points: 1 },
  { id: 3, reason: '取消已接受任务', date: '2023-07-22', points: 3 }
])
        
// 任务历史筛选
const historyYear = ref('2023年')
const historyType = ref('all')

// 管理任务弹窗相关
const selectedTask = ref(null)
const showManageTask = ref(false)
function openManageTask(task) {
  selectedTask.value = { ...task }
  showManageTask.value = true
}
function closeManageTask() {
  selectedTask.value = null
  showManageTask.value = false
}
function updateTask(updatedTask) {
  // 确保任务有雇主和执行者信息
  if (!updatedTask.employer && updatedTask.type === 'created') {
    updatedTask.employer = walletAddress.value;
  }
  if (!updatedTask.executor && updatedTask.type === 'executed') {
    updatedTask.executor = walletAddress.value;
  }
  // 更新本地任务数据
  const idx = tasks.value.findIndex(t => t.id === updatedTask.id)
  if (idx !== -1) {
    tasks.value[idx] = { ...updatedTask }
  }
  // 同步localStorage
  let myTasks = JSON.parse(localStorage.getItem('myTasks') || '[]')
  const myIdx = myTasks.findIndex(t => t.id === updatedTask.id)
  if (myIdx !== -1) {
    myTasks[myIdx] = { ...updatedTask }
    localStorage.setItem('myTasks', JSON.stringify(myTasks))
  }
  closeManageTask()
}
onMounted(() => {
  // 信用评分趋势图
  if (typeof document !== 'undefined') {
    // 信用评分趋势
    const creditChartDom = document.getElementById('creditChart')
    if (creditChartDom) {
      const creditChart = echarts.init(creditChartDom)
      creditChart.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['9/20', '9/21', '9/22', '9/23', '9/24', '9/25', '9/26', '9/27', '9/28', '9/29', '9/30'],
          axisLabel: { color: '#94a3b8', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          min: 85,
          max: 95,
          axisLabel: { color: '#94a3b8', fontSize: 12 }
        },
        series: [{
          name: '信用评分',
          type: 'line',
          smooth: true,
          data: [88, 89, 87, 90, 91, 92, 91, 93, 92, 93, 92],
          lineStyle: { width: 3, color: '#6c63ff' },
          itemStyle: { color: '#6c63ff' }
        }],
        grid: { left: 40, right: 20, top: 40, bottom: 40 }
      })
    }
    // 钱包资产分布
    const walletChartDom = document.getElementById('walletChart')
    if (walletChartDom) {
      const walletChart = echarts.init(walletChartDom)
      walletChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { bottom: 0 },
        series: [{
          name: '资产分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
          data: [
            { value: 44, name: '主钱包' },
            { value: 55, name: '质押钱包' },
            { value: 13, name: '奖励钱包' },
            { value: 43, name: '其他' }
          ],
          color: ['#6c63ff', '#35b0ab', '#ff6584', '#f59e0b']
        }]
      })
    }
  }
  loadMyTasks()
  if (route.query.tab === 'tasks') {
    currentPage.value = 'tasks'
  }
})
        
// 新增：加载localStorage中的myTasks
function loadMyTasks() {
  const addr = walletStore.account;
  if (!addr) return;
  // 从本地存储加载任务
  const myTasks = JSON.parse(localStorage.getItem('myTasks') || '[]');
  // 只加载与当前钱包地址相关的任务
  const relevantTasks = myTasks.filter(task =>
    (task.employer === addr || task.executor === addr)
  );
  // 合并去重
  const ids = new Set(tasks.value.map(t => t.id));
  relevantTasks.forEach(t => {
    if (!ids.has(t.id)) tasks.value.push(t);
  });
}
</script>
<style scoped>
:root {
  --primary: #6c63ff;
  --secondary: #35b0ab;
  --success: #16c79a;
  --info: #f39c12;
  --warning: #e74c3c;
  --error: #c0392b;
  --text-primary: #333;
  --text-secondary: #666;
  --text-tertiary: #999;
  --background: #f4f4f9;
  --card-bg: #ffffff;
  --border: #e0e0e0;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 50%;
  --transition: all 0.3s ease;
  --teal-gradient: linear-gradient(135deg, #4fd1c5, #2c3e50);
  --purple-gradient: linear-gradient(135deg, #6c63ff, #3f3cbb);
}
    
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'PingFang SC', sans-serif;
  background-color: var(--background);
  color: var(--text-primary);
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

button {
  cursor: pointer;
}

/* 个人中心布局 */
.profile-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  padding: 40px 0;
}

.profile-sidebar {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 30px;
}

.user-profile {
  text-align: center;
  padding-bottom: 25px;
  margin-bottom: 25px;
  border-bottom: 1px solid var(--border);
}

.user-avatar {
  width: 100px;
  height: 100px;
  line-height: 100px;
  border-radius: var(--radius-full);
  background: var(--teal-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 auto 20px;
  user-select: none;
  -webkit-user-select: none; /* Safari 3+ */
}

.user-name {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.user-wallet {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 15px;
  word-break: break-all;
}

.credit-score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: rgba(16, 185, 129, 0.1);
  padding: 8px 15px;
  border-radius: var(--radius-full);
  margin: 20px 0;
}

.top-executor-badge {
  border-radius: 12px;
  margin-left: 8px;
  background: var(--success);
  color: white;
  padding: 2px 8px;
  font-size: 0.8rem;
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.progress-container {
  margin: 25px 0;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.progress-bar {
  height: 10px;
  background-color: var(--background);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--purple-gradient);
  border-radius: var(--radius-full);
  transition: width 1s ease-in-out;
}

/* 导航菜单 */
.profile-menu {
  margin-bottom: 8px;
  list-style: none;
}

.profile-menu li {
  margin-bottom: 8px;
}

.profile-menu a {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-radius: var(--radius-md);
  transition: var(--transition);
  color: var(--text-secondary);
}

.profile-menu a:hover, .profile-menu a.active {
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
  padding: 10px 20px;
  font-size: 1.8rem;
  border-radius: var(--radius-md);
}

.btn {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: var(--purple-gradient);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: rgba(108, 99, 255, 0.15);
  box-shadow: 0 4px 6px rgba(108, 99, 255, 0.15);
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

/* 页面内容样式 */
.page-content {
  display: none;
}

.page-content.active {
  display: block;
}

/* 个人资料页 */
.profile-form {
  max-width: 700px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: var(--transition);
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

.task-filters {
  margin-bottom: 20px;
}

.task-type-select, .task-status-select {
  width: 200px;
  display: inline-block;
}

.task-status-select {
  margin-left: 10px;
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.task-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: var(--transition);
}

.task-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
}

.task-header {
  padding: 20px;
  border-bottom: 1px solid var(--border);
}

.task-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 10px;
}

.task-status {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
}

.status-bidding {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--info);
}

.status-developing {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.status-reviewing {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.status-disputed {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error);
}

.task-meta {
  display: flex;
  gap: 16px;
  color: var(--text-secondary);
}

.task-meta div {
  display: flex;
  align-items: center;
  gap: 5px;
}

.task-body {
  padding: 20px;
  color: var(--text-secondary);
}

.task-description {
  margin-bottom: 20px;
  font-size: 0.95rem;
  line-height: 1.6;
}

.task-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: rgba(241, 245, 249, 0.5);
}

.reward {
  font-weight: 600;
  color: var(--primary);
  font-size: 1.1rem;
}

.wallet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.wallet-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 25px;
  transition: var(--transition);
}

.wallet-card:hover {
  background-color: var(--card-bg);
}

.wallet-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.wallet-icon {
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: var(--radius-full);
  background-color: rgba(108, 99, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--primary);
}

.wallet-title {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.wallet-balance {
  font-size: 1.8rem;
  font-weight: 700;
}

.wallet-address {
  color: var(--text-secondary);
  font-size: 0.9rem;
  word-break: break-all;
  margin-bottom: 20px;
}

.wallet-actions {
  display: flex;
  gap: 10px;
}

/* 仲裁记录 */
.arbitration-list {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.arbitration-item {
  display: grid;
  grid-template-columns: 100px 1fr 150px 150px;
  gap: 20px;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border);
  transition: var(--transition);
}

.arbitration-item:hover {
  font-weight: 600;
  background-color: var(--background);
}

.arbitration-id {
  font-weight: 600;
  color: var(--primary);
}

.arbitration-task {
  font-weight: 600;
}

.arbitration-status {
  padding: 5px 10px;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  text-align: center;
}

.status-pending {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.status-in-progress {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--info);
}

.status-resolved {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

/* 信用记录 */
.credit-records {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.credit-card {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.record-list {
  margin-top: 10px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.record-item:last-child {
  border-bottom: none;
}

.record-reason {
  width: 100px;
  flex: 1;
}

.record-date {
  width: 100px;
  flex: 1;
  text-align: center;
}

.record-change {
  font-weight: 600;
  width: 80px;
  text-align: right;
}

.positive {
  color: var(--success);
}

.negative {
  color: var(--error);
}

/* 账户设置 */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.setting-group {
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  padding: 25px;
  box-shadow: var(--shadow-sm);
}

.setting-title {
  font-size: 1.2rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--border);
}

.setting-info {
  flex: 1;
}

.setting-name {
  font-weight: 500;
}

.setting-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* 安全设置 */
.security-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.security-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.security-title {
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.security-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.status-active {
  color: var(--success);
}

.status-inactive {
  color: var(--error);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.empty-description {
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto 30px;
}

/* 响应式设计 */      
@media (max-width: 1024px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .task-grid {
    grid-template-columns: 1fr;
  }
  
  .arbitration-item {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style><!-- 本文件未引入任何含eval相关用法的第三方库或自定义脚本。 -->