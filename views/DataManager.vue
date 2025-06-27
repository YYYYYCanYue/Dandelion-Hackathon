<template>
  <div class="data-manager">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">数据管理中心</h1>
        <p class="text-gray-600">管理IPFS数据索引，创建和上传平台数据</p>
      </div>

      <!-- IPFS连接状态 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">IPFS连接状态</h2>
            <div class="flex items-center space-x-2">
              <div :class="[
                'w-3 h-3 rounded-full',
                ipfsConnected ? 'bg-green-500' : 'bg-red-500'
              ]"></div>
              <span :class="[
                'text-sm font-medium',
                ipfsConnected ? 'text-green-700' : 'text-red-700'
              ]">
                {{ ipfsConnected ? 'IPFS已连接' : 'IPFS未连接' }}
              </span>
            </div>
            <p v-if="ipfsStore.error" class="text-red-600 text-sm mt-1">
              {{ ipfsStore.error }}
            </p>
          </div>
          <button
            @click="checkIPFSConnection"
            :disabled="checking"
            class="btn-primary"
          >
            <div v-if="checking" class="loading-spinner mr-2"></div>
            {{ checking ? '检查中...' : '重新检查' }}
          </button>
        </div>
      </div>

      <!-- 数据同步管理 -->
      <div class="card-business rounded-2xl p-8 mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-neutral-900 mb-2">实时数据同步</h2>
            <p class="text-neutral-600">管理IPFS数据的实时同步设置和状态监控</p>
          </div>
          <div class="flex items-center space-x-3">
            <div :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              dataStore.syncStatus === 'syncing' ? 'bg-primary-100 text-primary-700' :
              dataStore.syncStatus === 'checking' ? 'bg-warning-100 text-warning-700' :
              dataStore.syncStatus === 'error' ? 'bg-error-100 text-error-700' :
              'bg-success-100 text-success-700'
            ]">
              {{ getSyncStatusText() }}
            </div>
            <button
              @click="toggleRealTimeSync"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                dataStore.realTimeSync.enabled 
                  ? 'bg-error-500 hover:bg-error-600 text-white' 
                  : 'bg-success-500 hover:bg-success-600 text-white'
              ]"
            >
              {{ dataStore.realTimeSync.enabled ? '停止同步' : '启动同步' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 同步状态面板 -->
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-neutral-800 mb-4">同步状态</h3>
              <div class="space-y-4">
                <!-- IPFS连接状态 -->
                <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div :class="[
                      'w-3 h-3 rounded-full',
                      ipfsStore.isConnected ? 'bg-success-500 animate-pulse' : 'bg-error-500'
                    ]"></div>
                    <div>
                      <div class="font-medium text-neutral-800">IPFS连接</div>
                      <div class="text-sm text-neutral-600">
                        {{ ipfsStore.isConnected ? '已连接' : '连接失败' }}
                      </div>
                    </div>
                  </div>
                  <div class="text-right text-sm text-neutral-600">
                    <div>延迟: {{ ipfsStore.networkLatency }}ms</div>
                    <div>节点: {{ ipfsStore.networkStatus.peers }}</div>
                  </div>
                </div>

                <!-- 数据同步状态 -->
                <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <svg 
                      :class="[
                        'w-5 h-5',
                        dataStore.isSyncing ? 'animate-spin text-primary-600' : 
                        dataStore.syncStatus === 'error' ? 'text-error-600' :
                        'text-success-600'
                      ]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <div>
                      <div class="font-medium text-neutral-800">数据同步</div>
                      <div class="text-sm text-neutral-600">
                        {{ getSyncStatusText() }}
                      </div>
                    </div>
                  </div>
                  <div class="text-right text-sm text-neutral-600">
                    <div>任务: {{ dataStore.tasks.length }}</div>
                    <div>用户: {{ Object.keys(dataStore.userProfiles).length }}</div>
                  </div>
                </div>

                <!-- 缓存状态 -->
                <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                    </svg>
                    <div>
                      <div class="font-medium text-neutral-800">数据缓存</div>
                      <div class="text-sm text-neutral-600">
                        使用率: {{ ipfsStore.cacheUsage }}%
                      </div>
                    </div>
                  </div>
                  <div class="text-right text-sm text-neutral-600">
                    <div>命中: {{ ipfsStore.stats.cacheHits }}</div>
                    <div>未命中: {{ ipfsStore.stats.cacheMisses }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 同步历史 -->
            <div>
              <h3 class="text-lg font-semibold text-neutral-800 mb-4">同步历史</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-neutral-600">最后检查</span>
                  <span class="font-medium">{{ formatLastCheck() }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-neutral-600">最后同步</span>
                  <span class="font-medium">{{ formatLastSync() }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-neutral-600">数据索引</span>
                  <span class="font-mono text-xs text-neutral-500">
                    {{ dataStore.dataIndexHash ? dataStore.dataIndexHash.slice(0, 16) + '...' : '无' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 同步设置面板 -->
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-neutral-800 mb-4">同步设置</h3>
              <div class="space-y-4">
                <!-- 同步间隔设置 -->
                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-2">
                    检查间隔 (秒)
                  </label>
                  <div class="flex items-center space-x-3">
                    <input
                      v-model.number="syncInterval"
                      type="number"
                      min="10"
                      max="3600"
                      step="10"
                      class="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                    <button
                      @click="updateSyncInterval"
                      class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                    >
                      应用
                    </button>
                  </div>
                  <p class="text-xs text-neutral-500 mt-1">
                    建议设置为30-300秒之间，过短可能影响性能
                  </p>
                </div>

                <!-- 自动同步开关 -->
                <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <div class="font-medium text-neutral-800">自动同步</div>
                    <div class="text-sm text-neutral-600">检测到新数据时自动同步</div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="autoSync"
                      type="checkbox"
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <!-- 缓存管理 -->
                <div class="space-y-3">
                  <div class="font-medium text-neutral-800">缓存管理</div>
                  <div class="flex space-x-2">
                    <button
                      @click="clearCache"
                      class="flex-1 px-4 py-2 bg-warning-500 hover:bg-warning-600 text-white rounded-lg transition-colors"
                    >
                      清空缓存
                    </button>
                    <button
                      @click="resetStats"
                      class="flex-1 px-4 py-2 bg-neutral-500 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                    >
                      重置统计
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 手动操作 -->
            <div>
              <h3 class="text-lg font-semibold text-neutral-800 mb-4">手动操作</h3>
              <div class="space-y-3">
                <button
                  @click="forceSyncData"
                  :disabled="dataStore.isSyncing"
                  class="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white rounded-lg transition-colors font-medium"
                >
                  {{ dataStore.isSyncing ? '同步中...' : '立即同步数据' }}
                </button>
                <button
                  @click="checkIPFSConnection"
                  :disabled="checking"
                  class="w-full px-4 py-3 bg-info-500 hover:bg-info-600 disabled:bg-neutral-300 text-white rounded-lg transition-colors font-medium"
                >
                  {{ checking ? '检查中...' : '检查IPFS连接' }}
                </button>
                <button
                  @click="refreshData"
                  class="w-full px-4 py-3 bg-success-500 hover:bg-success-600 text-white rounded-lg transition-colors font-medium"
                >
                  刷新本地数据
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前数据索引 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">当前数据索引</h2>
        <div v-if="dataStore.dataIndexHash" class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">索引哈希:</span>
              <button
                @click="copyToClipboard(dataStore.dataIndexHash)"
                class="text-blue-600 hover:text-blue-700 text-sm"
              >
                复制
              </button>
            </div>
            <code class="text-sm text-gray-600 break-all">{{ dataStore.dataIndexHash }}</code>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-blue-600">{{ dataStore.tasks.length }}</div>
              <div class="text-sm text-blue-700">任务数量</div>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-green-600">{{ Object.keys(dataStore.bids).length }}</div>
              <div class="text-sm text-green-700">竞标组数</div>
            </div>
            <div class="bg-yellow-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-yellow-600">{{ dataStore.disputes.length }}</div>
              <div class="text-sm text-yellow-700">争议数量</div>
            </div>
            <div class="bg-purple-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-purple-600">{{ Object.keys(dataStore.userProfiles).length }}</div>
              <div class="text-sm text-purple-700">用户资料</div>
            </div>
          </div>
          
          <div class="flex space-x-4">
            <button
              @click="refreshData"
              :disabled="dataStore.loading"
              class="btn-primary"
            >
              <div v-if="dataStore.loading" class="loading-spinner mr-2"></div>
              {{ dataStore.loading ? '刷新中...' : '刷新数据' }}
            </button>
            <button
              @click="clearDataIndex"
              class="btn-outline border-red-200 text-red-600 hover:bg-red-50"
            >
              清除索引
            </button>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">没有数据索引</h3>
          <p class="mt-1 text-sm text-gray-500">创建新的数据索引或导入现有索引</p>
        </div>
      </div>

      <!-- 数据操作 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 创建示例数据 -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">创建示例数据</h2>
          <p class="text-gray-600 mb-6">创建一些示例任务、竞标和用户数据用于测试</p>
          
          <div class="space-y-4">
            <button
              @click="createSampleData"
              :disabled="creating"
              class="w-full btn-primary"
            >
              <div v-if="creating" class="loading-spinner mr-2"></div>
              {{ creating ? '创建中...' : '创建示例数据' }}
            </button>
            
            <div v-if="createResult" class="p-4 rounded-lg" :class="[
              createResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            ]">
              <p class="text-sm">{{ createResult.message }}</p>
              <div v-if="createResult.success && createResult.hash" class="mt-2">
                <code class="text-xs break-all">{{ createResult.hash }}</code>
              </div>
            </div>
          </div>
        </div>

        <!-- 导入数据索引 -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">导入数据索引</h2>
          <p class="text-gray-600 mb-6">输入IPFS哈希来导入现有的数据索引</p>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                IPFS哈希
              </label>
              <input
                v-model="importHash"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx"
              >
            </div>
            
            <button
              @click="importDataIndex"
              :disabled="importing || !importHash.trim()"
              class="w-full btn-secondary"
            >
              <div v-if="importing" class="loading-spinner mr-2"></div>
              {{ importing ? '导入中...' : '导入数据索引' }}
            </button>
            
            <div v-if="importResult" class="p-4 rounded-lg" :class="[
              importResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            ]">
              <p class="text-sm">{{ importResult.message }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据详情 -->
      <div v-if="dataStore.dataIndexHash" class="mt-8">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">数据详情</h2>
            <div class="flex space-x-2">
              <button
                @click="activeTab = 'tasks'"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeTab === 'tasks' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                任务 ({{ dataStore.tasks.length }})
              </button>
              <button
                @click="activeTab = 'bids'"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeTab === 'bids' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                竞标 ({{ Object.keys(dataStore.bids).length }})
              </button>
              <button
                @click="activeTab = 'profiles'"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeTab === 'profiles' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                用户 ({{ Object.keys(dataStore.userProfiles).length }})
              </button>
            </div>
          </div>

          <!-- 任务列表 -->
          <div v-if="activeTab === 'tasks'" class="space-y-4">
            <div v-if="dataStore.tasks.length === 0" class="text-center py-8 text-gray-500">
              暂无任务数据
            </div>
            <div
              v-for="task in dataStore.tasks"
              :key="task.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ task.title }}</h3>
                  <p class="text-sm text-gray-600 mt-1">{{ task.description.substring(0, 100) }}...</p>
                  <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>奖金: {{ formatBalance(task.reward) }} AVAX</span>
                    <span>状态: {{ getStatusText(task.status) }}</span>
                    <span>类型: {{ getTypeText(task.taskType) }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-gray-500">ID: {{ task.id }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(task.createdAt) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 竞标列表 -->
          <div v-if="activeTab === 'bids'" class="space-y-4">
            <div v-if="Object.keys(dataStore.bids).length === 0" class="text-center py-8 text-gray-500">
              暂无竞标数据
            </div>
            <div
              v-for="(bids, taskId) in dataStore.bids"
              :key="taskId"
              class="border border-gray-200 rounded-lg p-4"
            >
              <h3 class="font-medium text-gray-900 mb-3">任务 #{{ taskId }} 的竞标 ({{ bids.length }})</h3>
              <div class="space-y-2">
                <div
                  v-for="bid in bids"
                  :key="bid.id"
                  class="bg-gray-50 rounded-lg p-3"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="text-sm font-medium text-gray-900">
                        {{ formatAddress(bid.bidder) }}
                        <span v-if="bid.isWinner" class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          中标
                        </span>
                      </div>
                      <p class="text-sm text-gray-600 mt-1">{{ bid.proposal.substring(0, 80) }}...</p>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ formatDate(bid.timestamp) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 用户资料列表 -->
          <div v-if="activeTab === 'profiles'" class="space-y-4">
            <div v-if="Object.keys(dataStore.userProfiles).length === 0" class="text-center py-8 text-gray-500">
              暂无用户资料
            </div>
            <div
              v-for="(profile, address) in dataStore.userProfiles"
              :key="address"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ formatAddress(profile.address) }}</h3>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                    <div>
                      <span class="text-gray-500">角色:</span>
                      <span class="ml-1 text-gray-900">{{ profile.role || '未设置' }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">评分:</span>
                      <span class="ml-1 text-gray-900">{{ profile.rating || 'N/A' }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">完成任务:</span>
                      <span class="ml-1 text-gray-900">{{ profile.completedTasks || 0 }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">收益:</span>
                      <span class="ml-1 text-gray-900">{{ profile.totalEarnings || '0' }} AVAX</span>
                    </div>
                  </div>
                </div>
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
import { useDataStore } from '@/stores/data'
import { useIpfsStore } from '@/stores/ipfs'

const dataStore = useDataStore()
const ipfsStore = useIpfsStore()

// 响应式数据
const checking = ref(false)
const creating = ref(false)
const importing = ref(false)
const importHash = ref('')
const createResult = ref(null)
const importResult = ref(null)
const activeTab = ref('tasks')
const syncInterval = ref(30)
const autoSync = ref(true)

// 计算属性
const ipfsConnected = computed(() => {
  return ipfsStore.client && !ipfsStore.error
})

const filteredTasks = computed(() => {
  if (!searchQuery.value) return dataStore.tasks
  return dataStore.tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 方法
const checkIPFSConnection = async () => {
  checking.value = true
  try {
    const isConnected = await ipfsStore.checkNetworkStatus()
    alert(isConnected ? 'IPFS连接正常' : 'IPFS连接失败')
  } catch (error) {
    alert('检查IPFS连接时出错: ' + error.message)
  } finally {
    checking.value = false
  }
}

const refreshData = async () => {
  try {
    await dataStore.initializeData()
    alert('数据刷新完成')
  } catch (error) {
    console.error('刷新数据失败:', error)
    alert('数据刷新失败: ' + error.message)
  }
}

const clearDataIndex = () => {
  if (confirm('确定要清除数据索引吗？这将删除所有本地数据引用。')) {
    dataStore.clearLocalDataIndex()
    createResult.value = null
    importResult.value = null
    console.log('数据索引已清除')
  }
}

const createSampleData = async () => {
  creating.value = true
  createResult.value = null
  
  try {
    // 创建示例任务数据
    const sampleTasks = [
      {
        id: Date.now(),
        title: 'DeFi协议前端开发',
        description: '开发一个现代化的DeFi借贷协议前端界面，包括存款、借款、清算等功能模块。要求使用React和Web3.js技术栈，响应式设计，支持移动端。',
        reward: '15.5',
        status: 0,
        taskType: 0,
        participants: 0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        creator: '0x1234567890123456789012345678901234567890',
        attachments: []
      },
      {
        id: Date.now() + 1,
        title: 'NFT市场UI设计',
        description: '为NFT交易平台设计完整的用户界面，包括市场首页、作品展示、用户个人页面等。需要提供Figma设计稿和交互原型。',
        reward: '8.0',
        status: 0,
        taskType: 1,
        participants: 0,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        creator: '0x2345678901234567890123456789012345678901',
        attachments: []
      },
      {
        id: Date.now() + 2,
        title: '区块链数据分析',
        description: '分析以太坊和BSC链上DeFi协议的TVL变化趋势，提供详细的数据分析报告和可视化图表。',
        reward: '12.0',
        status: 0,
        taskType: 2,
        participants: 0,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        creator: '0x3456789012345678901234567890123456789012',
        attachments: []
      }
    ]

    // 创建示例竞标数据
    const sampleBids = {}

    // 创建示例用户资料
    const sampleProfiles = {
      '0x1234567890123456789012345678901234567890': {
        address: '0x1234567890123456789012345678901234567890',
        role: '雇主',
        rating: 4.8,
        reviewCount: 24,
        publishedTasks: 8,
        completedTasks: 15,
        totalEarnings: '45.2',
        successRate: 92,
        joinedAt: new Date().toISOString()
      },
      '0x2345678901234567890123456789012345678901': {
        address: '0x2345678901234567890123456789012345678901',
        role: '开发者',
        rating: 4.6,
        reviewCount: 18,
        publishedTasks: 2,
        completedTasks: 12,
        totalEarnings: '32.8',
        successRate: 89,
        joinedAt: new Date().toISOString()
      }
    }

    // 上传数据到IPFS
    const [tasksHash, bidsHash, disputesHash, profilesHash] = await Promise.all([
      ipfsStore.uploadJSON(sampleTasks),
      ipfsStore.uploadJSON(sampleBids),
      ipfsStore.uploadJSON([]), // 空的争议数据
      ipfsStore.uploadJSON(sampleProfiles)
    ])

    // 创建数据索引
    const dataIndex = {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      tasksHash,
      usersHash: null,
      disputesHash,
      bidsHash,
      profilesHash
    }

    // 上传数据索引
    const indexHash = await ipfsStore.uploadJSON(dataIndex)
    
    // 保存索引并加载数据
    localStorage.setItem('dandelion_data_index', indexHash)
    dataStore.dataIndexHash = indexHash
    
    // 设置数据
    dataStore.tasks = sampleTasks
    dataStore.bids = sampleBids
    dataStore.disputes = []
    dataStore.userProfiles = sampleProfiles
    dataStore.updateStats()

    createResult.value = {
      success: true,
      message: '示例数据创建成功！',
      hash: indexHash
    }

  } catch (error) {
    console.error('创建示例数据失败:', error)
    createResult.value = {
      success: false,
      message: '创建失败: ' + error.message
    }
  } finally {
    creating.value = false
  }
}

const importDataIndex = async () => {
  importing.value = true
  importResult.value = null
  
  try {
    // 验证哈希格式
    if (!importHash.value.trim().startsWith('Qm') && !importHash.value.trim().startsWith('bafy')) {
      throw new Error('无效的IPFS哈希格式')
    }

    // 尝试加载数据索引
    const dataIndex = await ipfsStore.getJSON(importHash.value.trim())
    
    // 验证数据索引结构
    if (!dataIndex.version) {
      throw new Error('无效的数据索引格式')
    }

    // 保存索引并加载数据
    localStorage.setItem('dandelion_data_index', importHash.value.trim())
    dataStore.dataIndexHash = importHash.value.trim()
    
    await dataStore.loadDataFromIndex()
    
    importResult.value = {
      success: true,
      message: '数据索引导入成功！'
    }
    
    importHash.value = ''

  } catch (error) {
    console.error('导入数据索引失败:', error)
    importResult.value = {
      success: false,
      message: '导入失败: ' + error.message
    }
  } finally {
    importing.value = false
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    // 备用方法
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('已复制到剪贴板')
  }
}

const getStatusText = (status) => {
  const statusMap = {
    0: '开放竞标',
    1: '进行中',
    2: '等待确认',
    3: '已完成',
    4: '已取消'
  }
  return statusMap[status] || '未知'
}

const getTypeText = (type) => {
  const typeMap = {
    0: 'Web3开发',
    1: 'UI/UX设计',
    2: '数据分析',
    3: '内容创作',
    4: '市场推广',
    5: '其他'
  }
  return typeMap[type] || '其他'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
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

// 格式化地址显示
const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// 获取同步状态文本
const getSyncStatusText = () => {
  switch (dataStore.syncStatus) {
    case 'checking':
      return '检查中'
    case 'syncing':
      return '同步中'
    case 'error':
      return '错误'
    case 'idle':
    default:
      return dataStore.hasNewUpdates ? '有更新' : '已同步'
  }
}

// 格式化时间显示
const formatLastCheck = () => {
  const lastCheck = dataStore.realTimeSync.lastCheck
  if (!lastCheck) return '从未'
  
  const now = new Date()
  const diff = now - new Date(lastCheck)
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  
  const days = Math.floor(hours / 24)
  return `${days}天前`
}

const formatLastSync = () => {
  const lastSync = dataStore.realTimeSync.lastSync
  if (!lastSync) return '从未'
  
  const now = new Date()
  const diff = now - new Date(lastSync)
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  
  const days = Math.floor(hours / 24)
  return `${days}天前`
}

// 实时同步相关方法
const toggleRealTimeSync = () => {
  if (dataStore.realTimeSync.enabled) {
    dataStore.stopRealTimeSync()
  } else {
    dataStore.startRealTimeSync()
  }
}

const updateSyncInterval = () => {
  if (syncInterval.value < 10 || syncInterval.value > 3600) {
    alert('同步间隔必须在10-3600秒之间')
    return
  }
  
  dataStore.setSyncInterval(syncInterval.value * 1000)
  alert('同步间隔已更新')
}

const forceSyncData = async () => {
  try {
    await dataStore.forceSyncData()
    alert('数据同步完成')
  } catch (error) {
    console.error('同步失败:', error)
    alert('数据同步失败: ' + error.message)
  }
}

const clearCache = () => {
  if (confirm('确定要清空所有缓存数据吗？这将影响数据加载速度。')) {
    ipfsStore.clearCache()
    alert('缓存已清空')
  }
}

const resetStats = () => {
  if (confirm('确定要重置统计数据吗？')) {
    ipfsStore.resetStats()
    alert('统计数据已重置')
  }
}

onMounted(async () => {
  await checkIPFSConnection()
})
</script>

<style scoped>
.data-manager {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 75%, #ffffff 100%);
}
</style> 