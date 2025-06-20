// stores/wallet.js
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useWalletStore = defineStore('wallet', {
    state: () => ({
        isConnected: false,
        account: null,
        connecting: false,
        error: null,
    }),
    getters: {
        shortAccount: (state) => {
            if (!state.account) return ''
            return `${state.account.slice(0, 6)}...${state.account.slice(-4)}`
        }
    },
    actions: {
        async connectWallet() {
            if (this.connecting) return

            this.connecting = true
            this.error = null

            try {
                // 获取以太坊提供商
                const provider = this.getEthereumProvider()

                if (!provider) {
                    throw new Error('未检测到以太坊钱包')
                }

                // 请求账户访问
                const accounts = await provider.request({
                    method: 'eth_requestAccounts'
                })

                if (accounts.length === 0) {
                    throw new Error('未获得账户访问权限')
                }

                // 更新状态
                this.account = accounts[0]
                this.isConnected = true

                // 保存连接状态
                localStorage.setItem('walletConnected', 'true')

                // 设置事件监听器
                this.setupEventListeners(provider)
            } catch (err) {
                console.error('钱包连接失败:', err)
                this.error = err.message || '钱包连接失败，请重试'
            } finally {
                this.connecting = false
            }
        },

        disconnectWallet() {
            this.account = null
            this.isConnected = false
            localStorage.removeItem('walletConnected')
        },

        getEthereumProvider() {
            // 支持 MetaMask
            if (typeof window.ethereum !== 'undefined') {
                return window.ethereum
            }
            // 支持 Coinbase Wallet
            if (typeof window.coinbaseWalletExtension !== 'undefined') {
                return window.coinbaseWalletExtension
            }
            return null
        },

        setupEventListeners(provider) {
            // 处理账户变化
            const handleAccountsChanged = (accounts) => {
                if (accounts.length === 0) {
                    this.disconnectWallet()
                } else if (accounts[0] !== this.account) {
                    this.account = accounts[0]
                }
            }

            // 处理链变化
            const handleChainChanged = () => {
                window.location.reload()
            }

            provider.on('accountsChanged', handleAccountsChanged)
            provider.on('chainChanged', handleChainChanged)
        },

        async initWallet() {
            const provider = this.getEthereumProvider()

            if (provider && localStorage.getItem('walletConnected') === 'true') {
                try {
                    const accounts = await provider.request({ method: 'eth_accounts' })
                    if (accounts.length > 0) {
                        this.account = accounts[0]
                        this.isConnected = true
                        this.setupEventListeners(provider)
                    }
                } catch (err) {
                    console.error('自动连接失败:', err)
                    this.disconnectWallet()
                }
            }
        },

        async signMessage(message) {
            if (!this.account) {
                throw new Error('钱包未连接');
            }
            try {
                const provider = this.getEthereumProvider();
                const signature = await provider.request({
                    method: 'personal_sign',
                    params: [message, this.account]
                });
                return signature;
            } catch (error) {
                console.error('签名失败:', error);
                throw new Error('用户拒绝签名');
            }
        }
    }
})

// 新增：组合式函数 useWallet
export function useWallet() {
    const walletStore = useWalletStore()

    // 确保在组合函数中初始化钱包
    if (!walletStore.isConnected) {
        walletStore.initWallet()
    }

    return {
        walletAddress: computed(() => walletStore.account),
        isConnected: computed(() => walletStore.isConnected),
        shortAccount: computed(() => walletStore.shortAccount),
        connectWallet: walletStore.connectWallet,
        disconnectWallet: walletStore.disconnectWallet
    }
}

// 本文件未使用eval/new Function/setTimeout([string])/setInterval([string])