<template>
  <div class="create-task">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面头部 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">发布新任务</h1>
        <p class="text-lg text-gray-600">
          创建您的任务需求，吸引全球优秀的雇佣兵参与协作
        </p>
      </div>

      <!-- 发布流程指示器 -->
      <div class="mb-8">
        <nav aria-label="Progress">
          <ol class="flex items-center justify-center space-x-5">
            <li v-for="(step, stepIdx) in steps" :key="step.name" class="flex items-center">
              <div
                :class="[
                  stepIdx < currentStep ? 'bg-primary-600 text-white' : 
                  stepIdx === currentStep ? 'bg-primary-100 text-primary-600 border-2 border-primary-600' : 
                  'bg-gray-100 text-gray-400',
                  'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium'
                ]"
              >
                {{ stepIdx + 1 }}
              </div>
              <span
                :class="[
                  stepIdx < currentStep ? 'text-primary-600' : 'text-gray-500',
                  'ml-2 text-sm font-medium'
                ]"
              >
                {{ step.name }}
              </span>
              <svg
                v-if="stepIdx < steps.length - 1"
                class="w-5 h-5 text-gray-300 ml-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </li>
          </ol>
        </nav>
      </div>

      <!-- 表单内容 -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <form @submit.prevent="handleSubmit">
          <!-- 步骤1: 基本信息 -->
          <div v-show="currentStep === 0" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                任务标题 *
              </label>
              <input
                v-model="taskForm.title"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请输入简洁明确的任务标题"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                任务类型 *
              </label>
              <select
                v-model="taskForm.taskType"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">请选择任务类型</option>
                <option v-for="type in taskTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                任务描述 *
              </label>
              <textarea
                v-model="taskForm.description"
                rows="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请详细描述任务需求、技术要求、交付标准等..."
                required
              ></textarea>
              <p class="mt-2 text-sm text-gray-500">
                建议包含：任务背景、具体需求、技术要求、交付标准、验收条件等
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  任务奖金 (AVAX) *
                </label>
                <input
                  v-model="taskForm.reward"
                  type="number"
                  step="0.1"
                  min="0.1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0.0"
                  required
                >
                <p class="mt-2 text-sm text-gray-500">
                  最低奖金 0.1 AVAX，将收取 0.5% 平台费用
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  截止时间 *
                </label>
                <input
                  v-model="taskForm.deadline"
                  type="date"
                  :min="minDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
              </div>
            </div>
          </div>

          <!-- 步骤2: 附件上传 -->
          <div v-show="currentStep === 1" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                任务附件 (可选)
              </label>
              <div
                @drop="handleDrop"
                @dragover.prevent
                @dragenter.prevent
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors"
              >
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div class="mt-4">
                  <label class="cursor-pointer">
                    <span class="text-primary-600 hover:text-primary-500 font-medium">
                      点击上传文件
                    </span>
                    <span class="text-gray-500"> 或拖拽文件到此处</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.zip,.rar"
                      class="hidden"
                      @change="handleFileSelect"
                    >
                  </label>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  支持 PDF、Word、图片、压缩包等格式，单个文件最大 10MB
                </p>
              </div>
            </div>

            <!-- 已上传文件列表 -->
            <div v-if="uploadedFiles.length > 0" class="space-y-3">
              <h4 class="text-sm font-medium text-gray-900">已上传文件</h4>
              <div class="space-y-2">
                <div
                  v-for="(file, index) in uploadedFiles"
                  :key="index"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center space-x-3">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                    </svg>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ file.name }}</div>
                      <div class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeFile(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 步骤3: 确认发布 -->
          <div v-show="currentStep === 2" class="space-y-6">
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">任务信息确认</h3>
              
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">任务标题</span>
                  <span class="text-sm font-medium text-gray-900">{{ taskForm.title }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">任务类型</span>
                  <span class="text-sm font-medium text-gray-900">{{ getTypeText(taskForm.taskType) }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">任务奖金</span>
                  <span class="text-sm font-medium text-gray-900">{{ formatBalance(calculatedFees.reward) }} AVAX</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">平台费用 ({{ platformFeeInfo.feeRatePercent }}%)</span>
                  <span class="text-sm font-medium text-gray-900">{{ formatBalance(calculatedFees.platformFee) }} AVAX</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">截止时间</span>
                  <span class="text-sm font-medium text-gray-900">{{ formatDate(taskForm.deadline) }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500">附件数量</span>
                  <span class="text-sm font-medium text-gray-900">{{ uploadedFiles.length }} 个文件</span>
                </div>
                
                <div class="border-t pt-4">
                  <div class="flex justify-between text-base font-medium">
                    <span class="text-gray-900">总支付金额</span>
                    <span class="text-gray-900">{{ formatBalance(calculatedFees.totalAmount) }} AVAX</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">
                    发布说明
                  </h3>
                  <div class="mt-2 text-sm text-blue-700">
                    <ul class="list-disc list-inside space-y-1">
                      <li>任务发布后，奖金将托管在智能合约中</li>
                      <li>雇佣兵需要支付10%押金才能参与竞标</li>
                      <li>您可以在竞标截止前选择中标者</li>
                      <li>任务完成后确认付款，资金将自动释放</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 按钮组 -->
          <div class="flex justify-between mt-8">
            <button
              v-if="currentStep > 0"
              type="button"
              @click="currentStep--"
              class="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              上一步
            </button>
            <div v-else></div>

            <div class="flex space-x-3">
              <button
                v-if="currentStep < steps.length - 1"
                type="button"
                @click="nextStep"
                class="btn-primary px-6 py-2"
              >
                下一步
              </button>
              <button
                v-else
                type="submit"
                :disabled="submitting || !web3Store.isConnected"
                class="btn-primary px-6 py-2 flex items-center space-x-2"
              >
                <div v-if="submitting" class="loading-spinner"></div>
                <span>
                  {{ submitting ? '发布中...' : web3Store.isConnected ? '发布任务' : '请先连接钱包' }}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWeb3Store } from '@/stores/web3'
import { useDataStore } from '@/stores/data'
import { useIpfsStore } from '@/stores/ipfs'

const router = useRouter()
const web3Store = useWeb3Store()
const dataStore = useDataStore()
const ipfsStore = useIpfsStore()

// 响应式数据
const currentStep = ref(0)
const submitting = ref(false)
const uploadedFiles = ref([])
const platformFeeInfo = ref({
  feeRate: 50, // 默认0.5%
  feeRatePercent: '0.50',
  platformAddress: '',
  totalFees: '0'
})

// 步骤配置
const steps = [
  { name: '基本信息' },
  { name: '上传附件' },
  { name: '确认发布' }
]

// 任务类型选项
const taskTypes = [
  { value: 0, label: 'Web3开发' },
  { value: 1, label: 'UI/UX设计' },
  { value: 2, label: '数据分析' },
  { value: 3, label: '内容创作' },
  { value: 4, label: '市场推广' },
  { value: 5, label: '其他' }
]

// 表单数据
const taskForm = ref({
  title: '',
  taskType: '',
  description: '',
  reward: '',
  deadline: ''
})

// 计算属性
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const calculatedFees = computed(() => {
  const reward = parseFloat(taskForm.value.reward || 0)
  const platformFee = (reward * platformFeeInfo.value.feeRate) / 10000
  const totalAmount = reward + platformFee
  
  return {
    reward: reward.toFixed(4),
    platformFee: platformFee.toFixed(4),
    totalAmount: totalAmount.toFixed(4)
  }
})

// 方法
const nextStep = () => {
  if (validateCurrentStep()) {
    currentStep.value++
  }
}

const validateCurrentStep = () => {
  web3Store.clearError()
  
  switch (currentStep.value) {
    case 0:
      if (!taskForm.value.title.trim()) {
        web3Store.error = '请输入任务标题'
        return false
      }
      if (!taskForm.value.taskType) {
        web3Store.error = '请选择任务类型'
        return false
      }
      if (!taskForm.value.description.trim()) {
        web3Store.error = '请输入任务描述'
        return false
      }
      if (!taskForm.value.reward || parseFloat(taskForm.value.reward) < 0.1) {
        web3Store.error = '任务奖金最低为 0.1 AVAX'
        return false
      }
      if (!taskForm.value.deadline) {
        web3Store.error = '请选择截止时间'
        return false
      }
      return true
    case 1:
      return true // 附件上传是可选的
    default:
      return true
  }
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

const handleDrop = (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const processFiles = (files) => {
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      web3Store.error = `文件 ${file.name} 超过 10MB 限制`
      return
    }
    
    if (!uploadedFiles.value.some(f => f.name === file.name && f.size === file.size)) {
      uploadedFiles.value.push(file)
    }
  })
}

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFilesToIPFS = async () => {
  const attachments = []
  
  for (const file of uploadedFiles.value) {
    try {
      const hash = await ipfsStore.uploadFile(file)
      attachments.push({
        name: file.name,
        hash: hash,
        size: file.size
      })
    } catch (error) {
      console.error(`上传文件 ${file.name} 失败:`, error)
      throw new Error(`上传文件 ${file.name} 失败`)
    }
  }
  
  return attachments
}

const handleSubmit = async () => {
  if (!web3Store.isConnected) {
    web3Store.error = '请先连接钱包才能发布任务'
    return
  }

  if (!validateCurrentStep()) {
    return
  }

  submitting.value = true
  
  try {
    // 1. 上传附件到IPFS
    console.log('正在上传附件到IPFS...')
    const attachments = await uploadFilesToIPFS()
    
    // 2. 创建任务数据并上传到IPFS
    const taskData = {
      title: taskForm.value.title,
      description: taskForm.value.description,
      taskType: parseInt(taskForm.value.taskType),
      attachments: attachments,
      creator: web3Store.account,
      createdAt: new Date().toISOString()
    }
    
    console.log('正在上传任务数据到IPFS...')
    const taskDataHash = await ipfsStore.uploadJSON(taskData)
    console.log('任务数据IPFS哈希:', taskDataHash)
    
    // 3. 调用智能合约创建任务
    console.log('正在调用智能合约创建任务...')
    const receipt = await web3Store.createTask(
      taskForm.value.title,
      taskDataHash,  // 使用IPFS哈希作为任务数据引用
      taskForm.value.reward,
      taskForm.value.deadline,
      parseInt(taskForm.value.taskType)
    )
    
    console.log('智能合约交易成功:', receipt)
    
    // 4. 从交易回执中获取任务ID
    let blockchainTaskId = null
    if (receipt.events && receipt.events.TaskCreated) {
      blockchainTaskId = receipt.events.TaskCreated.args.taskId.toString()
    } else if (receipt.logs && receipt.logs.length > 0) {
      // 如果没有解析的事件，尝试从logs中获取
      const taskCreatedLog = receipt.logs.find(log => log.topics.length > 0)
      if (taskCreatedLog) {
        // 解析TaskCreated事件的taskId (通常是第二个topic)
        blockchainTaskId = parseInt(taskCreatedLog.topics[1], 16).toString()
      }
    }
    
    // 5. 将任务信息也保存到本地存储（用于快速显示）
    const localTaskData = {
      ...taskData,
      id: blockchainTaskId || Date.now(), // 使用区块链任务ID或时间戳
      blockchainId: blockchainTaskId,     // 保存区块链上的任务ID
      reward: taskForm.value.reward,
      deadline: taskForm.value.deadline,
      status: 0, // 开放中
      participants: 0,
      txHash: receipt.transactionHash      // 保存交易哈希
    }
    
    console.log('正在保存任务到本地存储...')
    await dataStore.addTask(localTaskData)
    
    // 6. 显示成功消息并跳转
    web3Store.error = null
    console.log('✅ 任务发布成功!')
    
    // 跳转到任务详情页面
    router.push(`/task/${localTaskData.id}`)
    
  } catch (error) {
    console.error('发布任务失败:', error)
    
    // 根据错误类型显示不同的错误消息
    if (error.code === 4001) {
      web3Store.error = '用户取消了交易'
    } else if (error.code === -32603) {
      web3Store.error = '交易执行失败，请检查网络连接和gas费用'
    } else if (error.message.includes('insufficient funds')) {
      web3Store.error = 'AVAX余额不足，请确保有足够的余额支付奖励和gas费用'
    } else if (error.message.includes('deadline')) {
      web3Store.error = '截止时间必须是未来时间'
    } else {
      web3Store.error = error.message || '发布任务失败，请重试'
    }
  } finally {
    submitting.value = false
  }
}

const getTypeText = (type) => {
  const typeObj = taskTypes.find(t => t.value === parseInt(type))
  return typeObj ? typeObj.label : '其他'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
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

// 获取平台费用信息
const loadPlatformFeeInfo = async () => {
  try {
    if (web3Store.isConnected && web3Store.contracts.taskFactory) {
      const feeInfo = await web3Store.getPlatformFeeInfo()
      platformFeeInfo.value = feeInfo
      console.log('平台费用信息:', feeInfo)
    }
  } catch (error) {
    console.error('获取平台费用信息失败:', error)
    // 保持默认值
  }
}

onMounted(() => {
  // 检查钱包连接状态
  if (!web3Store.isConnected) {
    web3Store.error = '请先连接钱包才能发布任务'
  }

  // 获取平台费用信息
  loadPlatformFeeInfo()
})
</script> 