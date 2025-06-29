import { defineStore } from 'pinia'
import { ethers } from 'ethers'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    // 连接状态
    isConnected: false,
    account: null,
    balance: '0',
    chainId: null,
    
    // Provider相关
    provider: null,
    signer: null,
    
    // 错误和加载状态
    error: null,
    loading: false,
    
    // 支持的网络
    supportedNetworks: {
      43113: 'Avalanche Fuji Testnet',
      43114: 'Avalanche Mainnet',
      1: 'Ethereum Mainnet'
    }
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
      return state.supportedNetworks[state.chainId] || 'Unknown Network'
    },

    // 格式化地址显示
    formatAddress: (state) => (address) => {
      if (!address) return ''
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    },

    // 检查钱包是否已连接且在正确网络
    isReady: (state) => {
      return state.isConnected && state.isCorrectNetwork
    }
  },

  actions: {
    // 连接钱包
    async connectWallet() {
      try {
        this.loading = true
        this.error = null

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
        this.isConnected = true

        // 获取网络信息
        try {
          const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })
          this.chainId = parseInt(chainIdHex, 16)
          console.log('当前网络ID:', this.chainId)
        } catch (chainError) {
          console.warn('获取chainId失败:', chainError)
          this.chainId = 1 // 默认为以太坊主网
        }

        // 初始化provider和signer
        try {
          this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
          this.signer = this.provider.getSigner()
          console.log('Provider初始化成功')
        } catch (providerError) {
          console.warn('Provider初始化失败:', providerError)
        }

        // 获取余额
        await this.updateBalance()

        // 设置事件监听器
        this.setupEventListeners()

        console.log('钱包连接成功:', this.account)
        return true

      } catch (error) {
        console.error('连接钱包失败:', error)
        this.error = error.message
        this.isConnected = false
        this.account = null
        throw error
      } finally {
        this.loading = false
      }
    },

    // 断开钱包连接
    async disconnectWallet() {
      try {
        this.isConnected = false
        this.account = null
        this.balance = '0'
        this.chainId = null
        this.provider = null
        this.signer = null
        this.error = null
        
        console.log('钱包已断开连接')
      } catch (error) {
        console.error('断开钱包连接失败:', error)
        this.error = error.message
      }
    },

    // 切换到Avalanche网络
    async switchToAvalanche() {
      try {
        if (!window.ethereum) {
          throw new Error('MetaMask未安装')
        }

        const avalancheFuji = {
          chainId: '0xa869', // 43113 in hex
          chainName: 'Avalanche Fuji Testnet',
          nativeCurrency: {
            name: 'AVAX',
            symbol: 'AVAX',
            decimals: 18
          },
          rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://testnet.snowtrace.io/']
        }

        try {
          // 尝试切换网络
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: avalancheFuji.chainId }]
          })
        } catch (switchError) {
          // 如果网络不存在，添加网络
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [avalancheFuji]
            })
          } else {
            throw switchError
          }
        }

        // 更新链ID
        this.chainId = 43113
        console.log('已切换到Avalanche Fuji网络')
        
      } catch (error) {
        console.error('切换网络失败:', error)
        this.error = error.message
        throw error
      }
    },

    // 更新余额
    async updateBalance() {
      try {
        if (!this.provider || !this.account) {
          return
        }

        const balance = await this.provider.getBalance(this.account)
        this.balance = ethers.utils.formatEther(balance)
        
      } catch (error) {
        console.error('更新余额失败:', error)
        this.error = error.message
      }
    },

    // 设置事件监听器
    setupEventListeners() {
      if (!window.ethereum) return

      // 监听账户变化
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('账户变化:', accounts)
        if (accounts.length === 0) {
          this.disconnectWallet()
        } else {
          this.account = accounts[0]
          this.updateBalance()
        }
      })

      // 监听网络变化
      window.ethereum.on('chainChanged', (chainId) => {
        console.log('网络变化:', chainId)
        this.chainId = parseInt(chainId, 16)
        this.updateBalance()
      })

      // 监听连接状态变化
      window.ethereum.on('connect', (connectInfo) => {
        console.log('MetaMask已连接:', connectInfo)
        this.chainId = parseInt(connectInfo.chainId, 16)
      })

      // 监听断开连接
      window.ethereum.on('disconnect', (error) => {
        console.log('MetaMask已断开连接:', error)
        this.disconnectWallet()
      })
    },

    // 自动连接（页面刷新时）
    async autoConnect() {
      try {
        if (!window.ethereum) {
          return false
        }

        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        })

        if (accounts.length > 0) {
          this.account = accounts[0]
          this.isConnected = true

          // 获取网络信息
          const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })
          this.chainId = parseInt(chainIdHex, 16)

          // 初始化provider
          this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
          this.signer = this.provider.getSigner()

          // 更新余额
          await this.updateBalance()

          // 设置事件监听器
          this.setupEventListeners()

          console.log('自动连接成功:', this.account)
          return true
        }

        return false
      } catch (error) {
        console.error('自动连接失败:', error)
        return false
      }
    },

    // 清除错误
    clearError() {
      this.error = null
    },

    // 获取指定地址的余额
    async getBalance(address = null) {
      try {
        if (!this.provider) {
          throw new Error('Provider未初始化')
        }

        const targetAddress = address || this.account
        if (!targetAddress) {
          throw new Error('地址不能为空')
        }

        const balance = await this.provider.getBalance(targetAddress)
        return ethers.utils.formatEther(balance)
        
      } catch (error) {
        console.error('获取余额失败:', error)
        throw error
      }
    },

    // 发送交易
    async sendTransaction(to, value, data = '0x') {
      try {
        if (!this.signer) {
          throw new Error('Signer未初始化')
        }

        const tx = {
          to,
          value: ethers.utils.parseEther(value.toString()),
          data
        }

        const transaction = await this.signer.sendTransaction(tx)
        console.log('交易已发送:', transaction.hash)
        
        return transaction
      } catch (error) {
        console.error('发送交易失败:', error)
        throw error
      }
    }
  }
}) 