// 智能合约配置文件
import TaskFactoryABI from '../../../contracts/contracts/ContractsABI/TaskFactoryABI.json'
import BiddingSystemABI from '../../../contracts/contracts/ContractsABI/BiddingSystemABI.json'
import EscrowABI from '../../../contracts/contracts/ContractsABI/EscrowABI.json'
import DisputeDAO_ABI from '../../../contracts/contracts/ContractsABI/DisputeDAO_ABI.json'

// 智能合约地址配置 - 部署后需要更新这些地址
export const CONTRACT_ADDRESSES = {
  TASK_FACTORY: '0xEeE38935cfc450Fe1e5dfF85205212fe7AB711eE',
  BIDDING_SYSTEM: '0x015dbce5389dd0CD60e0d6F459e89761Fb2465B5',
  ESCROW: '0x737C76EE516b2597511Bf2364681859fD321a2cb',
  DISPUTE_DAO: '0xbCe0D7E1807b096671d1ed2551EB8f3Ac762714b'
}

// 智能合约ABI配置
export const CONTRACT_ABIS = {
  TaskFactory: TaskFactoryABI,
  BiddingSystem: BiddingSystemABI,
  Escrow: EscrowABI,
  DisputeDAO: DisputeDAO_ABI
}

// Avalanche Fuji测试网配置
export const AVALANCHE_FUJI = {
  chainId: '0xA869', // 43113
  chainName: 'Avalanche Fuji Testnet',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowtrace.io/']
}

// 合约配置验证
export const validateContractConfig = () => {
  const errors = []
  
  // 检查地址配置
  for (const [key, address] of Object.entries(CONTRACT_ADDRESSES)) {
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      errors.push(`${key} 地址未配置或无效`)
    }
  }
  
  // 检查ABI配置
  for (const [key, abi] of Object.entries(CONTRACT_ABIS)) {
    if (!abi || !Array.isArray(abi) || abi.length === 0) {
      errors.push(`${key} ABI未配置或无效`)
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// 导出配置信息
export const getContractInfo = () => {
  const validation = validateContractConfig()
  
  return {
    addresses: CONTRACT_ADDRESSES,
    abis: CONTRACT_ABIS,
    network: AVALANCHE_FUJI,
    validation
  }
} 