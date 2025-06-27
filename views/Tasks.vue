<template>
  <div class="tasks-page min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20">
    <!-- 页面头部 -->
    <div class="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden dark-section">
      <div class="absolute inset-0 bg-hero-pattern opacity-10"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold mb-2 text-on-dark-bright animate-fade-in-up">
            任务大厅
          </h1>
          <span class="block text-2xl md:text-3xl font-medium mt-2 text-on-dark-secondary animate-fade-in-up" style="animation-delay: 0.2s;">
            发现机会，实现价值
          </span>
        </div>

        <!-- 统计数据 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div class="text-center animate-fade-in-up" style="animation-delay: 0.3s;">
            <div class="text-3xl font-bold text-on-dark-bright mb-2">{{ stats.totalTasks }}</div>
            <div class="text-sm text-on-dark-muted">总任务数</div>
          </div>
          <div class="text-center animate-fade-in-up" style="animation-delay: 0.4s;">
            <div class="text-3xl font-bold text-on-dark-bright mb-2">{{ stats.activeTasks }}</div>
            <div class="text-sm text-on-dark-muted">进行中</div>
          </div>
          <div class="text-center animate-fade-in-up" style="animation-delay: 0.5s;">
            <div class="text-3xl font-bold text-on-dark-bright mb-2">{{ stats.completedTasks }}</div>
            <div class="text-sm text-on-dark-muted">已完成</div>
          </div>
          <div class="text-center animate-fade-in-up" style="animation-delay: 0.6s;">
            <div class="text-3xl font-bold text-gradient-gold-light mb-2">{{ stats.totalRewards }}</div>
            <div class="text-sm text-on-dark-muted">总奖金池</div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex gap-8">
        <!-- 左侧筛选器 -->
        <div class="w-80 flex-shrink-0">
          <div class="card-business rounded-2xl p-6 shadow-business-lg sticky top-24">
            <h3 class="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              筛选条件
            </h3>

          <!-- 搜索框 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-neutral-700 mb-2">搜索</label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                  placeholder="搜索任务..."
                  class="input-business pl-10 text-sm"
              />
            </div>
          </div>
          
            <!-- 任务状态 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-neutral-700 mb-3">任务状态</label>
              <div class="space-y-2">
                <label v-for="status in statusOptions" :key="status.value" class="flex items-center">
                  <input
              v-model="selectedStatus"
                    :value="status.value"
                    type="radio"
                    class="h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                  />
                  <span class="ml-2 text-sm text-neutral-700">{{ status.label }}</span>
                </label>
              </div>
            </div>

            <!-- 任务类型 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-neutral-700 mb-3">任务类型</label>
              <div class="space-y-2">
                <label v-for="type in typeOptions" :key="type.value" class="flex items-center">
                  <input
                    v-model="selectedTypes"
                    :value="type.value"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500 rounded"
                  />
                  <span class="ml-2 text-sm text-neutral-700">{{ type.label }}</span>
                </label>
              </div>
            </div>

            <!-- 奖金范围 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-neutral-700 mb-3">奖金范围 (AVAX)</label>
              <div class="grid grid-cols-2 gap-2">
                <input
                  v-model="rewardRange.min"
                  type="number"
                  placeholder="最小"
                  class="input-business text-sm"
                />
                <input
                  v-model="rewardRange.max"
                  type="number"
                  placeholder="最大"
                  class="input-business text-sm"
                />
              </div>
            </div>

            <!-- 截止时间 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-neutral-700 mb-3">截止时间</label>
              <select v-model="deadlineFilter" class="input-business text-sm w-full">
                <option value="all">全部</option>
                <option value="today">今天截止</option>
                <option value="week">本周截止</option>
                <option value="month">本月截止</option>
            </select>
            </div>

            <!-- 参与人数 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-neutral-700 mb-3">参与人数</label>
              <select v-model="participantsFilter" class="input-business text-sm w-full">
                <option value="all">全部</option>
                <option value="low">少于5人</option>
                <option value="medium">5-15人</option>
                <option value="high">超过15人</option>
            </select>
            </div>

            <!-- 排序 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-neutral-700 mb-3">排序方式</label>
              <select v-model="sortBy" class="input-business text-sm w-full">
              <option value="latest">最新发布</option>
              <option value="reward_high">奖金最高</option>
                <option value="reward_low">奖金最低</option>
              <option value="deadline">截止时间</option>
              <option value="participants">参与人数</option>
            </select>
            </div>

            <!-- 清空筛选 -->
            <button
              @click="clearFilters"
              class="w-full btn-outline text-sm py-2"
            >
              清空筛选
            </button>
          </div>
        </div>

        <!-- 右侧任务列表 -->
        <div class="flex-1">
          <!-- 结果统计 -->
          <div class="mb-6 flex items-center justify-between">
            <div class="text-neutral-600">
              找到 <span class="font-semibold text-neutral-900">{{ filteredTasksCount }}</span> 个任务
            </div>
            <div class="text-sm text-neutral-500">
              第 {{ currentPage }} 页，共 {{ totalPages }} 页
        </div>
      </div>

          <!-- 极简任务卡片网格 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <div
              v-for="(task, index) in paginatedTasks"
          :key="task.id"
              class="card-business rounded-xl p-4 shadow-business hover:shadow-business-lg transition-all duration-300 card-hover animate-fade-in-up cursor-pointer"
              :style="`animation-delay: ${index * 0.05}s`"
              @click="viewTaskDetail(task.id)"
            >
              <!-- 状态和类型标签 -->
              <div class="flex items-center justify-between mb-3">
                <span :class="getStatusClass(task.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ getStatusText(task.status) }}
                  </span>
                <span :class="getTypeClass(task.taskType)" class="px-2 py-1 rounded-lg text-xs font-medium">
                    {{ getTypeText(task.taskType) }}
                  </span>
              </div>
              
              <!-- 任务标题 -->
              <h3 class="text-lg font-bold text-neutral-900 mb-2 line-clamp-2 hover:text-primary-700 transition-colors">
                {{ task.title }}
              </h3>

              <!-- 任务描述 -->
              <p class="text-sm text-neutral-600 mb-3 line-clamp-2">
                {{ task.description }}
              </p>
              
              <!-- 奖金和参与人数 -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                  <span class="text-lg font-bold gold-text">{{ formatBalance(task.reward) }}</span>
                  <span class="text-xs text-neutral-500">AVAX</span>
                </div>
                <div class="flex items-center gap-1 text-xs text-neutral-500">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  {{ task.participants }}人参与
                </div>
              </div>
              
              <!-- 截止时间 -->
              <div class="flex items-center gap-1 text-xs text-neutral-500">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                {{ getTimeRemaining(task.deadline) }}
              </div>
            </div>
              </div>
              
          <!-- 分页器 -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
                <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                currentPage === 1 
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                  : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-700 shadow-sm'
              ]"
            >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                
            <div class="flex gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  page === currentPage
                    ? 'business-gradient text-white shadow-business'
                    : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-700 shadow-sm'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                currentPage === totalPages 
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                  : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-700 shadow-sm'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
      </div>
      
      <!-- 空状态 -->
          <div v-if="filteredTasksCount === 0" class="text-center py-20 animate-fade-in">
        <div class="w-32 h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg class="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-neutral-900 mb-4">暂无匹配的任务</h3>
        <p class="text-neutral-600 mb-8 max-w-md mx-auto">
          尝试调整筛选条件或搜索关键词，或者
          <router-link to="/create-task" class="text-primary-600 hover:text-primary-700 font-medium">
            发布一个新任务
          </router-link>
        </p>
      </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/data'

const router = useRouter()
const dataStore = useDataStore()

// 响应式数据
const loading = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedTypes = ref([])
const rewardRange = ref({ min: '', max: '' })
const deadlineFilter = ref('all')
const participantsFilter = ref('all')
const sortBy = ref('latest')

// 分页相关
const currentPage = ref(1)
const pageSize = 15

// 任务状态映射
const statusMap = {
  0: '开放竞标',
  1: '进行中', 
  2: '等待确认',
  3: '已完成',
  4: '已取消'
}

// 任务类型映射
const typeMap = {
  0: 'Web3开发',
  1: 'UI/UX设计',
  2: '数据分析',
  3: '内容创作',
  4: '市场推广',
  5: '其他'
}

// 筛选选项
const statusOptions = [
  { value: 'all', label: '全部状态' },
  { value: '0', label: '开放竞标' },
  { value: '1', label: '进行中' },
  { value: '2', label: '等待确认' },
  { value: '3', label: '已完成' }
]

const typeOptions = [
  { value: 0, label: 'Web3开发' },
  { value: 1, label: 'UI/UX设计' },
  { value: 2, label: '数据分析' },
  { value: 3, label: '内容创作' },
  { value: 4, label: '市场推广' },
  { value: 5, label: '其他' }
]

// 计算属性 - 从dataStore获取过滤后的任务
const filteredTasks = computed(() => {
  let tasks = [...dataStore.tasks]

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    tasks = tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.requirements.toLowerCase().includes(query)
    )
  }

  // 状态过滤
  if (selectedStatus.value !== 'all') {
    tasks = tasks.filter(task => task.status === parseInt(selectedStatus.value))
  }

  // 类型过滤
  if (selectedTypes.value.length > 0) {
    tasks = tasks.filter(task => selectedTypes.value.includes(task.taskType.toString()))
  }

  // 奖金范围过滤
  if (rewardRange.value.min) {
    tasks = tasks.filter(task => parseFloat(task.reward) >= parseFloat(rewardRange.value.min))
  }
  if (rewardRange.value.max) {
    tasks = tasks.filter(task => parseFloat(task.reward) <= parseFloat(rewardRange.value.max))
  }

  // 截止时间过滤
  if (deadlineFilter.value !== 'all') {
    const now = new Date()
    tasks = tasks.filter(task => {
      const deadline = new Date(task.deadline)
      switch (deadlineFilter.value) {
        case 'today':
          return deadline.toDateString() === now.toDateString()
        case 'week':
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          return deadline <= weekFromNow
        case 'month':
          const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          return deadline <= monthFromNow
        default:
          return true
      }
    })
  }

  // 参与人数过滤
  if (participantsFilter.value !== 'all') {
    tasks = tasks.filter(task => {
      const participants = task.participants || 0
      switch (participantsFilter.value) {
        case 'low':
          return participants < 5
        case 'medium':
          return participants >= 5 && participants <= 15
        case 'high':
          return participants > 15
        default:
          return true
      }
    })
  }

  // 排序
  switch (sortBy.value) {
    case 'reward_high':
      tasks.sort((a, b) => parseFloat(b.reward) - parseFloat(a.reward))
      break
    case 'reward_low':
      tasks.sort((a, b) => parseFloat(a.reward) - parseFloat(b.reward))
      break
    case 'deadline':
      tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      break
    case 'participants':
      tasks.sort((a, b) => (b.participants || 0) - (a.participants || 0))
      break
    case 'latest':
    default:
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
  }

  return tasks
})

// 分页相关计算属性
const filteredTasksCount = computed(() => filteredTasks.value.length)
const totalPages = computed(() => Math.ceil(filteredTasksCount.value / pageSize))

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredTasks.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, '...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    }
  }
  
  return pages.filter(p => p !== '...' || pages.indexOf(p) === pages.lastIndexOf(p))
})

// 统计数据 - 从dataStore获取
const stats = computed(() => dataStore.stats)

// 方法
const loadTasks = async () => {
  if (dataStore.tasks.length === 0) {
    loading.value = true
    try {
      await dataStore.initializeData()
    } catch (error) {
      console.error('加载任务失败:', error)
    } finally {
      loading.value = false
    }
  }
}

const viewTaskDetail = (taskId) => {
  router.push(`/task/${taskId}`)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getStatusClass = (status) => {
  const statusClasses = {
    0: 'bg-green-100 text-green-800',
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-gray-100 text-gray-800',
    4: 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const getTypeClass = (type) => {
  const typeClasses = {
    0: 'bg-purple-100 text-purple-800', // Web3开发
    1: 'bg-pink-100 text-pink-800',     // UI/UX设计
    2: 'bg-indigo-100 text-indigo-800', // 数据分析
    3: 'bg-orange-100 text-orange-800', // 内容创作
    4: 'bg-blue-100 text-blue-800',     // 市场推广
    5: 'bg-gray-100 text-gray-800'      // 其他
  }
  return typeClasses[type] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  return statusMap[status] || '未知状态'
}

const getTypeText = (type) => {
  return typeMap[type] || '其他'
}

// 格式化余额显示
const formatBalance = (balance) => {
  if (!balance || balance === '0') return '0'
  
  const num = parseFloat(balance)
  
  // 如果小于 0.01，显示完整精度但最多4位小数
  if (num < 0.01) {
    return num.toFixed(4).replace(/\.?0+$/, '')
  }
  
  // 如果小于 1，显示3位小数
  if (num < 1) {
    return num.toFixed(3).replace(/\.?0+$/, '')
  }
  
  // 如果小于 1000，显示2位小数
  if (num < 1000) {
    return num.toFixed(2).replace(/\.?0+$/, '')
  }
  
  // 如果大于等于 1000，使用K单位
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.?0+$/, '') + 'M'
  }
  
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.?0+$/, '') + 'K'
  }
  
  return num.toFixed(2).replace(/\.?0+$/, '')
}

const getTimeRemaining = (deadline) => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const timeDiff = deadlineDate - now
  
  if (timeDiff <= 0) {
    return '已截止'
  }
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) {
    return `${days}天${hours}小时`
  } else if (hours > 0) {
    return `${hours}小时`
  } else {
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    return `${minutes}分钟`
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedTypes.value = []
  rewardRange.value = { min: '', max: '' }
  deadlineFilter.value = 'all'
  participantsFilter.value = 'all'
  sortBy.value = 'latest'
  currentPage.value = 1
}

// 监听筛选条件变化，重置到第一页
const resetToFirstPage = () => {
  currentPage.value = 1
}

// 监听筛选条件变化
import { watch } from 'vue'
watch([searchQuery, selectedStatus, selectedTypes, rewardRange, deadlineFilter, participantsFilter, sortBy], resetToFirstPage, { deep: true })

onMounted(async () => {
  // 确保数据已初始化
  if (!dataStore.initialized) {
    await dataStore.initializeData()
  }
  
  // 监听数据更新事件
  window.addEventListener('dandelion:dataUpdated', handleDataUpdated)
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('dandelion:dataUpdated', handleDataUpdated)
})

// 处理数据更新事件
const handleDataUpdated = (event) => {
  console.log('任务页面检测到数据更新:', event.detail)
  
  // 可以在这里添加新任务提醒或其他通知
  const newTasksCount = event.detail.tasksCount
  if (newTasksCount > dataStore.tasks.length) {
    console.log('检测到新任务!')
    // 这里可以显示通知或其他UI反馈
  }
}
</script>

<style scoped>
/* 任务列表页面特定样式 */
.tasks-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 75%, #ffffff 100%);
}

.filter-sidebar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 232, 240, 0.3);
  box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.1), 0 4px 6px -2px rgba(30, 58, 138, 0.05);
  border-radius: 1rem;
  padding: 1.5rem;
  height: fit-content;
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.filter-input:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.task-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 232, 240, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.task-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.task-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(30, 58, 138, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.05);
}

.task-card:hover::before {
  transform: scaleX(1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 自定义滚动条样式 */
.sticky {
  position: sticky;
}

/* 确保卡片网格在不同屏幕尺寸下的响应式 */
@media (max-width: 1024px) {
  .xl\:grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .tasks-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .tasks-grid {
    grid-template-columns: 1fr;
  }
}
</style> 