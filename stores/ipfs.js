import { defineStore } from 'pinia'
import { create } from 'ipfs-http-client'
import axios from 'axios'

export const useIpfsStore = defineStore('ipfs', {
  state: () => ({
    client: null,
    loading: false,
    error: null,
    
    // 数据缓存
    cache: new Map(),
    cacheSize: 0,
    maxCacheSize: 50 * 1024 * 1024, // 50MB缓存限制
    
    // 网络状态
    networkStatus: {
      connected: false,
      peers: 0,
      latency: 0,
      lastCheck: null
    },
    
    // 统计信息
    stats: {
      uploads: 0,
      downloads: 0,
      cacheHits: 0,
      cacheMisses: 0
    }
  }),

  getters: {
    isConnected: (state) => state.client && !state.error,
    cacheUsage: (state) => (state.cacheSize / state.maxCacheSize * 100).toFixed(1),
    networkLatency: (state) => state.networkStatus.latency
  },

  actions: {
    async initIPFS() {
      try {
        // 连接到本地IPFS节点
        this.client = create({
          host: '127.0.0.1',
          port: 5001,
          protocol: 'http',
          timeout: 10000 // 10秒超时
        })
        
        // 测试连接并获取网络状态
        const startTime = Date.now()
        const version = await this.client.version()
        const endTime = Date.now()
        
        this.networkStatus.connected = true
        this.networkStatus.latency = endTime - startTime
        this.networkStatus.lastCheck = new Date()
        
        // 获取节点信息
        try {
          const swarmPeers = await this.client.swarm.peers()
          this.networkStatus.peers = swarmPeers.length
        } catch (error) {
          console.warn('无法获取节点信息:', error)
          this.networkStatus.peers = 0
        }
        
        console.log('IPFS连接成功', {
          version: version.version,
          latency: this.networkStatus.latency + 'ms',
          peers: this.networkStatus.peers
        })
        
        this.error = null
        
      } catch (error) {
        console.error('IPFS连接失败:', error)
        this.error = 'IPFS连接失败，请确保IPFS节点正在运行'
        this.networkStatus.connected = false
        throw error
      }
    },

    // 检查网络状态
    async checkNetworkStatus() {
      if (!this.client) {
        return false
      }

      try {
        const startTime = Date.now()
        await this.client.version()
        const endTime = Date.now()
        
        this.networkStatus.connected = true
        this.networkStatus.latency = endTime - startTime
        this.networkStatus.lastCheck = new Date()
        
        // 更新节点数量
        try {
          const swarmPeers = await this.client.swarm.peers()
          this.networkStatus.peers = swarmPeers.length
        } catch (error) {
          // 忽略节点信息获取失败
        }
        
        return true
      } catch (error) {
        this.networkStatus.connected = false
        this.error = 'IPFS网络连接中断'
        return false
      }
    },

    // 缓存管理
    getCacheKey(hash) {
      return `ipfs:${hash}`
    },

    addToCache(hash, data) {
      const key = this.getCacheKey(hash)
      const dataStr = typeof data === 'string' ? data : JSON.stringify(data)
      const size = new Blob([dataStr]).size
      
      // 检查缓存大小限制
      if (this.cacheSize + size > this.maxCacheSize) {
        this.clearOldCache()
      }
      
      this.cache.set(key, {
        data: dataStr,
        size,
        timestamp: Date.now(),
        accessCount: 0
      })
      
      this.cacheSize += size
    },

    getFromCache(hash) {
      const key = this.getCacheKey(hash)
      const cached = this.cache.get(key)
      
      if (cached) {
        cached.accessCount++
        this.stats.cacheHits++
        return cached.data
      }
      
      this.stats.cacheMisses++
      return null
    },

    clearOldCache() {
      // 清除最老的缓存项，直到缓存大小减少50%
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      const targetSize = this.maxCacheSize * 0.5
      let clearedSize = 0
      
      for (const [key, entry] of entries) {
        if (this.cacheSize - clearedSize <= targetSize) {
          break
        }
        
        this.cache.delete(key)
        clearedSize += entry.size
      }
      
      this.cacheSize -= clearedSize
      console.log(`清理缓存: ${clearedSize} bytes, 剩余: ${this.cacheSize} bytes`)
    },

    clearCache() {
      this.cache.clear()
      this.cacheSize = 0
      console.log('缓存已清空')
    },

    async uploadFile(file) {
      if (!this.client) {
        await this.initIPFS()
      }

      this.loading = true
      this.error = null

      try {
        // 添加文件到IPFS
        const result = await this.client.add(file, {
          progress: (bytes) => {
            console.log(`上传进度: ${bytes} bytes`)
          }
        })
        const hash = result.path
        
        this.stats.uploads++
        console.log('文件上传成功，IPFS Hash:', hash)
        return hash
      } catch (error) {
        console.error('文件上传失败:', error)
        this.error = '文件上传失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    async uploadJSON(data) {
      if (!this.client) {
        await this.initIPFS()
      }

      this.loading = true
      this.error = null

      try {
        const jsonString = JSON.stringify(data, null, 2)
        const result = await this.client.add(jsonString, {
          progress: (bytes) => {
            console.log(`JSON上传进度: ${bytes} bytes`)
          }
        })
        const hash = result.path
        
        // 添加到缓存
        this.addToCache(hash, jsonString)
        
        this.stats.uploads++
        console.log('JSON数据上传成功，IPFS Hash:', hash)
        return hash
      } catch (error) {
        console.error('JSON上传失败:', error)
        this.error = 'JSON数据上传失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getFile(hash) {
      if (!this.client) {
        await this.initIPFS()
      }

      // 检查缓存
      const cached = this.getFromCache(hash)
      if (cached) {
        console.log('从缓存获取数据:', hash)
        return cached
      }

      try {
        // 从IPFS获取文件
        const stream = this.client.cat(hash, { timeout: 30000 }) // 30秒超时
        let data = ''
        
        for await (const chunk of stream) {
          data += new TextDecoder().decode(chunk)
        }
        
        // 添加到缓存
        this.addToCache(hash, data)
        
        this.stats.downloads++
        console.log('从IPFS获取数据成功:', hash)
        return data
      } catch (error) {
        console.error('获取IPFS文件失败:', error)
        
        // 如果是超时错误，尝试通过Gateway获取
        if (error.message.includes('timeout') || error.message.includes('aborted')) {
          console.log('尝试通过Gateway获取数据:', hash)
          return await this.getFileViaGateway(hash)
        }
        
        throw error
      }
    },

    // 通过HTTP Gateway获取文件（备用方案）
    async getFileViaGateway(hash) {
      try {
        const response = await axios.get(`http://127.0.0.1:8080/ipfs/${hash}`, {
          timeout: 30000
        })
        
        const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
        
        // 添加到缓存
        this.addToCache(hash, data)
        
        this.stats.downloads++
        console.log('通过Gateway获取数据成功:', hash)
        return data
      } catch (error) {
        console.error('Gateway获取失败:', error)
        throw new Error(`无法获取IPFS数据: ${hash}`)
      }
    },

    async getJSON(hash) {
      try {
        const data = await this.getFile(hash)
        return JSON.parse(data)
      } catch (error) {
        console.error('解析IPFS JSON失败:', error)
        throw error
      }
    },

    // 批量获取JSON数据
    async getBatchJSON(hashes) {
      const promises = hashes.map(hash => this.getJSON(hash))
      
      try {
        const results = await Promise.allSettled(promises)
        
        return results.map((result, index) => ({
          hash: hashes[index],
          success: result.status === 'fulfilled',
          data: result.status === 'fulfilled' ? result.value : null,
          error: result.status === 'rejected' ? result.reason.message : null
        }))
      } catch (error) {
        console.error('批量获取数据失败:', error)
        throw error
      }
    },

    // 通过HTTP Gateway获取文件URL
    getFileURL(hash) {
      return `http://127.0.0.1:8080/ipfs/${hash}`
    },

    // 验证文件是否存在
    async fileExists(hash) {
      try {
        // 先检查缓存
        if (this.getFromCache(hash)) {
          return true
        }
        
        // 检查IPFS节点
        await this.client.object.stat(hash, { timeout: 5000 })
        return true
      } catch (error) {
        return false
      }
    },

    // 获取文件统计信息
    async getFileStats(hash) {
      try {
        const stats = await this.client.object.stat(hash)
        return {
          hash,
          size: stats.CumulativeSize,
          blocks: stats.NumLinks,
          exists: true
        }
      } catch (error) {
        return {
          hash,
          size: 0,
          blocks: 0,
          exists: false,
          error: error.message
        }
      }
    },

    // 获取IPFS节点状态
    getNodeStatus() {
      return {
        connected: this.networkStatus.connected,
        peers: this.networkStatus.peers,
        latency: this.networkStatus.latency,
        lastCheck: this.networkStatus.lastCheck,
        cacheSize: this.cacheSize,
        cacheUsage: this.cacheUsage + '%',
        stats: this.stats
      }
    },

    // 重置统计信息
    resetStats() {
      this.stats = {
        uploads: 0,
        downloads: 0,
        cacheHits: 0,
        cacheMisses: 0
      }
    }
  }
}) 