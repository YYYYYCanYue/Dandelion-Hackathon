<template>
  <!-- 发布页头部 -->
  <header class="publish-header">
    <div class="container">
      <div class="publish-header-content">
        <h1 class="publish-title">发布新任务</h1>
        <p class="publish-subtitle">在Dandelion平台上发布您的任务，连接全球顶尖人才，高效完成您的项目</p>
        
        <div class="steps-container">
          <div class="step-card">
            <div class="step-number">1</div>
            <h3 class="step-title">填写任务详情</h3>
            <p class="step-description">清晰描述您的任务需求</p>
          </div>
          
          <div class="step-card">
            <div class="step-number">2</div>
            <h3 class="step-title">设置任务参数</h3>
            <p class="step-description">赏金、截止时间等</p>
          </div>
          
          <div class="step-card">
            <div class="step-number">3</div>
            <h3 class="step-title">支付并发布</h3>
            <p class="step-description">安全托管赏金</p>
          </div>
        </div>
      </div>
    </div>
  </header>
  
  <!-- 任务发布表单 -->
  <section class="form-section">
    <div class="container">
      <div class="form-container">
        <div class="form-header">
          <h2 class="form-title">任务信息</h2>
          <div class="form-progress">步骤 1/2</div>
        </div>
        
        <div class="form-body">
          <form @submit.prevent="submitTask">
            <!-- 基本任务信息 -->
            <div class="form-section">
              <h3 class="form-section-title">
                <i class="fas fa-info-circle"></i> 基本任务信息
              </h3>
              
              <div class="form-group">
                <label class="form-label required">
                  <i class="fas fa-heading"></i> 任务标题
                </label>
                <input type="text" class="form-input" placeholder="例如：去中心化交易所前端开发" v-model="task.title" required>
                <p class="form-hint"><i class="fas fa-lightbulb"></i> 简洁明了地描述您的任务，吸引合适的执行者</p>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">
                    <i class="fas fa-layer-group"></i> 任务类别
                  </label>
                  <select class="form-select" v-model="task.category" required aria-label="任务类别">
                    <option value="">选择类别</option>
                    <option value="web3">Web3开发</option>
                    <option value="design">UI/UX设计</option>
                    <option value="marketing">市场推广</option>
                    <option value="content">内容创作</option>
                    <option value="analysis">数据分析</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-tags"></i> 任务标签
                  </label>
                  <input type="text" class="form-input" placeholder="输入标签，用逗号分隔" v-model="task.tags">
                  <p class="form-hint"><i class="fas fa-lightbulb"></i> 帮助执行者更好地理解任务领域，例如：React,Solidity,Web3</p>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label required">
                  <i class="fas fa-align-left"></i> 任务描述
                </label>
                <textarea class="form-textarea" placeholder="详细描述任务要求、交付标准和技术规范..." v-model="task.description" required></textarea>
                <p class="form-hint"><i class="fas fa-lightbulb"></i> 尽可能详细地描述任务需求，包括功能要求、设计规范、技术栈等</p>
              </div>
            </div>
            
            <div class="form-divider"></div>
            
            <!-- 任务参数 -->
            <div class="form-section">
              <h3 class="form-section-title">
                <i class="fas fa-cog"></i> 任务参数设置
              </h3>
              
              <div class="form-row">
                <!-- 任务赏金 -->
                <div class="form-group">
                  <label class="form-label required">
                    <i class="fas fa-coins"></i> 任务赏金 (USDT)
                  </label>
                  <input 
                    type="number" 
                    class="form-input" 
                    min="10"
                    step="1"
                    placeholder="例如：100"
                    v-model="task.reward"
                    required
                    @input="validateReward"
                  >
                  <p class="form-hint"><i class="fas fa-lightbulb"></i> 最低赏金: 10 USDT</p>
                </div>
                
                <!-- 竞标截止时间 -->
                <div class="form-group">
                  <label class="form-label required">
                    <i class="fas fa-calendar-alt"></i> 竞标截止时间
                  </label>
                  <input 
                    type="date" 
                    class="form-input" 
                    :min="minBidDate"
                    v-model="task.bidDeadline" 
                    required
                  >
                </div>
              </div>
              
              <div class="form-row">
                <!-- 开发周期 -->
                <div class="form-group">
                  <label class="form-label required">
                    <i class="fas fa-hourglass-half"></i> 开发周期 (天)
                  </label>
                  <input 
                    type="number" 
                    class="form-input" 
                    min="1" 
                    placeholder="例如：14" 
                    v-model="task.duration" 
                    required
                  >
                </div>
                
                <!-- 最大参与者数 -->
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-user-friends"></i> 最大参与者数
                  </label>
                  <input 
                    type="number" 
                    class="form-input" 
                    min="1" 
                    placeholder="留空表示无限制" 
                    v-model="task.maxParticipants"
                  >
                </div>
              </div>
              
              <div class="form-row">
                <!-- 质押比例 -->
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-lock"></i> 质押比例
                    <span class="stake-min-tag">最低: {{ minStakePercent }}%</span>
                  </label>
                  <input 
                    type="number" 
                    class="form-input" 
                    :min="minStakePercent" 
                    max="30" 
                    step="1" 
                    placeholder="系统默认: 10%" 
                    v-model="task.stakePercent"
                    @blur="adjustStakePercent"
                  >
                  <p class="form-hint">
                    <i class="fas fa-lightbulb"></i> 
                    任务赏金的{{ minStakePercent }}%将作为质押金，防止恶意发布。
                    <span v-if="minStakePercent > 10">高风险任务要求更高质押比例。</span>
                  </p>
                  <div class="stake-notice">
                    <i class="fas fa-info-circle"></i> 任务完成后质押金将全额退还
                  </div>
                </div>
                
                <!-- 风险等级 -->
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-shield-alt"></i> 风险等级
                  </label>
                  <select 
                    class="form-select" 
                    v-model="task.riskLevel"
                    @change="adjustStakePercent"
                    aria-label="风险等级"
                  >
                    <option value="low">低风险</option>
                    <option value="medium">中风险</option>
                    <option value="high">高风险</option>
                  </select>
                  <p class="form-hint"><i class="fas fa-lightbulb"></i> Web3开发类任务自动设为高风险</p>
                </div>
              </div>
            </div>
            
            <!-- Web3任务特殊设置 -->
            <div class="form-section">
              <h3 class="form-section-title">
                <i class="fas fa-link"></i> Web3任务设置
              </h3>
              
              <div class="form-group">
                <div class="form-checkbox">
                  <input 
                    type="checkbox" 
                    id="web3-task" 
                    v-model="task.isWeb3"
                    :disabled="task.category === 'web3' && task.isWeb3"
                  >
                  <label 
                    for="web3-task"
                    :style="task.category === 'web3' && task.isWeb3 ? 'pointer-events:none;opacity:0.7;' : ''"
                  >
                    Web3任务强制流程，其他任务也可选择该流程
                  </label>
                  <span v-if="task.category === 'web3'" class="web3-required-tag">(Web3任务强制启用)</span>
                </div>
              </div>
              
              <div v-if="task.isWeb3" class="web3-settings">
                <div class="form-row">
                  <!-- GitHub仓库（必填） -->
                  <div class="form-group">
                    <label class="form-label" :class="{ required: task.isWeb3 }">
                      <i class="fab fa-github"></i> GitHub仓库
                    </label>
                    <input 
                      type="url" 
                      class="form-input" 
                      placeholder="https://github.com/your-repo" 
                      v-model="task.githubRepo"
                      :required="task.isWeb3"
                    >
                  </div>
                  
                  <!-- 目标分支 -->
                  <div class="form-group">
                    <label class="form-label">
                      <i class="fas fa-code-branch"></i> 目标分支
                    </label>
                    <input 
                      type="text" 
                      class="form-input" 
                      placeholder="例如：main" 
                      v-model="task.targetBranch"
                    >
                  </div>
                </div>
                
                <!-- 分阶段验收（默认启用） -->
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-tasks"></i> 分阶段验收
                  </label>
                  <div class="form-checkbox">
                    <input 
                      type="checkbox" 
                      id="milestone-check" 
                      v-model="task.milestoneEnabled"
                      :disabled="task.category === 'web3' && task.milestoneEnabled"
                    >
                    <label 
                      for="milestone-check"
                      :style="task.category === 'web3' && task.milestoneEnabled ? 'pointer-events:none;opacity:0.7;' : ''"
                    >启用分阶段验收</label>
                    <span v-if="task.category === 'web3'" class="web3-required-tag">(Web3任务强制启用)</span>
                  </div>
                </div>
                
                <div v-if="task.milestoneEnabled" class="milestone-settings">
                  <div class="form-group">
                    <label class="form-label">
                      <i class="fas fa-road"></i> 里程碑设置
                    </label>
                    <div class="milestone-list">
                      <div class="milestone-item" v-for="(milestone, index) in task.milestones" :key="index">
                        <div class="form-row">
                          <div class="form-group">
                            <input type="text" class="form-input" placeholder="里程碑名称" v-model="milestone.name">
                          </div>
                          <div class="form-group">
                            <input type="number" class="form-input" placeholder="赏金比例 %" v-model="milestone.rewardPercent">
                          </div>
                        </div>
                        <div class="form-group">
                          <textarea class="form-input" placeholder="验收标准" v-model="milestone.criteria"></textarea>
                        </div>
                        <button
                          type="button"
                          class="btn btn-outline btn-sm milestone-remove-btn"
                          @click="removeMilestone(index)"
                          v-if="index > 0"
                        >
                          <i class="fas fa-trash"></i> 删除
                        </button>
                      </div>
                    </div>
                    <button type="button" class="btn btn-outline" @click="addMilestone">
                      <i class="fas fa-plus"></i> 添加里程碑
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-divider"></div>
            
            <!-- 文件上传 -->
            <div class="form-section">
              <h3 class="form-section-title">
                <i class="fas fa-paperclip"></i> 附件上传
              </h3>
              
              <div class="form-group">
                <div class="file-upload" @click="triggerFileUpload">
                  <div class="upload-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                  </div>
                  <p class="upload-text">拖放文件到此处或点击上传</p>
                  <div class="upload-btn">选择文件</div>
                  <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileUpload"
                    multiple
                    class="file-input-hidden"
                  >
                </div>
                <div class="file-list" v-if="task.files.length > 0">
      <div class="file-item" v-for="(file, index) in task.files" :key="index">
        <div class="file-icon">
          <!-- 使用getFileIconClass函数 -->
          <i :class="getFileIconClass(file)"></i>
        </div>
        <div class="file-name">{{ file.name }}</div>
        <div class="file-size">{{ formatFileSize(file.size) }}</div>
        <div class="file-remove" @click="removeFile(index)">
          <i class="fas fa-times"></i>
        </div>
      </div>
    </div>
    <p class="form-hint">
      <i class="fas fa-lightbulb"></i> 
      支持上传文档(PDF, DOC/DOCX)、图片(JPG, PNG, GIF)、压缩文件(ZIP)等格式，单个文件不超过10MB
    </p>
              </div>
            </div>
            
            <div class="form-divider"></div>
            
            <!-- 高级选项 -->
            <!--
            <div class="form-section">
              <div class="advanced-options" :class="{ active: advancedOpen }">
                <div class="advanced-toggle" @click="advancedOpen = !advancedOpen">
                  <i class="fas fa-chevron-down"></i>
                  <h3 class="form-section-title">高级选项</h3>
                </div>
                
                <div class="advanced-content">
                  <div class="form-group">
                    <label class="form-label">
                      <i class="fas fa-user-shield"></i> 执行者要求
                    </label>
                    <input type="number" class="form-input" placeholder="最低信用分要求" v-model="task.minCredit">
                    <p class="form-hint"><i class="fas fa-lightbulb"></i> 设置执行者的最低信用分要求</p>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">
                      <i class="fas fa-globe-americas"></i> 地域限制
                    </label>
                    <select class="form-select" v-model="task.regionRestriction">
                      <option value="">无限制</option>
                      <option value="north-america">北美</option>
                      <option value="europe">欧洲</option>
                      <option value="asia">亚洲</option>
                      <option value="other">其他地区</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">
                      <i class="fas fa-eye"></i> 任务可见性
                    </label>
                    <div class="form-radio-group">
                      <div class="form-radio">
                        <input type="radio" id="visibility-public" value="public" v-model="task.visibility">
                        <label for="visibility-public">公开任务</label>
                      </div>
                      <div class="form-radio">
                        <input type="radio" id="visibility-private" value="private" v-model="task.visibility">
                        <label for="visibility-private">私有任务</label>
                      </div>
                    </div>
                    <p class="form-hint"><i class="fas fa-lightbulb"></i> 私有任务仅对受邀执行者可见</p>
                  </div>
                </div>
              </div>
            </div>
            -->
            
            <!-- 费用计算 -->
            <div class="fee-calculation">
              <h3 class="form-section-title">
                <i class="fas fa-calculator"></i> 费用概览
              </h3>
              
              <div class="fee-row">
                <span>任务赏金:</span>
                <span>{{ formattedReward }} USDT</span>
              </div>
              
              <div class="fee-row">
                <span>质押金 ({{ stakePercentComputed }}%):</span>
                <span>{{ formattedStake }} USDT</span>
              </div>
              
              <div class="fee-row">
                <span>平台手续费 (0.5%):</span>
                <span>{{ formattedFee }} USDT</span>
              </div>
              
              <div class="fee-row fee-total">
                <span>总计支付:</span>
                <span>{{ formattedTotal }} USDT</span>
              </div>
            </div>
            
            <!-- 表单操作 -->
            <div class="form-actions">
              <button type="button" class="btn btn-outline btn-lg" title="取消">
                <i class="fas fa-times"></i> 取消
              </button>
              <button type="submit" class="btn btn-primary btn-lg" title="下一步：支付并发布">
                <i class="fas fa-check"></i> 下一步：支付并发布
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { watch } from 'vue'
import IPFSService from '../../composables/ipfs.js'
import { useWallet } from '../../composables/useWallet.js'


// 任务数据模型
const task = reactive({
  title: '',
  category: '',
  tags: '',
  description: '',
  reward: 100, // 默认值改为100 USDT
  bidDeadline: '',
  duration: 14,
  maxParticipants: '',
  stakePercent: 10,
  riskLevel: 'medium',
  isWeb3: false,
  githubRepo: '',
  targetBranch: 'main',
  milestoneEnabled: false,
  milestones: [
    { name: '', rewardPercent: 30, criteria: '' }
  ],
  files: [],
  minCredit: '',
  regionRestriction: '',
  visibility: 'public'
})

// 文件输入引用
const fileInput = ref(null)

// 最小竞标截止日期（今天）
const minBidDate = computed(() => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

// 最小质押比例
const minStakePercent = computed(() => {
  if (task.category === 'web3' || task.riskLevel === 'high') return 20
  if (task.riskLevel === 'medium') return 15
  return 10
})

// 计算质押比例
const stakePercentComputed = computed(() => {
  let minPercent = 10
  if (task.category === 'web3') {
    minPercent = 20
  } else {
    switch (task.riskLevel) {
      case 'high': minPercent = 20; break
      case 'medium': minPercent = 15; break
      default: minPercent = 10
    }
  }
  return Math.max(minPercent, Number(task.stakePercent) || minPercent)
})

// 金额格式化
const formattedReward = computed(() => {
  return Number(task.reward).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})
const formattedStake = computed(() => {
  const stake = task.reward * stakePercentComputed.value / 100
  return stake.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})
const formattedFee = computed(() => {
  const fee = task.reward * 0.005
  return fee.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})
const formattedTotal = computed(() => {
  return totalPayment.value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

// USDT通常有6位小数
const toUSDTUnits = (amount) => {
  return BigInt(Math.floor(amount * 1e6));
}

// 计算总支付金额（单位：USDT最小单位字符串）
const totalPayment = computed(() => {
  const reward = parseFloat(task.reward) || 0;
  const stake = reward * stakePercentComputed.value / 100;
  const fee = reward * 0.005;
  return toUSDTUnits(reward + stake + fee).toString();
})

const submitTask = async () => {
  // 检查钱包连接状态
  if (!isConnected.value) {
    const confirmed = confirm('请先连接钱包才能发布任务')
    if (confirmed) await connectWallet()
    return
  }
  // 验证表单数据
  if (!task.title || !task.category || !task.description || !task.reward || !task.bidDeadline || !task.duration) {
    alert('请填写所有必填字段');
    return;
  }
  
  // 显示加载状态
  const submitBtn = document.querySelector('.btn-primary');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发布中...';
  submitBtn.disabled = true;
  
  try {
    // 上传所有文件到IPFS
    const uploadedFiles = [];

    // 使用Promise.allSettled确保即使部分文件失败也能继续
    const uploadResults = await Promise.allSettled(
      task.files.map(file =>
        IPFSService.uploadFile(file).then(cid => ({
          cid,
          name: file.name,
          size: file.size,
          type: file.type
        }))
      )
    );

    // 处理上传结果
    uploadResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        uploadedFiles.push(result.value);
      } else {
        const file = task.files[index];
        console.error(`文件上传失败: ${file.name}`, result.reason);
        alert(`文件上传失败: ${file.name} - ${result.reason.message}`);
      }
    });

    // 构造任务对象，包含上传的文件CID
    const taskData = {
      title: task.title,
      category: task.category,
      description: task.description,
      // USDT金额转为最小单位字符串
      reward: toUSDTUnits(task.reward).toString(),
      bidDeadline: formatDateToUnix(task.bidDeadline),
      duration: task.duration,
      maxParticipants: task.maxParticipants || null,
      stakePercent: stakePercentComputed.value,
      isWeb3: task.category === 'web3' || task.isWeb3,
      files: uploadedFiles,
      createdAt: Math.floor(Date.now() / 1000),
      status: 'bidding',
      statusText: '竞标中',
      employer: walletAddress.value
    };
    
    // Web3任务额外字段
    if (taskData.isWeb3) {
      taskData.githubRepo = task.githubRepo;
      taskData.targetBranch = task.targetBranch;
      taskData.milestoneEnabled = true;
    }
    
    // 上传任务数据到IPFS
    const cid = await IPFSService.uploadData(taskData);
    
    // 保存CID到本地存储
    const publishedTasks = JSON.parse(localStorage.getItem('publishedTasks') || '[]');
    publishedTasks.push({
      cid,
      title: taskData.title,
      reward: taskData.reward,
      category: taskData.category,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('publishedTasks', JSON.stringify(publishedTasks));
    
    alert(`任务发布成功！CID: ${cid}`);
    
    // 重置表单
    task.title = '';
    task.category = '';
    task.tags = '';
    task.description = '';
    task.reward = 100;
    task.bidDeadline = '';
    task.duration = 14;
    task.maxParticipants = '';
    task.stakePercent = 10;
    task.riskLevel = 'medium';
    task.isWeb3 = false;
    task.githubRepo = '';
    task.targetBranch = 'main';
    task.milestoneEnabled = false;
    task.milestones = [{ name: '', rewardPercent: 30, criteria: '' }];
    task.files = [];
    
  } catch (error) {
    console.error('任务发布失败:', error);
    alert(`任务发布失败: ${error.message}`);
  } finally {
    // 恢复按钮状态
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// 将日期转换为Unix时间戳
const formatDateToUnix = (dateString) => {
  return Math.floor(new Date(dateString).getTime() / 1000);
};

// 重命名函数以避免冲突
function getFileIconClass(file) {
  const type = file.type || file.name.split('.').pop().toLowerCase();
  
  if (type.includes('pdf')) return 'fas fa-file-pdf';
  if (type.includes('word') || type.includes('doc')) return 'fas fa-file-word';
  if (type.includes('image')) return 'fas fa-file-image';
  if (type.includes('zip') || type.includes('rar')) return 'fas fa-file-archive';
  return 'fas fa-file';
}

// 添加支持的文件类型列表
const ACCEPTED_FILE_TYPES = [
  'application/pdf', 
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 
  'image/png', 
  'image/gif',
  'application/zip',
  'application/x-zip-compressed'
];

// 最大文件大小 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 监听任务类别变化，自动勾选Web3任务流程和分阶段验收
watch(() => task.category, (val) => {
  if (val === 'web3') {
    task.isWeb3 = true
    task.milestoneEnabled = true
  }
})
</script>

<style scoped>
/* 头部 */
.publish-header {
  padding: 80px 0 40px;
  text-align: center;
  background: var(--purple-gradient);
  color: white;
  position: relative;
  overflow: hidden;
  /* 新增：全宽无留白 */
  width: 100vw;
  min-width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  max-width: 100vw;
  box-sizing: border-box;
}

.publish-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.2;
}

.publish-header-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.publish-title {
  font-size: 2.8rem;
  margin-bottom: 20px;
  font-weight: 800;
}

.publish-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 30px;
}

.steps-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.step-card {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
  padding: 20px;
  width: 200px;
  text-align: center;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px); /* Safari 9+ */
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin: 0 auto 15px;
}

.step-title {
  font-size: 1.1rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.step-description {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 表单区域 */
.form-section {
  padding: 60px 0;
}

.form-container {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
}

.form-header {
  background: var(--purple-gradient);
  color: white;
  padding: 25px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-title {
  font-size: 1.8rem;
}

.form-body {
  padding: 40px;
}

.form-section-title {
  font-size: 1.4rem;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-section-title i {
  color: var(--primary);
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.required::after {
  content: '*';
  color: var(--error);
  margin-left: 4px;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: var(--transition);
  background-color: var(--background);
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
}

.form-textarea {
  min-height: 150px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 6px;
}

.form-hint i {
  color: var(--info);
  margin-right: 5px;
}

.form-divider {
  height: 1px;
  background-color: var(--border);
  margin: 30px 0;
}

/* 文件上传 */
.file-upload {
  border: 2px dashed var(--border);
  border-radius: var(--radius-md);
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
  transition: var(--transition);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none; /* Safari 3+ */
}

.file-upload:hover {
  border-color: var(--primary);
  background-color: rgba(108, 99, 255, 0.05);
}

.upload-icon {
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 15px;
}

.upload-text {
  margin-bottom: 15px;
}

.upload-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--background);
  border-radius: var(--radius-md);
  font-weight: 500;
  color: var(--text-primary);
  transition: var(--transition);
}

.file-upload:hover .upload-btn {
  background-color: var(--primary);
  color: white;
}

.file-list {
  margin-top: 20px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  margin-bottom: 10px;
  background-color: var(--background);
}

.file-icon {
  color: var(--primary);
  margin-right: 10px;
  font-size: 1.2rem;
}

.file-name {
  flex: 1;
  font-size: 0.95rem;
}

.file-size {
  color: var(--text-secondary);
  margin: 0 15px;
  font-size: 0.85rem;
}

.file-remove {
  color: var(--error);
  cursor: pointer;
  padding: 5px;
}

/* 高级选项 */
.advanced-options {
  background-color: var(--background);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 25px;
}

.advanced-toggle {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 15px;
}

.advanced-toggle i {
  margin-right: 10px;
  transition: var(--transition);
}

.advanced-content {
  padding-top: 15px;
  border-top: 1px solid var(--border);
  display: none;
}

.advanced-options.active .advanced-content {
  display: block;
}

.advanced-options.active .advanced-toggle i {
  transform: rotate(180deg);
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 15px;
}

/* 费用计算 */
.fee-calculation {
  background-color: var(--background);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-top: 30px;
}

.fee-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.fee-row span:last-child {
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.fee-total {
  border-top: 2px solid var(--border);
  font-weight: 700;
  font-size: 1.1rem;
  padding-top: 15px;
  margin-top: 10px;
  color: var(--primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .steps-container {
    flex-direction: column;
    align-items: center;
  }
  
  .step-card {
    width: 100%;
    max-width: 300px;
  }
  
  .form-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .publish-title {
    font-size: 2.2rem;
  }
}

.milestone-remove-btn {
  margin-top: 8px;
}

.file-input-hidden {
  display: none;
}

/* 添加文件类型图标样式 */
.file-item .file-icon {
  font-size: 1.2rem;
  margin-right: 10px;
}

.file-item .fa-file-pdf { color: #e74c3c; }
.file-item .fa-file-word { color: #2b579a; }
.file-item .fa-file-image { color: #27ae60; }
.file-item .fa-file-archive { color: #f39c12; }
</style>