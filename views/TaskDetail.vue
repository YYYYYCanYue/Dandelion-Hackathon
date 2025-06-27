<template>
  <div class="task-detail">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">加载任务详情中...</p>
      </div>
    </div>

    <div v-else-if="!task" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">任务不存在</h3>
        <p class="mt-1 text-sm text-gray-500">请检查任务ID是否正确</p>
        <router-link to="/tasks" class="mt-4 btn-primary">
          返回任务大厅
        </router-link>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 任务基本信息 -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div class="px-6 py-8">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-4">
                <span :class="getStatusClass(task.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ getStatusText(task.status) }}
                </span>
                <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  {{ getTypeText(task.taskType) }}
                </span>
                <span class="text-sm text-gray-500">
                  发布于 {{ formatDate(task.createdAt) }}
                </span>
              </div>
              
              <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ task.title }}</h1>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">任务奖金</div>
                    <div class="text-lg font-semibold text-gray-900">{{ formatBalance(task.reward) }} AVAX</div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 8V9m0 2v2m0 0v2m0-2h2m-2 0H8"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">截止时间</div>
                    <div class="text-lg font-semibold text-gray-900">{{ formatDate(task.deadline) }}</div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">参与人数</div>
                    <div class="text-lg font-semibold text-gray-900">{{ task.participants }} 人</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="ml-8 flex-shrink-0">
              <div class="text-center mb-6">
                <div class="text-4xl font-bold text-primary-600">{{ formatBalance(task.reward) }}</div>
                <div class="text-lg text-gray-500">AVAX</div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <svg class="w-5 h-5 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">我的身份</div>
                    <div class="text-lg font-semibold" :class="{
                      'text-primary-600': userRole === 'employer',
                      'text-secondary-600': userRole === 'assignee',
                      'text-info-600': userRole === 'bidder',
                      'text-gray-600': ['visitor', 'guest'].includes(userRole)
                    }">{{ userRoleText }}</div>
                  </div>
                </div>
                
                <!-- 权限控制的操作按钮 -->
                <button
                  v-if="userPermissions.canBid"
                  @click="showBidModal = true"
                  :disabled="!web3Store.isConnected"
                  class="w-full btn-primary"
                >
                  {{ web3Store.isConnected ? '参与竞标' : '请先连接钱包' }}
                </button>
                
                <button
                  v-if="userPermissions.canSelectWinner"
                  @click="showWinnerModal = true"
                  class="w-full btn-secondary"
                >
                  选择中标者
                </button>
                
                <button
                  v-if="userPermissions.canConfirmCompletion"
                  @click="confirmTask(true)"
                  class="w-full btn-primary"
                >
                  确认任务完成
                </button>
                
                <button
                  v-if="userPermissions.canSubmitWork"
                  @click="submitWork"
                  class="w-full btn-secondary"
                >
                  提交工作成果
                </button>
                
                <button
                  v-if="userRole === 'assignee' && task.status === 2"
                  @click="confirmTask(false)"
                  class="w-full btn-outline border-red-200 text-red-600 hover:bg-red-50"
                >
                  申请修改
                </button>
                
                <button
                  v-if="userPermissions.canCreateDispute"
                  @click="createDispute"
                  class="w-full btn-outline border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                >
                  发起争议
                </button>
                
                <router-link
                  v-if="userPermissions.canManageTask"
                  :to="`/task/${task.id}/manage`"
                  class="w-full btn-outline block text-center"
                >
                  管理任务
                </router-link>

                <!-- 访客提示 -->
                <div v-if="userRole === 'guest'" class="text-center p-4 bg-blue-50 rounded-lg">
                  <p class="text-sm text-blue-600 mb-2">连接钱包参与任务</p>
                  <button @click="web3Store.connectWallet()" class="btn-primary text-sm">
                    连接钱包
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧主要内容 -->
        <div class="lg:col-span-2 space-y-8">
          <!-- 任务描述 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">任务描述</h2>
            <div class="prose prose-gray max-w-none">
              <p class="whitespace-pre-wrap">{{ task.description }}</p>
            </div>
            
            <!-- 附件 -->
            <div v-if="task.attachments && task.attachments.length > 0" class="mt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-3">附件</h3>
              <div class="space-y-2">
                <div
                  v-for="attachment in task.attachments"
                  :key="attachment.hash"
                  class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                  </svg>
                  <span class="text-sm text-gray-700">{{ attachment.name }}</span>
                  <a
                    :href="ipfsStore.getFileURL(attachment.hash)"
                    target="_blank"
                    class="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    查看
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 进度时间线 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">任务进度</h2>
            <div class="flow-root">
              <ul class="-mb-8">
                <li v-for="(event, eventIdx) in taskEvents" :key="eventIdx">
                  <div class="relative pb-8">
                    <span
                      v-if="eventIdx !== taskEvents.length - 1"
                      class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    ></span>
                    <div class="relative flex space-x-3">
                      <div>
                        <span
                          :class="[
                            event.completed ? 'bg-primary-500' : 'bg-gray-400',
                            'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                          ]"
                        >
                          <svg
                            v-if="event.completed"
                            class="w-5 h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          <span v-else class="h-2.5 w-2.5 bg-current rounded-full"></span>
                        </span>
                      </div>
                      <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p class="text-sm text-gray-500">
                            {{ event.title }}
                            <span v-if="event.completed" class="font-medium text-gray-900">
                              - {{ event.description }}
                            </span>
                          </p>
                        </div>
                        <div class="text-right text-sm whitespace-nowrap text-gray-500">
                          <time v-if="event.timestamp" :datetime="event.timestamp">
                            {{ formatDate(event.timestamp) }}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- 竞标列表 -->
          <div v-if="task.status >= 0" class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">竞标列表</h2>
            <div v-if="bids.length === 0" class="text-center py-8">
              <p class="text-gray-500">暂无竞标</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="bid in bids"
                :key="bid.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span class="text-sm font-medium text-primary-600">
                          {{ bid.bidder.slice(2, 4).toUpperCase() }}
                        </span>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">
                          {{ formatAddress(bid.bidder) }}
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ formatDate(bid.timestamp) }}
                        </div>
                      </div>
                      <span
                        v-if="bid.isWinner"
                        class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                      >
                        中标
                      </span>
                    </div>
                    <p class="text-gray-700 text-sm">{{ bid.proposal }}</p>
                    <div v-if="bid.demoUrl" class="mt-2">
                      <a
                        :href="bid.demoUrl"
                        target="_blank"
                        class="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        查看演示 →
                      </a>
                    </div>
                  </div>
                  <div v-if="isTaskCreator && task.status === 0" class="ml-4">
                    <button
                      @click="selectWinner(bid.bidder)"
                      class="text-sm text-primary-600 hover:text-primary-700"
                    >
                      选择
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧信息栏 -->
        <div class="space-y-6">
          <!-- 雇主信息 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">雇主信息</h3>
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-lg font-medium text-primary-600">
                  {{ task.creator.slice(2, 4).toUpperCase() }}
                </span>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ formatAddress(task.creator) }}
                </div>
                <div class="text-xs text-gray-500">雇主</div>
              </div>
            </div>
          </div>

          <!-- 任务统计 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">任务统计</h3>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">参与人数</span>
                <span class="text-sm font-medium text-gray-900">{{ task.participants }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">剩余时间</span>
                <span class="text-sm font-medium text-gray-900">{{ getRemainingTime(task.deadline) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">押金要求</span>
                <span class="text-sm font-medium text-gray-900">{{ formatBalance((parseFloat(task.reward) * 0.1).toFixed(2)) }} AVAX</span>
              </div>
            </div>
          </div>

          <!-- 相关任务 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">相关任务</h3>
            <div class="space-y-3">
              <div
                v-for="relatedTask in relatedTasks"
                :key="relatedTask.id"
                class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <router-link :to="`/task/${relatedTask.id}`" class="block">
                  <h4 class="text-sm font-medium text-gray-900 mb-1">{{ relatedTask.title }}</h4>
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>{{ formatBalance(relatedTask.reward) }} AVAX</span>
                    <span>{{ getTypeText(relatedTask.taskType) }}</span>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 竞标模态框 -->
    <div
      v-if="showBidModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showBidModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">参与竞标</h3>
          <form @submit.prevent="submitBid">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                竞标方案描述
              </label>
              <textarea
                v-model="bidForm.proposal"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请详细描述您的解决方案和实施计划..."
                required
              ></textarea>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                演示链接 (可选)
              </label>
              <input
                v-model="bidForm.demoUrl"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://..."
              >
            </div>
            
            <div class="mb-6">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex">
                  <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">
                      需要支付押金
                    </h3>
                    <div class="mt-2 text-sm text-yellow-700">
                      <p>参与竞标需要支付 {{ formatBalance((parseFloat(task.reward) * 0.1).toFixed(2)) }} AVAX 作为押金。</p>
                      <p>如果您中标但未完成任务，押金将被扣除。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showBidModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="bidSubmitting"
                class="btn-primary flex items-center space-x-2"
              >
                <div v-if="bidSubmitting" class="loading-spinner"></div>
                <span>{{ bidSubmitting ? '提交中...' : '支付押金并竞标' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '@/stores/data'
import { useWeb3Store } from '@/stores/web3'
import { useIpfsStore } from '@/stores/ipfs'

const route = useRoute()
const router = useRouter()
const dataStore = useDataStore()
const web3Store = useWeb3Store()
const ipfsStore = useIpfsStore()

// 响应式数据
const loading = ref(false)
const task = ref(null)
const bids = ref([])
const relatedTasks = ref([])
const showBidModal = ref(false)
const bidSubmitting = ref(false)

// 竞标表单
const bidForm = ref({
  proposal: '',
  demoUrl: ''
})

// 计算属性
const taskId = computed(() => parseInt(route.params.id))

const isTaskCreator = computed(() => {
  return task.value && web3Store.account && 
         task.value.creator.toLowerCase() === web3Store.account.toLowerCase()
})

const canParticipate = computed(() => {
  return task.value && web3Store.account && 
         task.value.status === 0 && 
         !isTaskCreator.value &&
         !bids.value.some(bid => bid.bidder.toLowerCase() === web3Store.account.toLowerCase())
})

// 增强的账户身份判断
const userRole = computed(() => {
  if (!web3Store.account) return 'guest'
  if (!task.value) return 'unknown'
  
  const isCreator = task.value.creator.toLowerCase() === web3Store.account.toLowerCase()
  
  // 检查用户是否参与了该任务
  const userBid = bids.value.find(bid => 
    bid.bidder.toLowerCase() === web3Store.account.toLowerCase()
  )
  
  // 检查用户是否是中标者
  const isWinner = userBid && userBid.isWinner
  
  if (isCreator) return 'employer'
  if (isWinner) return 'assignee'
  if (userBid) return 'bidder'
  return 'visitor'
})

const userPermissions = computed(() => {
  const role = userRole.value
  return {
    canEdit: role === 'employer' && task.value?.status === 0,
    canBid: role === 'visitor' && task.value?.status === 0,
    canSelectWinner: role === 'employer' && task.value?.status === 1,
    canConfirmCompletion: role === 'employer' && task.value?.status === 2,
    canSubmitWork: role === 'assignee' && task.value?.status === 1,
    canViewBids: role === 'employer',
    canCreateDispute: ['employer', 'assignee'].includes(role) && [2, 3].includes(task.value?.status),
    canManageTask: role === 'employer'
  }
})

const userRoleText = computed(() => {
  const roleTexts = {
    guest: '访客',
    employer: '雇主',
    assignee: '承接者',
    bidder: '竞标者',
    visitor: '访客',
    unknown: '未知'
  }
  return roleTexts[userRole.value] || '未知'
})

// 任务状态和类型映射
const statusMap = {
  0: '开放竞标',
  1: '进行中',
  2: '等待确认', 
  3: '已完成',
  4: '已取消'
}

const typeMap = {
  0: 'Web3开发',
  1: 'UI/UX设计',
  2: '数据分析',
  3: '内容创作',
  4: '市场推广',
  5: '其他'
}

const taskEvents = computed(() => {
  if (!task.value) return []
  
  const events = [
    {
      title: '任务发布',
      description: '任务已发布，开始接受竞标',
      completed: true,
      timestamp: task.value.createdAt
    },
    {
      title: '竞标阶段',
      description: '雇佣兵提交竞标方案',
      completed: task.value.status >= 0,
      timestamp: task.value.status >= 0 ? task.value.createdAt : null
    },
    {
      title: '开发执行',
      description: '中标者开始执行任务',
      completed: task.value.status >= 1,
      timestamp: task.value.status >= 1 ? task.value.startedAt : null
    },
    {
      title: '提交成果',
      description: '任务完成，等待雇主确认',
      completed: task.value.status >= 2,
      timestamp: task.value.status >= 2 ? task.value.submittedAt : null
    },
    {
      title: '任务完成',
      description: '雇主确认任务完成，资金释放',
      completed: task.value.status >= 3,
      timestamp: task.value.status >= 3 ? task.value.completedAt : null
    }
  ]
  
  return events
})

// 方法
const loadTaskDetail = async () => {
  loading.value = true
  try {
    // 从dataStore获取任务详情
    const foundTask = dataStore.tasks.find(t => t.id === taskId.value)
    
    if (!foundTask) {
      // 如果任务不存在，跳转到404或任务列表
      router.push('/tasks')
      return
    }
    
    task.value = foundTask
    
    // 获取任务的竞标数据
    bids.value = dataStore.getBidsByTaskId(taskId.value)
    
    // 获取相关任务（同类型的其他任务）
    relatedTasks.value = dataStore.tasks
      .filter(t => t.id !== taskId.value && t.taskType === foundTask.taskType)
      .slice(0, 3)
    
  } catch (error) {
    console.error('加载任务详情失败:', error)
  } finally {
    loading.value = false
  }
}

const submitBid = async () => {
  if (!bidForm.value.proposal.trim()) {
    alert('请填写竞标方案')
    return
  }

  try {
    const bidData = {
      bidder: web3Store.account,
      proposal: bidForm.value.proposal,
      demoUrl: bidForm.value.demoUrl || ''
    }

    await dataStore.addBid(taskId.value, bidData)
    
    // 重新加载竞标数据
    bids.value = dataStore.getBidsByTaskId(taskId.value)
    
    // 关闭模态框并重置表单
    showBidModal.value = false
    bidForm.value = {
      proposal: '',
      demoUrl: ''
    }

    alert('竞标提交成功！')
    
  } catch (error) {
    console.error('提交竞标失败:', error)
    alert('竞标提交失败，请重试')
  }
}

const selectWinner = async (bidder) => {
  if (!confirm('确定选择此竞标者为获胜者吗？')) {
    return
  }

  try {
    // 更新任务状态
    await dataStore.updateTask(taskId.value, { status: 1 })
    
    // 标记获胜者
    const updatedBids = bids.value.map(bid => ({
      ...bid,
      isWinner: bid.bidder.toLowerCase() === bidder.toLowerCase()
    }))
    
    // 更新竞标数据
    dataStore.bids[taskId.value] = updatedBids
    await dataStore.saveData()
    
    // 重新加载数据
    await loadTaskDetail()
    
    alert('获胜者选择成功！')
    
  } catch (error) {
    console.error('选择获胜者失败:', error)
    alert('操作失败，请重试')
  }
}

const confirmTask = async (approved) => {
  const action = approved ? '确认完成' : '拒绝'
  if (!confirm(`确定要${action}这个任务吗？`)) {
    return
  }

  try {
    const newStatus = approved ? 3 : 0 // 3: 已完成, 0: 重新开放
    await dataStore.updateTask(taskId.value, { status: newStatus })
    
    // 重新加载数据
    await loadTaskDetail()
    
    alert(`任务${action}成功！`)
    
  } catch (error) {
    console.error('确认任务失败:', error)
    alert('操作失败，请重试')
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

const getStatusText = (status) => {
  const texts = {
    0: '开放竞标',
    1: '进行中',
    2: '等待确认',
    3: '已完成',
    4: '已取消'
  }
  return texts[status] || '未知'
}

const getTypeText = (type) => {
  const texts = {
    0: 'Web3开发',
    1: 'UI/UX设计',
    2: '数据分析',
    3: '内容创作',
    4: '市场推广',
    5: '其他'
  }
  return texts[type] || '其他'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const formatAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
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

const getRemainingTime = (deadline) => {
  const now = new Date()
  const end = new Date(deadline)
  const diff = end - now
  
  if (diff <= 0) return '已截止'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days > 0) return `${days} 天`
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours > 0) return `${hours} 小时`
  
  const minutes = Math.floor(diff / (1000 * 60))
  return `${minutes} 分钟`
}

// 提交工作成果
const submitWork = async () => {
  if (!web3Store.isConnected) {
    alert('请先连接钱包')
    return
  }
  
  if (userRole.value !== 'assignee') {
    alert('只有任务承接者才能提交工作成果')
    return
  }
  
  try {
    // 这里可以添加提交工作成果的逻辑
    // 比如打开一个模态框让用户上传文件或填写说明
    console.log('提交工作成果功能待实现')
    alert('工作成果提交功能正在开发中')
  } catch (error) {
    console.error('提交工作成果失败:', error)
    alert('提交失败: ' + error.message)
  }
}

// 创建争议
const createDispute = async () => {
  if (!web3Store.isConnected) {
    alert('请先连接钱包')
    return
  }
  
  if (!userPermissions.value.canCreateDispute) {
    alert('无权限创建争议')
    return
  }
  
  try {
    // 这里可以添加创建争议的逻辑
    // 比如打开一个模态框让用户填写争议内容
    console.log('创建争议功能待实现')
    alert('争议创建功能正在开发中')
  } catch (error) {
    console.error('创建争议失败:', error)
    alert('创建争议失败: ' + error.message)
  }
}

// 监听路由参数变化
watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      loadTaskDetail()
    }
  },
  { immediate: true }
)

onMounted(() => {
  loadTaskDetail()
})
</script>

<style scoped>
/* 任务详情页面特定样式 */
.task-detail-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 75%, #ffffff 100%);
}

.task-detail-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 232, 240, 0.3);
  box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.1), 0 4px 6px -2px rgba(30, 58, 138, 0.05);
}

.user-role-badge {
  transition: all 0.3s ease;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.user-role-employer {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(30, 58, 138, 0.2);
}

.user-role-assignee {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.2);
}

.user-role-bidder {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
}

.user-role-visitor,
.user-role-guest {
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(107, 114, 128, 0.2);
}

.action-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.action-button:hover {
  transform: translateY(-2px) scale(1.02);
}

.action-button:active {
  transform: translateY(0) scale(0.98);
}

.action-button-primary {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.1), 0 4px 6px -2px rgba(30, 58, 138, 0.05);
}

.action-button-primary:hover {
  box-shadow: 0 20px 25px -5px rgba(30, 58, 138, 0.2), 0 10px 10px -5px rgba(30, 58, 138, 0.1);
}

.action-button-secondary {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.1), 0 4px 6px -2px rgba(245, 158, 11, 0.05);
}

.action-button-secondary:hover {
  box-shadow: 0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1);
}

.action-button-outline {
  border: 2px solid #1e40af;
  color: #1e40af;
  background: transparent;
}

.action-button-outline:hover {
  background: #1e40af;
  color: white;
}

.action-button-danger {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05);
}

.action-button-danger:hover {
  box-shadow: 0 20px 25px -5px rgba(239, 68, 68, 0.2), 0 10px 10px -5px rgba(239, 68, 68, 0.1);
}

.task-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.task-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.info-section {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.info-section:hover {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.info-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.info-value {
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
}

.bid-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.bid-card:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.bid-card.winner {
  border: 2px solid #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
}

.bid-card.winner::before {
  content: '🏆';
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  flex-direction: column;
  gap: 1rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fca5a5;
  color: #dc2626;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
}

.success-state {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #86efac;
  color: #16a34a;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .action-button {
    padding: 0.625rem 1.5rem;
    font-size: 0.875rem;
  }
  
  .info-section {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .bid-card {
    padding: 1rem;
  }
  
  .user-role-badge {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .task-detail-card {
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(100, 116, 139, 0.3);
    color: #f1f5f9;
  }
  
  .info-section {
    background: rgba(30, 41, 59, 0.6);
    border-color: rgba(100, 116, 139, 0.3);
  }
  
  .bid-card {
    background: rgba(30, 41, 59, 0.9);
    border-color: rgba(100, 116, 139, 0.3);
    color: #f1f5f9;
  }
  
  .info-label {
    color: #9ca3af;
  }
  
  .info-value {
    color: #f9fafb;
  }
}
</style> 