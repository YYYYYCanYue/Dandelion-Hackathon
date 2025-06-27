import { defineStore } from 'pinia'
import { useIpfsStore } from './ipfs'

export const useDataStore = defineStore('data', {
  state: () => ({
    // 数据缓存
    tasks: [],
    users: {},
    disputes: [],
    bids: {},
    userProfiles: {},
    
    // 数据索引文件的IPFS哈希
    dataIndexHash: null,
    
    // 加载状态
    loading: false,
    error: null,
    initialized: false,
    
    // 实时同步状态
    realTimeSync: {
      enabled: false,
      polling: false,
      interval: null,
      lastCheck: null,
      lastSync: null,
      syncInterval: 30000, // 30秒检查一次
      hasUpdates: false,
      status: 'idle' // idle, checking, syncing, error
    },
    
    // 数据统计
    stats: {
      totalTasks: 0,
      activeTasks: 0,
      completedTasks: 0,
      totalRewards: '0'
    }
  }),

  getters: {
    // 根据状态过滤任务
    tasksByStatus: (state) => (status) => {
      return state.tasks.filter(task => task.status === status)
    },

    // 根据类型过滤任务
    tasksByType: (state) => (type) => {
      return state.tasks.filter(task => task.taskType === type)
    },

    // 获取用户发布的任务
    tasksByCreator: (state) => (creator) => {
      return state.tasks.filter(task => task.creator.toLowerCase() === creator.toLowerCase())
    },

    // 获取用户参与的任务
    tasksByParticipant: (state) => (participant) => {
      return state.tasks.filter(task => {
        const taskBids = state.bids[task.id] || []
        return taskBids.some(bid => bid.bidder.toLowerCase() === participant.toLowerCase())
      })
    },

    // 获取任务的竞标
    getBidsByTaskId: (state) => (taskId) => {
      return state.bids[taskId] || []
    },

    // 获取用户资料
    getUserProfile: (state) => (address) => {
      return state.userProfiles[address.toLowerCase()] || null
    },

    // 实时同步状态
    syncStatus: (state) => state.realTimeSync.status,
    isSyncing: (state) => state.realTimeSync.status === 'syncing',
    hasNewUpdates: (state) => state.realTimeSync.hasUpdates
  },

  actions: {
    // 初始化数据 - 完全从IPFS加载数据
    async initializeData() {
      this.loading = true
      this.error = null
      
      try {
        const ipfsStore = useIpfsStore()
        await ipfsStore.initIPFS()
        
        // 尝试从localStorage获取数据索引哈希
        const savedIndexHash = localStorage.getItem('dandelion_data_index')
        
        if (savedIndexHash) {
          console.log('发现已保存的数据索引:', savedIndexHash)
          this.dataIndexHash = savedIndexHash
          
          try {
          await this.loadDataFromIndex()
            console.log('从IPFS成功加载数据')
          } catch (error) {
            console.warn('从IPFS加载数据失败，将使用空数据:', error)
            this.clearAllData()
          }
        } else {
          console.log('未发现数据索引，使用空数据状态')
          this.clearAllData()
        }
        
        this.initialized = true
        this.updateStats()
        
        // 启动实时同步
        this.startRealTimeSync()
        
      } catch (error) {
        console.error('初始化数据失败:', error)
        this.error = 'IPFS连接失败，请确保IPFS节点正在运行'
        this.clearAllData()
      } finally {
        this.loading = false
      }
    },

    // 从数据索引加载所有数据
    async loadDataFromIndex() {
      const ipfsStore = useIpfsStore()
      
      try {
        console.log('正在从IPFS加载数据索引:', this.dataIndexHash)
        
        // 获取数据索引
        const dataIndex = await ipfsStore.getJSON(this.dataIndexHash)
        console.log('数据索引内容:', dataIndex)
        
        // 并行加载所有数据
        const loadPromises = []
        const dataTypes = []
        
        if (dataIndex.tasksHash) {
          loadPromises.push(ipfsStore.getJSON(dataIndex.tasksHash))
          dataTypes.push('tasks')
        } else {
          loadPromises.push(Promise.resolve([]))
          dataTypes.push('tasks')
        }
        
        if (dataIndex.usersHash) {
          loadPromises.push(ipfsStore.getJSON(dataIndex.usersHash))
          dataTypes.push('users')
        } else {
          loadPromises.push(Promise.resolve({}))
          dataTypes.push('users')
        }
        
        if (dataIndex.disputesHash) {
          loadPromises.push(ipfsStore.getJSON(dataIndex.disputesHash))
          dataTypes.push('disputes')
        } else {
          loadPromises.push(Promise.resolve([]))
          dataTypes.push('disputes')
        }
        
        if (dataIndex.bidsHash) {
          loadPromises.push(ipfsStore.getJSON(dataIndex.bidsHash))
          dataTypes.push('bids')
        } else {
          loadPromises.push(Promise.resolve({}))
          dataTypes.push('bids')
        }
        
        if (dataIndex.profilesHash) {
          loadPromises.push(ipfsStore.getJSON(dataIndex.profilesHash))
          dataTypes.push('profiles')
        } else {
          loadPromises.push(Promise.resolve({}))
          dataTypes.push('profiles')
        }
        
        const results = await Promise.all(loadPromises)
        
        // 分配加载的数据
        for (let i = 0; i < results.length; i++) {
          const dataType = dataTypes[i]
          const data = results[i]
          
          switch (dataType) {
            case 'tasks':
              this.tasks = Array.isArray(data) ? data : []
              break
            case 'users':
              this.users = typeof data === 'object' ? data : {}
              break
            case 'disputes':
              this.disputes = Array.isArray(data) ? data : []
              break
            case 'bids':
              this.bids = typeof data === 'object' ? data : {}
              break
            case 'profiles':
              this.userProfiles = typeof data === 'object' ? data : {}
              break
          }
        }
        
        console.log('数据加载完成:', {
          tasks: this.tasks.length,
          users: Object.keys(this.users).length,
          disputes: this.disputes.length,
          bids: Object.keys(this.bids).length,
          profiles: Object.keys(this.userProfiles).length
        })
        
      } catch (error) {
        console.error('从索引加载数据失败:', error)
        throw error
      }
    },

    // 清空所有数据
    clearAllData() {
      this.tasks = []
      this.users = {}
      this.disputes = []
      this.bids = {}
      this.userProfiles = {}
      this.updateStats()
    },

    // 保存数据到IPFS
    async saveData() {
      const ipfsStore = useIpfsStore()
      this.loading = true

      try {
        console.log('正在保存数据到IPFS...')
        
        // 上传更新的数据
        const uploadPromises = [
          ipfsStore.uploadJSON(this.tasks),
          ipfsStore.uploadJSON(this.bids),
          ipfsStore.uploadJSON(this.disputes),
          ipfsStore.uploadJSON(this.userProfiles)
        ]
        
        const [tasksHash, bidsHash, disputesHash, profilesHash] = await Promise.all(uploadPromises)
        
        console.log('数据上传完成:', {
          tasksHash,
          bidsHash,
          disputesHash,
          profilesHash
        })

        // 更新数据索引
        const dataIndex = {
          version: '1.0.0',
          updatedAt: new Date().toISOString(),
          tasksHash,
          usersHash: null, // 暂时不需要
          disputesHash,
          bidsHash,
          profilesHash
        }

        // 上传新的数据索引
        const indexHash = await ipfsStore.uploadJSON(dataIndex)
        
        // 更新本地索引
        localStorage.setItem('dandelion_data_index', indexHash)
        this.dataIndexHash = indexHash

        console.log('数据索引保存成功:', indexHash)
        return indexHash

      } catch (error) {
        console.error('保存数据失败:', error)
        this.error = '数据保存失败: ' + error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // 添加新任务
    async addTask(taskData, autoSave = true) {
      const newTask = {
        id: taskData.id || Date.now(),
        ...taskData,
        createdAt: taskData.createdAt || new Date().toISOString(),
        participants: taskData.participants || 0,
        status: taskData.status !== undefined ? taskData.status : 0
      }

      this.tasks.push(newTask)
      
      if (autoSave) {
        await this.saveData()
      }
      
      this.updateStats()
      
      return newTask
    },

    // 更新任务
    async updateTask(taskId, updates) {
      const taskIndex = this.tasks.findIndex(task => task.id === taskId)
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates }
        await this.saveData()
        this.updateStats()
      }
    },

    // 添加竞标
    async addBid(taskId, bidData) {
      if (!this.bids[taskId]) {
        this.bids[taskId] = []
      }

      const newBid = {
        id: Date.now(),
        ...bidData,
        timestamp: new Date().toISOString(),
        isWinner: false
      }

      this.bids[taskId].push(newBid)
      
      // 更新任务参与者数量
      const task = this.tasks.find(t => t.id === taskId)
      if (task) {
        task.participants = this.bids[taskId].length
      }

      await this.saveData()
      return newBid
    },

    // 添加争议
    async addDispute(disputeData) {
      const newDispute = {
        id: Date.now(),
        ...disputeData,
        createdAt: new Date().toISOString(),
        status: 0,
        votes: { for: 0, against: 0 },
        requiredVotes: 5
      }

      this.disputes.push(newDispute)
      await this.saveData()
      
      return newDispute
    },

    // 更新用户资料
    async updateUserProfile(address, profileData) {
      const key = address.toLowerCase()
      this.userProfiles[key] = {
        ...this.userProfiles[key],
        ...profileData,
        address
      }
      
      await this.saveData()
    },

    // 更新统计数据
    updateStats() {
      this.stats.totalTasks = this.tasks.length
      this.stats.activeTasks = this.tasks.filter(task => task.status === 0 || task.status === 1).length
      this.stats.completedTasks = this.tasks.filter(task => task.status === 3).length
      
      const totalRewards = this.tasks.reduce((sum, task) => {
        return sum + parseFloat(task.reward || 0)
      }, 0)
      this.stats.totalRewards = totalRewards.toFixed(1)
    },

    // 清除本地数据索引
    clearLocalDataIndex() {
      localStorage.removeItem('dandelion_data_index')
      this.dataIndexHash = null
      this.clearAllData()
    },

    // 手动刷新数据
    async refreshData() {
      if (this.dataIndexHash) {
        await this.loadDataFromIndex()
      this.updateStats()
      }
    },

    // 检查IPFS连接状态
    async checkIPFSConnection() {
      const ipfsStore = useIpfsStore()
      try {
        await ipfsStore.initIPFS()
        return true
      } catch (error) {
        console.error('IPFS连接检查失败:', error)
        return false
      }
    },

    // 启动实时同步
    startRealTimeSync() {
      if (this.realTimeSync.enabled || !this.dataIndexHash) {
        return
      }

      console.log('启动实时IPFS数据同步...')
      this.realTimeSync.enabled = true
      this.realTimeSync.lastCheck = new Date()
      
      // 设置定时检查
      this.realTimeSync.interval = setInterval(async () => {
        await this.checkForUpdates()
      }, this.realTimeSync.syncInterval)
      
      console.log(`实时同步已启动，检查间隔: ${this.realTimeSync.syncInterval / 1000}秒`)
    },

    // 停止实时同步
    stopRealTimeSync() {
      if (!this.realTimeSync.enabled) {
        return
      }

      console.log('停止实时IPFS数据同步...')
      this.realTimeSync.enabled = false
      
      if (this.realTimeSync.interval) {
        clearInterval(this.realTimeSync.interval)
        this.realTimeSync.interval = null
      }
      
      this.realTimeSync.status = 'idle'
      this.realTimeSync.polling = false
    },

    // 检查数据更新
    async checkForUpdates() {
      if (this.realTimeSync.polling || !this.dataIndexHash) {
        return
      }

      this.realTimeSync.polling = true
      this.realTimeSync.status = 'checking'
      this.realTimeSync.lastCheck = new Date()

      try {
        const ipfsStore = useIpfsStore()
        
        // 检查是否有新的数据索引
        const remoteIndexes = await this.discoverDataIndexes()
        
        if (remoteIndexes.length > 0) {
          // 找到最新的数据索引
          const latestIndex = remoteIndexes.sort((a, b) => 
            new Date(b.updatedAt) - new Date(a.updatedAt)
          )[0]
          
          // 检查是否比当前索引更新
          if (latestIndex.hash !== this.dataIndexHash) {
            console.log('发现新的数据索引:', latestIndex.hash)
            this.realTimeSync.hasUpdates = true
            
            // 自动同步新数据
            await this.syncWithLatestData(latestIndex.hash)
          }
        }
        
        this.realTimeSync.status = 'idle'
        
      } catch (error) {
        console.error('检查数据更新失败:', error)
        this.realTimeSync.status = 'error'
        this.error = '数据同步检查失败: ' + error.message
      } finally {
        this.realTimeSync.polling = false
      }
    },

    // 发现数据索引（模拟从网络或其他节点获取）
    async discoverDataIndexes() {
      // 这里可以实现从多个来源发现数据索引的逻辑
      // 比如从其他IPFS节点、DHT、或者专门的索引服务
      
      // 目前返回当前索引作为示例
      if (this.dataIndexHash) {
        try {
          const ipfsStore = useIpfsStore()
          const currentIndex = await ipfsStore.getJSON(this.dataIndexHash)
          return [{
            hash: this.dataIndexHash,
            updatedAt: currentIndex.updatedAt || new Date().toISOString()
          }]
        } catch (error) {
          console.warn('无法获取当前数据索引:', error)
          return []
        }
      }
      
      return []
    },

    // 同步最新数据
    async syncWithLatestData(newIndexHash) {
      if (this.realTimeSync.status === 'syncing') {
        return
      }

      this.realTimeSync.status = 'syncing'
      
      try {
        console.log('开始同步最新数据:', newIndexHash)
        
        const oldIndexHash = this.dataIndexHash
        this.dataIndexHash = newIndexHash
        
        // 加载新数据
        await this.loadDataFromIndex()
        
        // 更新本地存储
        localStorage.setItem('dandelion_data_index', newIndexHash)
        
        this.realTimeSync.lastSync = new Date()
        this.realTimeSync.hasUpdates = false
        
        console.log('数据同步完成:', {
          from: oldIndexHash,
          to: newIndexHash,
          tasks: this.tasks.length
        })
        
        // 触发数据更新事件
        this.notifyDataUpdated()
        
        this.updateStats()
        
      } catch (error) {
        console.error('同步数据失败:', error)
        this.error = '数据同步失败: ' + error.message
        throw error
      } finally {
        this.realTimeSync.status = 'idle'
      }
    },

    // 手动触发数据同步
    async forceSyncData() {
      console.log('手动触发数据同步...')
      await this.checkForUpdates()
    },

    // 设置同步间隔
    setSyncInterval(intervalMs) {
      this.realTimeSync.syncInterval = intervalMs
      
      if (this.realTimeSync.enabled) {
        // 重启同步以应用新间隔
        this.stopRealTimeSync()
        this.startRealTimeSync()
      }
    },

    // 通知数据已更新（可以被组件监听）
    notifyDataUpdated() {
      // 触发自定义事件
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dandelion:dataUpdated', {
          detail: {
            timestamp: new Date(),
            tasksCount: this.tasks.length,
            indexHash: this.dataIndexHash
          }
        }))
      }
    },

    // 获取同步状态信息
    getSyncStatus() {
      return {
        enabled: this.realTimeSync.enabled,
        status: this.realTimeSync.status,
        lastCheck: this.realTimeSync.lastCheck,
        lastSync: this.realTimeSync.lastSync,
        hasUpdates: this.realTimeSync.hasUpdates,
        interval: this.realTimeSync.syncInterval
      }
    }
  }
}) 