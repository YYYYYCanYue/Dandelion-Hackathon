import { defineStore } from 'pinia'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, AVALANCHE_FUJI, validateContractConfig } from '../utils/contracts.js'
import ContractService from '../utils/contractService.js'

// 确保ethers v5的正确导入
const { providers, utils } = ethers

export const useWeb3Store = defineStore('web3', {
  state: () => ({
    // 连接状态
    isConnected: false,
    account: null,
    balance: '0',
    chainId: null,

    // 合约实例
    provider: null,
    signer: null,
    contractService: null,
    contracts: {
      taskFactory: null,
      biddingSystem: null,
      escrow: null,
      disputeDAO: null
    },

    // 错误和加载状态
    error: null,
    loading: false,

    // 交易状态
    pendingTx: null,
    txHistory: [],

    // 合约配置验证状态
    contractConfigValid: false,
    configErrors: []
  }),

  getters: {
    // 格式化余额显示
    formattedBalance: (state) => {
      return parseFloat(state.balance).toFixed(4)
    },

    // 检查是否在正确的网络
    isCorrectNetwork: (state) => {
      return state.chainId === 43113 // Avalanche Fuji
    },

    // 获取网络名称
    networkName: (state) => {
      const networks = {
        1: 'Ethereum Mainnet',
        43113: 'Avalanche Fuji Testnet',
        43114: 'Avalanche Mainnet'
      }
      return networks[state.chainId] || 'Unknown Network'
    },

    // 格式化地址显示
    formatAddress: (state) => (address) => {
      if (!address) return ''
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    },

    // 检查合约服务是否可用
    isContractServiceReady: (state) => {
      return !!state.contractService && state.contractConfigValid
    },

    // 获取用户身份信息
    getUserRole: (state) => (taskData) => {
      if (!state.account || !taskData) return 'guest'
      
      const userAddress = state.account.toLowerCase()
      const creatorAddress = taskData.creator?.toLowerCase()
      
      if (userAddress === creatorAddress) {
        return 'employer'
      }
      
      // 这里可以根据更多条件判断用户角色
      return 'visitor'
    },

    // 检查用户权限
    checkPermissions: (state) => (taskData, action) => {
      if (!state.account || !taskData) return false
      
      const userAddress = state.account.toLowerCase()
      const creatorAddress = taskData.creator?.toLowerCase()
      const isCreator = userAddress === creatorAddress
      
      const permissions = {
        'view': true,
        'edit': isCreator && taskData.status === 0,
        'bid': !isCreator && taskData.status === 0,
        'selectWinner': isCreator && taskData.status === 1,
        'confirmCompletion': isCreator && taskData.status === 2,
        'submitWork': !isCreator && taskData.status === 1, // 需要进一步判断是否为中标者
        'createDispute': (isCreator || !isCreator) && [2, 3].includes(taskData.status),
        'manageTask': isCreator
      }
      
      return permissions[action] || false
    }
  },

  actions: {
    // 验证合约配置
    validateConfig() {
      const validation = validateContractConfig()
      this.contractConfigValid = validation.valid
      this.configErrors = validation.errors
      
      if (!validation.valid) {
        console.warn('合约配置验证失败:', validation.errors)
      } else {
        console.log('合约配置验证成功')
      }
      
      return validation
    },

    // 连接钱包
    async connectWallet() {
      try {
        this.loading = true
        this.error = null

        // 首先验证合约配置
        const configValidation = this.validateConfig()
        if (!configValidation.valid) {
          console.warn('合约配置存在问题，但继续连接钱包:', configValidation.errors)
        }

        if (!window.ethereum) {
          throw new Error('请安装MetaMask钱包')
        }

        // 检查是否已经连接
        const existingAccounts = await window.ethereum.request({
          method: 'eth_accounts'
        })

        let accounts
        if (existingAccounts.length > 0) {
          // 如果已经有授权的账户，直接使用
          accounts = existingAccounts
          console.log('使用已授权的账户:', accounts[0])
        } else {
          // 请求账户访问权限
          try {
            accounts = await window.ethereum.request({
              method: 'eth_requestAccounts'
            })
          } catch (requestError) {
            // 处理待处理请求错误
            if (requestError.code === -32002) {
              throw new Error('MetaMask有待处理的连接请求，请在MetaMask中处理或等待几秒后重试')
            } else if (requestError.code === 4001) {
              throw new Error('用户拒绝了连接请求')
            } else {
              throw requestError
            }
          }
        }

        if (accounts.length === 0) {
          throw new Error('未找到可用账户')
        }

        this.account = accounts[0]

        // 获取网络信息 - 使用更稳定的直接方式
        try {
          const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })
          this.chainId = parseInt(chainIdHex, 16)
          console.log('当前网络ID:', this.chainId)
        } catch (chainError) {
          console.warn('获取chainId失败:', chainError)
          this.chainId = 1 // 默认为以太坊主网
        }

        // 延迟初始化provider，避免代理问题
        await new Promise(resolve => setTimeout(resolve, 500))

        // 初始化provider和signer - 使用更稳定的方式
        try {
          this.provider = new providers.Web3Provider(window.ethereum, 'any')
          // 设置provider的网络检测为手动模式，避免自动网络检测导致的代理问题
          this.provider._network = {
            chainId: this.chainId,
            name: this.chainId === 43113 ? 'avalanche-fuji' : 'unknown'
          }
          
          this.signer = this.provider.getSigner()
          console.log('Provider初始化成功')
        } catch (providerError) {
          console.error('Provider初始化失败:', providerError)
          // 即使provider初始化失败，也继续连接过程
          this.provider = null
          this.signer = null
        }

        // 获取余额
        await this.updateBalance()

        // 初始化合约
        await this.initializeContracts()

        // 设置事件监听器
        this.setupEventListeners()

        this.isConnected = true
        console.log('🎉 钱包连接成功!')
        console.log('账户地址:', this.account)
        console.log('网络ID:', this.chainId)
        console.log('余额:', this.formattedBalance, 'AVAX')

      } catch (error) {
        console.error('连接钱包失败:', error)
        this.error = error.message || '连接失败'
        this.isConnected = false
        throw error
      } finally {
        this.loading = false
      }
    },

    // 断开钱包连接
    async disconnectWallet() {
      this.isConnected = false
      this.account = null
      this.balance = '0'
      this.chainId = null
      this.provider = null
      this.signer = null
      this.contracts = {
        taskFactory: null,
        biddingSystem: null,
        escrow: null,
        disputeDAO: null
      }
      this.error = null
      console.log('钱包已断开连接')
    },

    // 切换到Avalanche网络
    async switchToAvalanche() {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: AVALANCHE_FUJI.chainId }]
        })
      } catch (switchError) {
        // 如果网络不存在，则添加网络
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_FUJI]
          })
        } else {
          throw switchError
        }
      }
    },

    // 更新余额
    async updateBalance() {
      if (!this.account) return

      try {
        // 使用直接的ethereum.request方法获取余额，避免provider代理问题
        let balance = null
        let retryCount = 0
        const maxRetries = 3

        while (!balance && retryCount < maxRetries) {
          try {
            await new Promise(resolve => setTimeout(resolve, 100 * retryCount)) // 延迟重试

            // 方法1: 直接使用ethereum.request获取余额
            const balanceHex = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [this.account, 'latest']
            })

            // 转换hex到wei再到ether
            const balanceWei = BigInt(balanceHex)
            this.balance = utils.formatEther(balanceWei.toString())
            console.log('余额获取成功 (直接方法):', this.balance, 'AVAX')
            break

          } catch (balanceError) {
            retryCount++
            console.warn(`获取余额失败 (尝试 ${retryCount}/${maxRetries}):`, balanceError)

            if (retryCount >= maxRetries) {
              console.error('获取余额最终失败，尝试备用方法')

              // 备用方法: 使用provider（如果可用）
              try {
                if (this.provider) {
                  const balanceWei = await this.provider.getBalance(this.account)
                  this.balance = utils.formatEther(balanceWei)
                  console.log('余额获取成功 (备用方法):', this.balance, 'AVAX')
                  break
                }
              } catch (providerError) {
                console.error('备用方法也失败，设置余额为0:', providerError)
                this.balance = '0'
              }
            }
          }
        }
      } catch (error) {
        console.error('获取余额失败:', error)
        this.balance = '0'
      }
    },

    // 初始化智能合约
    async initializeContracts() {
      if (!this.signer) {
        console.warn('无法初始化合约：signer未设置')
        return
      }

      try {
        // 验证合约配置
        const configValidation = this.validateConfig()
        if (!configValidation.valid) {
          throw new Error(`合约配置无效: ${configValidation.errors.join(', ')}`)
        }

        console.log('开始初始化智能合约服务...')

        // 创建合约服务实例
        this.contractService = new ContractService(this.provider, this.signer)
        
        // 获取合约实例以保持向后兼容
        this.contracts = this.contractService.contracts

        console.log('合约服务初始化成功!')
        console.log('- TaskFactory:', CONTRACT_ADDRESSES.TASK_FACTORY)
        console.log('- BiddingSystem:', CONTRACT_ADDRESSES.BIDDING_SYSTEM)  
        console.log('- Escrow:', CONTRACT_ADDRESSES.ESCROW)
        console.log('- DisputeDAO:', CONTRACT_ADDRESSES.DISPUTE_DAO)

        // 验证合约是否可访问（尝试调用只读方法）
        try {
          console.log('验证合约可访问性...')
          
          // 检查TaskFactory合约
          if (this.contracts.taskFactory.taskCount) {
            const taskCount = await this.contracts.taskFactory.taskCount()
            console.log('✅ TaskFactory合约验证成功，当前任务数量:', taskCount.toString())
          }

          // 检查其他合约的factorySet状态
          const contractChecks = [
            { name: 'Escrow', contract: this.contracts.escrow },
            { name: 'BiddingSystem', contract: this.contracts.biddingSystem },
            { name: 'DisputeDAO', contract: this.contracts.disputeDAO }
          ]

          for (const { name, contract } of contractChecks) {
            if (contract && contract.factorySet) {
              try {
                const factorySet = await contract.factorySet()
                console.log(`✅ ${name}合约验证成功，factory设置状态:`, factorySet)
              } catch (err) {
                console.warn(`⚠️  ${name}合约验证失败:`, err.message)
              }
            }
          }

        } catch (verifyError) {
          console.warn('合约验证过程中出现警告:', verifyError.message)
          // 验证失败不阻止初始化完成，只是记录警告
        }

        console.log('🎉 智能合约服务初始化完成!')

      } catch (error) {
        console.error('初始化合约失败:', error)
        this.error = `合约初始化失败: ${error.message}`
        
        // 清空合约实例
        this.contractService = null
        this.contracts = {
          taskFactory: null,
          biddingSystem: null,
          escrow: null,
          disputeDAO: null
        }
        
        throw error
      }
    },

    // 设置事件监听器
    setupEventListeners() {
      if (!window.ethereum) return

      // 清除之前的监听器（避免重复监听）
      if (window.ethereum.removeAllListeners) {
        window.ethereum.removeAllListeners('accountsChanged')
        window.ethereum.removeAllListeners('chainChanged')
      }

      // 监听账户变化
      window.ethereum.on('accountsChanged', async (accounts) => {
        console.log('账户变化:', accounts)
        if (accounts.length === 0) {
          await this.disconnectWallet()
        } else {
          this.account = accounts[0]
          await this.updateBalance()
          await this.initializeContracts()
        }
      })

      // 监听网络变化
      window.ethereum.on('chainChanged', async (chainIdHex) => {
        console.log('网络变化:', chainIdHex)
        try {
          this.chainId = parseInt(chainIdHex, 16)
          console.log('新的网络ID:', this.chainId)

          if (this.isCorrectNetwork) {
            await this.updateBalance()
            await this.initializeContracts()
          } else {
            console.log('当前网络不是Avalanche Fuji测试网')
          }
        } catch (error) {
          console.error('处理网络变化失败:', error)
        }
      })

      console.log('事件监听器设置完成')
    },

    // 执行交易
    async executeTransaction(contractMethod, ...args) {
      try {
        this.loading = true
        this.error = null

        if (!this.isConnected) {
          throw new Error('请先连接钱包')
        }

        if (!this.isCorrectNetwork) {
          throw new Error('请切换到Avalanche Fuji测试网')
        }

        if (!this.provider || !this.signer) {
          throw new Error('钱包连接异常，请重新连接钱包')
        }

        console.log('准备执行交易...')
        console.log('参数:', args)

        // 执行交易
        const tx = await contractMethod(...args)
        this.pendingTx = tx.hash

        console.log('交易发送成功:', tx.hash)

        // 等待交易确认
        const receipt = await tx.wait()

        // 添加到交易历史
        this.txHistory.unshift({
          hash: tx.hash,
          timestamp: new Date().toISOString(),
          status: receipt.status === 1 ? 'success' : 'failed',
          gasUsed: receipt.gasUsed.toString()
        })

        // 更新余额
        await this.updateBalance()

        this.pendingTx = null
        console.log('交易确认成功:', receipt)

        return receipt

      } catch (error) {
        console.error('交易执行失败:', error)
        
        // 更详细的错误处理
        let errorMessage = '交易失败'
        
        if (error.code === 4001) {
          errorMessage = '用户取消了交易'
        } else if (error.code === -32603) {
          errorMessage = '交易执行失败，请检查网络连接和gas费用'
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'AVAX余额不足，请确保有足够的余额支付奖励和gas费用'
        } else if (error.message.includes('user rejected')) {
          errorMessage = '用户拒绝了交易'
        } else if (error.message.includes('network')) {
          errorMessage = '网络连接问题，请检查网络设置'
        } else if (error.message.includes('deadline')) {
          errorMessage = '截止时间必须是未来时间'
        } else {
          errorMessage = error.message || '交易失败，请重试'
        }
        
        this.error = errorMessage
        this.pendingTx = null
        throw error
      } finally {
        this.loading = false
      }
    },

    // 任务相关方法
    async createTask(title, ipfsHash, reward, deadline, taskType) {
      if (!this.contracts.taskFactory) {
        throw new Error('合约未初始化')
      }

      const rewardWei = utils.parseEther(reward.toString())
      
      // 获取平台费用信息
      const [totalAmountWei, rewardAmountWei, platformFeeWei] = await this.contracts.taskFactory.calculateTotalAmount(rewardWei)
      
      console.log('任务创建费用明细:')
      console.log('- 奖励金额:', utils.formatEther(rewardAmountWei), 'AVAX')
      console.log('- 平台费用:', utils.formatEther(platformFeeWei), 'AVAX')
      console.log('- 总金额:', utils.formatEther(totalAmountWei), 'AVAX')

      return await this.executeTransaction(
        this.contracts.taskFactory.createTask,
        title,
        ipfsHash,
        rewardWei,
        Math.floor(new Date(deadline).getTime() / 1000),
        taskType,
        { value: totalAmountWei } // 发送总金额（奖励+平台费用）
      )
    },

    async participateInTask(taskId, demoUrl, depositAmount) {
      if (!this.contracts.taskFactory) {
        throw new Error('合约未初始化')
      }

      const depositWei = utils.parseEther(depositAmount.toString())

      return await this.executeTransaction(
        this.contracts.taskFactory.participateInTask,
        taskId,
        demoUrl,
        { value: depositWei }
      )
    },

    async selectWinner(taskId, winnerAddress) {
      if (!this.contracts.taskFactory) {
        throw new Error('合约未初始化')
      }

      return await this.executeTransaction(
        this.contracts.taskFactory.selectWinner,
        taskId,
        winnerAddress
      )
    },

    async confirmTask(taskId, approved) {
      if (!this.contracts.taskFactory) {
        throw new Error('合约未初始化')
      }

      return await this.executeTransaction(
        this.contracts.taskFactory.employerConfirmTask,
        taskId,
        approved
      )
    },

    // 争议相关方法
    async createDispute(taskId, description) {
      if (!this.contracts.disputeDAO) {
        throw new Error('合约未初始化')
      }

      return await this.executeTransaction(
        this.contracts.disputeDAO.createDispute,
        taskId,
        description
      )
    },

    async vote(disputeId, decision, reason) {
      if (!this.contracts.disputeDAO) {
        throw new Error('合约未初始化')
      }

      return await this.executeTransaction(
        this.contracts.disputeDAO.vote,
        disputeId,
        decision,
        reason
      )
    },

    async becomeArbitrator(stakeAmount) {
      if (!this.contracts.disputeDAO) {
        throw new Error('合约未初始化')
      }

      const stakeWei = utils.parseEther(stakeAmount.toString())

      return await this.executeTransaction(
        this.contracts.disputeDAO.becomeArbitrator,
        { value: stakeWei }
      )
    },

    // 清除错误
    clearError() {
      this.error = null
    },

    // 重新连接Provider
    async reconnectProvider() {
      if (!this.isConnected || !this.account) {
        throw new Error('请先连接钱包')
      }

      try {
        console.log('正在重新初始化Provider...')
        
        // 延迟初始化，避免代理问题
        await new Promise(resolve => setTimeout(resolve, 500))

        // 重新初始化provider和signer
        this.provider = new providers.Web3Provider(window.ethereum, 'any')
        
        // 设置provider的网络检测为手动模式
        this.provider._network = {
          chainId: this.chainId,
          name: this.chainId === 43113 ? 'avalanche-fuji' : 'unknown'
        }
        
        this.signer = this.provider.getSigner()
        
        // 重新初始化合约
        await this.initializeContracts()
        
        console.log('Provider重新连接成功')
        
      } catch (error) {
        console.error('重新连接Provider失败:', error)
        throw error
      }
    },

    // 自动连接钱包（页面刷新时）
    async autoConnect() {
      if (!window.ethereum) return

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        })

        if (accounts.length > 0) {
          await this.connectWallet()
        }
      } catch (error) {
        console.error('自动连接失败:', error)
      }
    },

    // 获取指定地址的余额
    async getBalance(address = null) {
      const targetAddress = address || this.account
      if (!targetAddress) return '0'

      try {
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [targetAddress, 'latest']
        })

        const balanceWei = BigInt(balanceHex)
        return utils.formatEther(balanceWei.toString())
      } catch (error) {
        console.error('获取余额失败:', error)
        return '0'
      }
    },

    // =============== 平台费用相关方法 ===============

    // 获取平台费用信息
    async getPlatformFeeInfo() {
      if (!this.contracts.taskFactory) {
        throw new Error('合约未初始化')
      }

      try {
        const [platformAddr, feeRate, totalFees] = await this.contracts.taskFactory.getPlatformFeeInfo()
        return {
          platformAddress: platformAddr,
          feeRate: feeRate.toNumber(), // 基点 (例如: 50 = 0.5%)
          feeRatePercent: (feeRate.toNumber() / 100).toFixed(2), // 百分比字符串
          totalFees: utils.formatEther(totalFees)
        }
      } catch (error) {
        console.error('获取平台费用信息失败:', error)
        throw error
      }
    },

    // 计算指定奖励金额的平台费用
    async calculatePlatformFee(rewardAmount) {
      if (!this.contracts.taskFactory) {
        throw new Error('合约未初始化')
      }

      try {
        const rewardWei = utils.parseEther(rewardAmount.toString())
        const platformFeeWei = await this.contracts.taskFactory.calculatePlatformFee(rewardWei)
        return utils.formatEther(platformFeeWei)
      } catch (error) {
        console.error('计算平台费用失败:', error)
        throw error
      }
    },

    // 计算创建任务所需的总金额
    async calculateTotalAmount(rewardAmount) {
      if (!this.contracts.taskFactory) {
        throw new Error('合约未初始化')
      }

      try {
        const rewardWei = utils.parseEther(rewardAmount.toString())
        const [totalAmountWei, rewardAmountWei, platformFeeWei] = await this.contracts.taskFactory.calculateTotalAmount(rewardWei)
        
        return {
          totalAmount: utils.formatEther(totalAmountWei),
          rewardAmount: utils.formatEther(rewardAmountWei),
          platformFee: utils.formatEther(platformFeeWei),
          totalAmountWei,
          rewardAmountWei,
          platformFeeWei
        }
      } catch (error) {
        console.error('计算总金额失败:', error)
        throw error
      }
    }
  }
}) 