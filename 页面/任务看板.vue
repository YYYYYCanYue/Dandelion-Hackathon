<template>
  <!-- 任务看板内容 -->
  <div class="board-container">
    <!-- 左侧筛选面板 -->
    <div class="board-sidebar">
      <div class="filter-section">
        <h3 class="filter-title"><i class="fas fa-filter"></i> 任务筛选</h3>
        
        <div class="filter-group">
          <h4>任务状态</h4>
          <div class="filter-item" v-for="status in taskStatuses" :key="status.value">
            <input type="checkbox" :id="'status-'+status.value" v-model="status.checked">
            <label :for="'status-'+status.value">{{ status.label }}</label>
            <span class="count">{{ statusCounts[status.value] }}</span>
          </div>
        </div>
        
        <div class="filter-group">
          <h4>任务类别</h4>
          <div class="filter-item" v-for="category in taskCategories" :key="category.value">
            <input type="checkbox" :id="'category-'+category.value" v-model="category.checked">
            <label :for="'category-'+category.value">{{ category.label }}</label>
            <span class="count">{{ categoryCounts[category.value] }}</span>
          </div>
        </div>
        
        <div class="filter-group">
          <h4>赏金范围</h4>
          <div class="filter-item" v-for="reward in rewardRanges" :key="reward.value">
            <input type="checkbox" :id="'reward-'+reward.value" v-model="reward.checked">
            <label :for="'reward-'+reward.value">{{ reward.label }}</label>
            <span class="count">{{ rewardCounts[reward.value] }}</span>
          </div>
        </div>
        
        <button class="btn btn-outline reset-btn" @click="resetFilters">
          <i class="fas fa-sync-alt"></i> 重置筛选
        </button>
      </div>
      
      <div class="stats-card">
        <h3 class="stats-title"><i class="fas fa-chart-line"></i> 平台数据</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">8,452</div>
            <div class="stat-label">已完成任务</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">23,189</div>
            <div class="stat-label">注册开发者</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">12,542</div>
            <div class="stat-label">累计ETH</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">96.7%</div>
            <div class="stat-label">任务成功率</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧任务列表 -->
    <div class="board-content">
      <div class="board-header">
        <h2 class="board-title">任务看板</h2>
        <div class="header-actions">
          <button class="btn btn-danger" @click="confirmClearLocalData">
            <i class="fas fa-trash-alt"></i> 清除测试数据
          </button>
          <button class="btn btn-primary" @click="goToPublish">
            <i class="fas fa-plus"></i> 发布新任务
          </button>
        </div>
      </div>
      
      <div class="filters-row">
        <div class="filter-group">
          <span class="filter-label">排序:</span>
          <select class="filter-select" id="sort-option" name="sort-option" v-model="sortOption">
            <option value="newest">最新优先</option>
            <option value="reward-high">赏金最高</option>
            <option value="deadline">截止最近</option>
          </select>
        </div>
        <div class="filter-group">
          <span class="filter-label">任务类型:</span>
          <select class="filter-select" id="task-type" name="task-type" v-model="taskType">
            <option value="all">全部任务</option>
            <option value="web3">Web3开发</option>
            <option value="design">UI/UX设计</option>
            <option value="marketing">市场推广</option>
            <option value="content">内容创作</option>
            <option value="analysis">数据分析</option>
          </select>
        </div>
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            class="search-input"
            id="task-search"
            name="task-search"
            placeholder="搜索任务..."
            v-model="searchQuery"
          >
        </div>
      </div>
      
      <div v-if="filteredTasks.length > 0" class="task-grid">
        <div v-for="task in filteredTasks" :key="task.id" class="task-card">
          <!-- 角色标识 -->
          <div class="role-badge" v-if="isConnected && task.employer === walletAddress">
            您发布的任务
          </div>
          <div class="task-header">
            <div class="task-status" :class="'status-' + task.status">{{ task.statusText }}</div>
            <div class="task-title">
              <a href="#">{{ task.title }}</a>
            </div>
            <div class="task-meta">
              <div><i class="far fa-clock"></i> 截止: {{ task.deadline }}</div>
              <div><i class="far fa-user"></i> 参与: {{ task.participants }}</div>
              <div><i class="fas fa-layer-group"></i> {{ task.category }}</div>
            </div>
          </div>
          <div class="task-body">
            <p class="task-description">{{ task.description }}</p>
            <div class="task-skills">
              <span v-for="(skill, index) in task.skills" :key="index" class="skill-tag">{{ skill }}</span>
            </div>
          </div>
          <div class="task-footer">
            <div class="reward">{{ task.reward }} <span class="reward-currency">USDT</span></div>
            <button
              class="btn btn-primary btn-sm"
              @click="openTaskDetail(task)"
              :disabled="isBiddingFull(task) || isTaskOwner(task)"
            >
              查看详情
            </button>
          </div>
          <!-- 新增：钱包未连接提示 -->
          <div
            v-if="!isConnected"
            class="wallet-disconnected-tip"
          >
            请连接钱包参与任务
          </div>
          <!-- 修改：雇主提示 -->
          <div
            v-else-if="isTaskOwner(task)"
            class="employer-tip"
          >
            您不能参与自己发布的任务
          </div>
          <!-- 修改：已参与提示 -->
          <div
            v-else-if="isTaskJoined(task.id)"
            class="already-joined-tip"
          >
            已参与
          </div>
          <!-- 修改：竞标人数已满提示 -->
          <div
            v-else-if="isBiddingFull(task)"
            class="bidding-full-tip"
          >
            竞标人数已满
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-inbox"></i>
        </div>
        <h3 class="empty-title">未找到匹配的任务</h3>
        <p class="empty-description">当前筛选条件下没有匹配的任务，请尝试调整筛选条件或搜索关键词</p>
        <button class="btn btn-primary" @click="resetFilters">
          <i class="fas fa-sync-alt"></i> 重置筛选条件
        </button>
      </div>
      
      <!-- 分页控件 -->
      <div class="pagination" v-if="filteredTasks.length > 0">
        <button class="btn btn-outline" :disabled="currentPage === 1" @click="prevPage">
          <i class="fas fa-chevron-left"></i> 上一页
        </button>
        <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button class="btn btn-outline" :disabled="currentPage === totalPages" @click="nextPage">
          下一页 <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <!-- 新增：任务详情弹窗 -->
      <div v-if="selectedTask" class="task-detail-modal">
        <div class="modal-mask" @click="closeTaskDetail"></div>
        <div class="modal-content">
          <button class="modal-close" @click="closeTaskDetail"><i class="fas fa-times"></i></button>
          <TaskDetail
            :task="selectedTask"
            @bid="addToMyTasks"
            :already-joined="myTasksIds.includes(selectedTask.id)"
            :bidding-full="isBiddingFull(selectedTask)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TaskDetail from '../组件/任务详情.vue'
import IPFSService from '../../composables/ipfs.js'
import { useWallet } from '../../composables/useWallet.js'

// 用户状态
const connected = ref(true)
const userName = ref('张 开发者')
const mobileMenuOpen = ref(false)
const selectedTask = ref(null)
const router = useRouter()

// 新增：记录已参与竞标的任务ID
const myTasksIds = ref([])
function loadMyTasksIds() {
  const myTasks = JSON.parse(localStorage.getItem('myTasks') || '[]')
  myTasksIds.value = myTasks.map(t => t.id)
}
loadMyTasksIds()

// 计算用户首字母缩写
const userInitials = computed(() => {
  const names = userName.value.split(' ')
  if (names.length >= 2) {
    return names[0].charAt(0) + names[1].charAt(0)
  }
  return userName.value.charAt(0)
})

// 任务状态筛选
const taskStatuses = reactive([
  { value: 'bidding', label: '竞标中', checked: true },
  { value: 'developing', label: '开发中', checked: true },
  { value: 'reviewing', label: '评审中', checked: true },
  { value: 'disputed', label: '争议中', checked: true },
  { value: 'completed', label: '已完成', checked: false }
])

// 任务类别筛选
const taskCategories = reactive([
  { value: 'web3', label: 'Web3开发', checked: true },
  { value: 'design', label: 'UI/UX设计', checked: true },
  { value: 'marketing', label: '市场推广', checked: true },
  { value: 'content', label: '内容创作', checked: true },
  { value: 'analysis', label: '数据分析', checked: true },
  { value: 'other', label: '其他', checked: true }
])

// 赏金范围筛选
const rewardRanges = reactive([
  { value: 'low', label: '0 - 100 USDT', checked: true },
  { value: 'medium', label: '100 - 400 USDT', checked: true },
  { value: 'high', label: '400+ USDT', checked: true }
])

// 排序选项
const sortOption = ref('newest')
const taskType = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const tasksPerPage = ref(8)

// 任务数据
const tasks = reactive([]);
const isLoading = ref(true);
const loadError = ref(null);

// 从IPFS加载任务
const loadTasksFromIPFS = async () => {
  isLoading.value = true;
  loadError.value = null;
  
  try {
    // 检查IPFS守护进程
    const isDaemonRunning = await IPFSService.checkDaemon();
    
    // 从本地存储获取已发布任务的CID列表
    const publishedTasks = JSON.parse(localStorage.getItem('publishedTasks') || '[]');
    
    // 清空当前任务列表
    tasks.splice(0, tasks.length);
    
    // 从IPFS获取所有任务数据
    const loadPromises = publishedTasks.map(async (taskInfo) => {
      try {
        const taskData = await IPFSService.getData(taskInfo.cid);
        
        // 确保任务有基本字段
        if (!taskData.id) taskData.id = taskInfo.cid;
        if (!taskData.status) taskData.status = 'bidding';
        if (!taskData.statusText) taskData.statusText = '竞标中';
        if (!taskData.participants) {
          taskData.participants = taskData.maxParticipants 
            ? `0/${taskData.maxParticipants}` 
            : '0/无限制';
        }
        
        tasks.push(taskData);
      } 
      
      catch (error) {
        console.error(`加载任务失败 (CID: ${taskInfo.cid}):`, error);
        // 添加占位任务
        tasks.push({
          id: taskInfo.cid,
          title: taskInfo.title,
          description: '任务详情加载失败，请检查IPFS守护进程是否运行',
          status: 'error',
          statusText: '加载失败',
          reward: taskInfo.reward || 0,
          category: taskInfo.category || '未知',
          skills: ['加载失败']
        });
      }
    });
    
    await Promise.all(loadPromises);
    
    // 如果没有任务，添加示例任务
    
    
  } catch (error) {
    console.error('加载任务失败:', error);
    loadError.value = error.message;
    //addSampleTasks();
  } finally {
    isLoading.value = false;
  }
};

// 添加示例任务
const addSampleTasks = () => {
  tasks.push(...[
    {
      id: 'TASK-20231001',
      title: 'DEX交易平台前端开发',
      description: '为去中心化交易所开发响应式前端界面，要求兼容MetaMask钱包，实现代币交易、流动性添加等功能',
      status: 'bidding',
      statusText: '竞标中',
      deadline: '2023-10-15',
      participants: '3/10',
      category: 'Web3开发',
      reward: 200,
      duration: '14',
      skills: ['Web3', 'React', 'Ethers.js', 'Solidity']
    }
    // 其他示例任务...
  ]);
};

// 组件挂载时加载任务
onMounted(() => {
  loadTasksFromIPFS();
  loadMyTasksIds();
})

// 计算各状态任务数量
const statusCounts = computed(() => {
  const counts = {
    bidding: 0,
    developing: 0,
    reviewing: 0,
    disputed: 0,
    completed: 0
  }
  
  tasks.forEach(task => {
    counts[task.status]++
  })
  
  return counts
})

// 计算各类别任务数量
const categoryCounts = computed(() => {
  const counts = {
    web3: 0,
    design: 0,
    marketing: 0,
    content: 0,
    analysis: 0,
    other: 0
  }
  
  tasks.forEach(task => {
    // 简化类别映射
    const catMap = {
      'Web3开发': 'web3',
      'UI/UX设计': 'design',
      '市场推广': 'marketing',
      '内容创作': 'content',
      '数据分析': 'analysis',
      '安全审计': 'other'
    }
    
    const cat = catMap[task.category] || 'other'
    counts[cat]++
  })
  
  return counts
})

// 计算各赏金范围任务数量
const rewardCounts = computed(() => {
  const counts = {
    low: 0,
    medium: 0,
    high: 0
  }
  tasks.forEach(task => {
    const reward = parseFloat(task.reward)
    if (reward < 100) counts.low++
    else if (reward < 400) counts.medium++
    else counts.high++
  })
  return counts
})

// 修正赏金筛选逻辑，和面板一致
function getRewardRange(reward) {
  reward = parseFloat(reward)
  if (reward < 100) return 'low'
  if (reward < 400) return 'medium'
  return 'high'
}

// 筛选后的任务
const filteredTasks = computed(() => {
  let result = tasks.filter(task => {
    // 状态筛选
    const status = taskStatuses.find(s => s.value === task.status)
    if (!status || !status.checked) return false
    
    // 类别筛选
    const catMap = {
      'Web3开发': 'web3',
      'UI/UX设计': 'design',
      '市场推广': 'marketing',
      '内容创作': 'content',
      '数据分析': 'analysis',
      '安全审计': 'other'
    }
    const taskCat = catMap[task.category] || 'other'
    const category = taskCategories.find(c => c.value === taskCat)
    if (!category || !category.checked) return false
    
    // 赏金筛选（修正逻辑）
    const rewardRange = getRewardRange(task.reward)
    const range = rewardRanges.find(r => r.value === rewardRange)
    if (!range || !range.checked) return false
    
    // 类型筛选
    if (taskType.value !== 'all') {
      const taskTypeMap = {
        web3: 'Web3开发',
        design: 'UI/UX设计',
        marketing: '市场推广',
        content: '内容创作',
        analysis: '数据分析'
      }
      if (task.category !== taskTypeMap[taskType.value]) return false
    }
    
    // 搜索筛选
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      if (!task.title.toLowerCase().includes(query) && 
          !task.description.toLowerCase().includes(query) &&
          !task.skills.some(skill => skill.toLowerCase().includes(query)) &&
          !task.category.toLowerCase().includes(query)) {
        return false
      }
    }
    
    return true
  })
  
  // 排序
  result.sort((a, b) => {
    if (sortOption.value === 'reward-high') {
      return parseFloat(b.reward) - parseFloat(a.reward)
    } else if (sortOption.value === 'deadline') {
      return new Date(a.deadline) - new Date(b.deadline)
    }
    // 默认按最新排序
    return b.id.localeCompare(a.id)
  })
  
  return result
})

// 分页
const totalPages = computed(() => {
  return Math.ceil(filteredTasks.value.length / tasksPerPage.value)
})

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * tasksPerPage.value
  return filteredTasks.value.slice(start, start + tasksPerPage.value)
})

// 打开任务详情
const openTaskDetail = (task) => {
  loadMyTasksIds()
  selectedTask.value = task
}

// 关闭详情弹窗
const closeTaskDetail = () => {
  selectedTask.value = null
}

// 重置筛选
const resetFilters = () => {
  taskStatuses.forEach(s => s.checked = true)
  taskCategories.forEach(c => c.checked = true)
  rewardRanges.forEach(r => r.checked = true)
  taskType.value = 'all'
  searchQuery.value = ''
  currentPage.value = 1
}

// 分页导航
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// 新增：检查用户是否已参与任务
const isTaskJoined = (taskId) => {
  if (!isConnected.value || !walletAddress.value) return false

  // 从本地存储获取当前钱包参与的任务
  const myTasks = JSON.parse(localStorage.getItem('myTasks') || '[]')
  return myTasks.some(t => t.id === taskId && t.wallet === walletAddress.value)
}

// 新增：处理任务参与逻辑
function addToMyTasks(task) {
  if (!isConnected.value || !walletAddress.value) {
    alert('请先连接钱包')
    return
  }

  // 新增：更新参与人数
  const publishedTasks = JSON.parse(localStorage.getItem('publishedTasks') || '[]')
  // 支持 task.cid 或 task.id 作为唯一标识
  const taskIndex = publishedTasks.findIndex(t => t.cid === task.cid || t.cid === task.id)
  if (taskIndex !== -1) {
    // 解析当前参与人数
    const parts = String(task.participants).split('/')
    const current = parseInt(parts[0]) + 1
    const max = parts[1] || '无限制'
    publishedTasks[taskIndex].participants = `${current}/${max}`
    localStorage.setItem('publishedTasks', JSON.stringify(publishedTasks))
    // 重新加载任务
    loadTasksFromIPFS()
  }

  // 判断是否已满
  if (isBiddingFull(task)) {
    alert('当前任务竞标人数已满')
    return
  }
  // 判断是否已参与
  if (myTasksIds.value.includes(task.id)) {
    alert('您已参与该任务')
    return
  }
  // 只保存必要字段，避免重复
  const myTasks = JSON.parse(localStorage.getItem('myTasks') || '[]')
  if (!myTasks.find(t => t.id === task.id)) {
    myTasks.push({
      ...task,
      wallet: walletAddress.value, // 添加钱包地址
      type: 'executed',
      status: 'bidding',
      statusText: '竞标中'
    })
    localStorage.setItem('myTasks', JSON.stringify(myTasks))
    myTasksIds.value.push(task.id)
  }
  closeTaskDetail()
  router.push({ path: '/profile', query: { tab: 'tasks' } })
}

// 修改：判断竞标是否已满
function isBiddingFull(task) {
  if (!task.participants) return false
  // 参与格式如 "3/5" 或 "2/无限制"
  const [current, max] = String(task.participants).split('/')
  if (!max || max === '无限制') return false
  return Number(current) >= Number(max)
}

// 修改：判断当前用户是否为任务发布者
function isTaskOwner(task) {
  return isConnected.value && task.employer === walletAddress.value;
}

// 用户钱包地址
const { walletAddress, isConnected } = useWallet()

// 清除本地测试数据
function clearLocalData() {
  // 清除本地存储的任务数据
  localStorage.removeItem('publishedTasks');
  localStorage.removeItem('myTasks');

  // 清空当前任务列表
  tasks.splice(0, tasks.length);

  // 重置筛选条件
  resetFilters();

  // 重新加载空任务列表
  isLoading.value = false;
  loadError.value = null;

  // 提示用户
  alert('本地测试数据已成功清除！');
}

// 确认清除操作
function confirmClearLocalData() {
  if (confirm('确定要清除所有本地测试数据吗？此操作不可撤销！')) {
    clearLocalData();
  }
}
</script>

<style scoped>
/* 只保留任务看板相关样式 */
.board-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  padding: 40px 0;
}

.board-sidebar {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 30px;
  height: fit-content;
}

.board-content {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 30px;
  min-height: 80vh;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.board-title {
  font-size: 1.8rem;
}

.filter-section {
  margin-bottom: 30px;
}

.filter-title {
  font-size: 1.1rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

.filter-item label {
  font-size: 0.95rem;
  cursor: pointer;
}

.filter-item .count {
  margin-left: auto;
  background-color: var(--background);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.reset-btn {
  width: 100%;
  margin-top: 20px;
  background-color: var(--background);
  border: 1px solid var(--border);
}

.reset-btn:hover {
  background-color: var(--border);
}

.stats-card {
  background: var(--purple-gradient);
  border-radius: var(--radius-lg);
  padding: 20px;
  color: white;
  margin-top: 30px;
}

.stats-title {
  font-size: 1.1rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-md);
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
}

/* 任务筛选栏 */
.filters-row {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  background-color: var(--background);
  padding: 15px;
  border-radius: var(--radius-md);
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
  /* 辅助功能 */
  /* 建议在模板中加 aria-label */
}

.search-box {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 8px 15px 8px 40px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background-color: var(--card-bg);
  font-size: 0.95rem;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
}

/* 简化任务卡片样式 */
.task-card {
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  height: 180px; /* 固定高度 */
  display: flex;
  flex-direction: column;
  /* 保持原有的 .task-card 样式属性 */
}

/* 角色标识 */
.role-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--primary);
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
}

/* 任务头部 */
.task-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.task-title {
  font-weight: 600;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.task-meta {
  display: flex;
  font-size: 0.8rem;
  color: #666;
  gap: 12px;
  margin-bottom: 8px;
}

/* 任务描述 */
.task-description {
  font-size: 0.9rem;
  line-height: 1.4;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 任务底部 */
.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

/* 任务网格布局 */
.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  color: var(--text-tertiary);
  margin-bottom: 20px;
}

.empty-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.empty-description {
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto 30px;
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.page-info {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 10px;
}

/* 新增：任务详情弹窗 */
.task-detail-modal {
  position: fixed;
  z-index: 9999;
  left: 0; top: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-mask {
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.35);
}

.modal-content {
  position: relative;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 900px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 2;
  padding: 0;
}

.modal-close {
  position: absolute;
  right: 18px;
  top: 18px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  z-index: 3;
}

.bidding-full-tip {
  color: var(--error);
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 10px;
}
.already-joined-tip {
  color: var(--success);
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 10px;
}

/* 新增雇主提示样式 */
.employer-tip {
  color: var(--warning);
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 10px;
}

/* 新增钱包未连接提示样式 */
.wallet-disconnected-tip {
  color: var(--warning);
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 10px;
}

/* 添加清除按钮样式 */
.btn-danger {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #c0392b, #a93226);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.25);
}

.btn-danger:active {
  transform: translateY(0);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .board-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .board-title {
    margin-bottom: 15px;
  }
}

/* 本文件未引入任何含eval相关用法的第三方库或自定义脚本。 */
</style>