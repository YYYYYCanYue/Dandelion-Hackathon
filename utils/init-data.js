import { useIpfsStore } from '@/stores/ipfs'

// 示例数据
const sampleTasks = [
  {
    id: 1,
    title: '开发DeFi借贷协议前端界面',
    description: '需要开发一个现代化的DeFi借贷协议前端界面，包括存款、借款、清算等功能模块。要求使用React和Web3.js技术栈。\n\n具体要求：\n1. 响应式设计，支持移动端\n2. 集成MetaMask钱包连接\n3. 实现存款、借款、还款功能\n4. 显示用户资产和借贷记录\n5. 提供清算功能界面',
    taskType: 0, // 开发
    reward: '15.5',
    status: 0, // 开放中
    participants: 8,
    deadline: '2024-02-15',
    requirements: '熟练掌握React、Web3.js、Solidity基础知识',
    creator: '0x1234567890123456789012345678901234567890',
    createdAt: '2024-01-10T08:00:00.000Z',
    attachments: [
      {
        name: '需求文档.pdf',
        hash: 'QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx',
        size: 1024000,
        type: 'application/pdf'
      }
    ]
  },
  {
    id: 2,
    title: 'NFT市场平台UI设计',
    description: '为NFT交易平台设计现代化的用户界面，包括市场首页、NFT详情页、个人收藏页等。需要提供完整的设计稿和原型。',
    taskType: 1, // 设计
    reward: '8.0',
    status: 3, // 已完成
    participants: 12,
    deadline: '2024-01-20',
    requirements: '具备UI/UX设计经验，熟悉区块链产品设计',
    creator: '0x2345678901234567890123456789012345678901',
    createdAt: '2024-01-05T10:30:00.000Z',
    attachments: []
  },
  {
    id: 3,
    title: '区块链数据分析仪表板',
    description: '开发一个区块链数据分析仪表板，展示各种DeFi协议的TVL、交易量等关键指标。需要实时数据更新和可视化图表。',
    taskType: 2, // 分析
    reward: '12.0',
    status: 1, // 进行中
    participants: 5,
    deadline: '2024-02-20',
    requirements: '数据分析经验，熟悉图表库和API调用',
    creator: '0x3456789012345678901234567890123456789012',
    createdAt: '2024-01-12T14:15:00.000Z',
    attachments: []
  },
  {
    id: 4,
    title: '智能合约安全审计报告',
    description: '对DeFi协议的智能合约进行安全审计，提供详细的安全评估报告，包括漏洞分析和修复建议。',
    taskType: 3, // 写作
    reward: '20.0',
    status: 0, // 开放中
    participants: 3,
    deadline: '2024-02-25',
    requirements: '智能合约安全审计经验，熟悉常见漏洞类型',
    creator: '0x4567890123456789012345678901234567890123',
    createdAt: '2024-01-15T09:45:00.000Z',
    attachments: []
  },
  {
    id: 5,
    title: 'Web3游戏前端开发',
    description: '开发一个基于区块链的简单游戏前端，包括用户登录、游戏界面、NFT展示等功能。',
    taskType: 0, // 开发
    reward: '10.0',
    status: 2, // 待确认
    participants: 6,
    deadline: '2024-02-10',
    requirements: '游戏开发经验，了解NFT和区块链游戏机制',
    creator: '0x5678901234567890123456789012345678901234',
    createdAt: '2024-01-08T16:20:00.000Z',
    attachments: []
  }
]

const sampleBids = {
  1: [
    {
      id: 1,
      bidder: '0xabc1234567890123456789012345678901234567890',
      proposal: '我有5年的React和Web3开发经验，曾经开发过多个DeFi项目的前端界面。我的方案是使用React + TypeScript + Ethers.js技术栈，确保代码质量和用户体验。预计开发周期为2周。',
      demoUrl: 'https://demo.example.com',
      timestamp: '2024-01-11T10:00:00.000Z',
      isWinner: false
    },
    {
      id: 2,
      bidder: '0xdef2345678901234567890123456789012345678901',
      proposal: '专业的前端开发团队，专注于DeFi应用开发。我们将提供完整的UI/UX设计和开发服务，包括响应式设计、钱包集成、交易功能等。',
      demoUrl: '',
      timestamp: '2024-01-12T14:30:00.000Z',
      isWinner: false
    }
  ],
  3: [
    {
      id: 3,
      bidder: '0x9876543210987654321098765432109876543210',
      proposal: '我是专业的数据分析师，有丰富的区块链数据分析经验。将使用Python和React构建实时数据仪表板，提供清晰的数据可视化。',
      demoUrl: 'https://dashboard-demo.example.com',
      timestamp: '2024-01-13T11:15:00.000Z',
      isWinner: true
    }
  ]
}

const sampleDisputes = [
  {
    id: 1,
    taskId: 2,
    taskTitle: 'NFT市场平台UI设计',
    description: '雇主声称交付的设计稿不符合要求，要求退款。设计师认为已按要求完成设计。',
    initiator: '0x2345678901234567890123456789012345678901',
    respondent: '0xdesigner123456789012345678901234567890123',
    amount: '8.0',
    status: 'completed',
    createdAt: '2024-01-22T09:30:00.000Z',
    votes: [
      {
        voter: '0xjudge1234567890123456789012345678901234567',
        vote: 'oppose',
        timestamp: '2024-01-23T10:00:00.000Z'
      },
      {
        voter: '0xjudge2345678901234567890123456789012345678',
        vote: 'oppose',
        timestamp: '2024-01-23T11:30:00.000Z'
      },
      {
        voter: '0xjudge3456789012345678901234567890123456789',
        vote: 'support',
        timestamp: '2024-01-23T14:15:00.000Z'
      }
    ]
  },
  {
    id: 2,
    taskId: 5,
    taskTitle: 'Web3游戏前端开发',
    description: '开发者声称已完成所有功能，但雇主认为游戏体验不佳，存在多个bug。',
    initiator: '0x5678901234567890123456789012345678901234',
    respondent: '0xdev456789012345678901234567890123456789',
    amount: '10.0',
    status: 'ongoing',
    createdAt: '2024-01-25T15:45:00.000Z',
    votes: [
      {
        voter: '0xjudge1234567890123456789012345678901234567',
        vote: 'support',
        timestamp: '2024-01-26T09:00:00.000Z'
      }
    ]
  }
]

// 初始化数据到IPFS
export const initializeData = async () => {
  const ipfsStore = useIpfsStore()
  
  try {
    console.log('开始初始化数据到IPFS...')
    
    // 创建数据索引对象
    const dataIndex = {
      tasks: sampleTasks,
      bids: sampleBids,
      disputes: sampleDisputes,
      stats: {
        totalTasks: sampleTasks.length,
        activeTasks: sampleTasks.filter(task => task.status === 0).length,
        completedTasks: sampleTasks.filter(task => task.status === 3).length,
        totalRewards: sampleTasks.reduce((sum, task) => sum + parseFloat(task.reward), 0).toFixed(1)
      },
      lastUpdated: new Date().toISOString()
    }
    
    // 上传数据索引到IPFS
    const dataHash = await ipfsStore.uploadJSON(dataIndex)
    
    console.log('数据初始化完成！')
    console.log('数据索引IPFS哈希:', dataHash)
    console.log('请将此哈希保存到data store的dataIndexHash中')
    
    // 将哈希保存到localStorage作为备份
    localStorage.setItem('dandelion_data_hash', dataHash)
    
    return {
      success: true,
      hash: dataHash,
      data: dataIndex
    }
    
  } catch (error) {
    console.error('初始化数据失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 从IPFS加载数据
export const loadDataFromIPFS = async (hash) => {
  const ipfsStore = useIpfsStore()
  
  try {
    const data = await ipfsStore.getJSON(hash)
    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('从IPFS加载数据失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 获取默认数据哈希
export const getDefaultDataHash = () => {
  return localStorage.getItem('dandelion_data_hash')
} 