// 合约配置测试脚本 - Node.js版本
console.log('🚀 智能合约配置测试开始...')

// 模拟浏览器环境的一些必要对象
global.window = global.window || {}
global.document = global.document || {}

// 导入配置文件的内容进行直接测试
async function testConfiguration() {
  try {
    console.log('📋 开始配置测试...')
    
    // 测试ABI文件导入
    const fs = await import('fs')
    const path = await import('path')
    
    const contractsDir = '../contracts/contracts/ContractsABI'
    const abiFiles = [
      'TaskFactoryABI.json',
      'BiddingSystemABI.json', 
      'EscrowABI.json',
      'DisputeDAO_ABI.json'
    ]
    
    const abiTests = {}
    let allValid = true
    
    console.log('\n📊 ABI文件测试:')
    
    for (const fileName of abiFiles) {
      try {
        const filePath = path.resolve(process.cwd(), contractsDir, fileName)
        const abiContent = fs.readFileSync(filePath, 'utf8')
        const abi = JSON.parse(abiContent)
        
        abiTests[fileName] = {
          exists: true,
          isArray: Array.isArray(abi),
          length: abi ? abi.length : 0,
          hasConstructor: false,
          hasFunctions: 0,
          hasEvents: 0,
          hasViews: 0,
          valid: false
        }

        if (Array.isArray(abi)) {
          // 分析ABI内容
          for (const item of abi) {
            if (item.type === 'constructor') {
              abiTests[fileName].hasConstructor = true
            } else if (item.type === 'function') {
              abiTests[fileName].hasFunctions++
              if (item.stateMutability === 'view' || item.stateMutability === 'pure') {
                abiTests[fileName].hasViews++
              }
            } else if (item.type === 'event') {
              abiTests[fileName].hasEvents++
            }
          }

          // 检查ABI是否有效
          abiTests[fileName].valid = 
            abiTests[fileName].length > 0 &&
            abiTests[fileName].hasFunctions > 0

          if (abiTests[fileName].valid) {
            console.log(`✅ ${fileName}: 有效 (${abiTests[fileName].length}项, ${abiTests[fileName].hasFunctions}个函数, ${abiTests[fileName].hasEvents}个事件)`)
          } else {
            console.log(`❌ ${fileName}: 无效`)
            allValid = false
          }
        } else {
          console.log(`❌ ${fileName}: 不是有效的ABI数组`)
          allValid = false
        }
        
      } catch (error) {
        console.log(`❌ ${fileName}: 读取失败 - ${error.message}`)
        allValid = false
      }
    }
    
    // 测试合约地址
    console.log('\n🏠 合约地址测试:')
    const contractAddresses = {
      TASK_FACTORY: '0xFD333504a7850457f625516FD028E1747fEa5C6F',
      BIDDING_SYSTEM: '0xb5AE1693d73de6cA78c6E5e767BDfE510B703Dd5',
      ESCROW: '0xf3007729f70233d29f8c5Cb38975a6c329945211',
      DISPUTE_DAO: '0x719Be548a3499A9eB719C84F8720123f819bA43F'
    }
    
    for (const [contractName, address] of Object.entries(contractAddresses)) {
      const isValidFormat = /^0x[a-fA-F0-9]{40}$/.test(address)
      const isNotZero = address !== '0x0000000000000000000000000000000000000000'
      const valid = isValidFormat && isNotZero
      
      if (valid) {
        console.log(`✅ ${contractName}: ${address}`)
      } else {
        console.log(`❌ ${contractName}: 无效地址 - ${address}`)
        allValid = false
      }
    }
    
    console.log('\n📋 测试报告摘要:')
    console.log(`- 整体配置状态: ${allValid ? '✅ 有效' : '❌ 无效'}`)
    console.log(`- ABI文件数量: ${abiFiles.length}`)
    console.log(`- 合约地址数量: ${Object.keys(contractAddresses).length}`)
    
    return allValid
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
    return false
  }
}

// 使用示例
function showUsageExamples() {
  console.log('\n📖 使用示例:')
  
  console.log(`
1. 在Vue组件中使用Web3 Store:
   import { useWeb3Store } from '@/stores/web3'
   
   const web3Store = useWeb3Store()
   await web3Store.connectWallet()
   
2. 创建任务:
   await web3Store.createTask(
     '网站设计任务',
     'QmX...', // IPFS哈希
     '10',    // 奖励 (AVAX)
     new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后截止
     1        // 任务类型
   )
   
3. 使用合约服务类:
   import ContractService from '@/utils/contractService'
   
   const contractService = new ContractService(provider, signer)
   const tasks = await contractService.getAllTasks()
   
4. 参与任务:
   await contractService.participateInTask(taskId, 'https://demo.example.com')
   
5. 投标:
   await contractService.placeBid(taskId, '8') // 投标8 AVAX
  `)
}

// 网络配置信息
function showNetworkInfo() {
  console.log('\n🌐 网络配置信息:')
  console.log('- 网络: Avalanche Fuji测试网')
  console.log('- 链ID: 43113 (0xA869)')
  console.log('- RPC URL: https://api.avax-test.network/ext/bc/C/rpc')
  console.log('- 区块链浏览器: https://testnet.snowtrace.io/')
  console.log('- 原生代币: AVAX')
}

// 运行测试
testConfiguration().then(success => {
  if (success) {
    console.log('\n🎉 配置验证成功！您的项目已准备就绪！')
    showNetworkInfo()
    showUsageExamples()
    
    console.log('\n🚀 下一步操作:')
    console.log('1. 启动开发服务器: npm run dev')
    console.log('2. 在浏览器中打开应用')
    console.log('3. 连接MetaMask钱包')
    console.log('4. 切换到Avalanche Fuji测试网')
    console.log('5. 开始使用合约功能')
    
  } else {
    console.log('\n⚠️  配置存在问题，请检查上述错误信息')
  }
}).catch(error => {
  console.error('\n💥 测试过程中发生错误:', error.message)
})

// 合约配置测试脚本
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, validateContractConfig } from './utils/contracts.js'

console.log('🔍 开始验证合约配置...')

// 1. 验证合约地址和ABI配置
const validation = validateContractConfig()
console.log('\n📋 合约配置验证结果:')
console.log('✅ 配置有效:', validation.valid)

if (!validation.valid) {
  console.log('❌ 配置错误:')
  validation.errors.forEach(error => console.log(`  - ${error}`))
} else {
  console.log('✅ 所有合约配置正确')
}

// 2. 显示当前合约地址
console.log('\n📍 当前合约地址:')
console.log('TaskFactory:', CONTRACT_ADDRESSES.TASK_FACTORY)
console.log('BiddingSystem:', CONTRACT_ADDRESSES.BIDDING_SYSTEM)
console.log('Escrow:', CONTRACT_ADDRESSES.ESCROW)
console.log('DisputeDAO:', CONTRACT_ADDRESSES.DISPUTE_DAO)

// 3. 验证ABI文件
console.log('\n📜 ABI文件验证:')
const contracts = ['TaskFactory', 'BiddingSystem', 'Escrow', 'DisputeDAO']
contracts.forEach(contractName => {
  const abi = CONTRACT_ABIS[contractName]
  if (abi && Array.isArray(abi) && abi.length > 0) {
    console.log(`✅ ${contractName}: ${abi.length} 个函数/事件`)
    
    // 检查平台费用相关函数（仅对TaskFactory）
    if (contractName === 'TaskFactory') {
      const platformFeeFunctions = [
        'calculatePlatformFee',
        'calculateTotalAmount',
        'getPlatformFeeInfo',
        'setPlatformFeeRate',
        'setPlatformAddress'
      ]
      
      console.log('   平台费用相关函数:')
      platformFeeFunctions.forEach(funcName => {
        const hasFunction = abi.some(item => item.name === funcName && item.type === 'function')
        console.log(`   ${hasFunction ? '✅' : '❌'} ${funcName}`)
      })
      
      // 检查平台费用相关事件
      const platformFeeEvents = [
        'PlatformFeeCollected',
        'PlatformFeeRateUpdated',
        'PlatformAddressUpdated'
      ]
      
      console.log('   平台费用相关事件:')
      platformFeeEvents.forEach(eventName => {
        const hasEvent = abi.some(item => item.name === eventName && item.type === 'event')
        console.log(`   ${hasEvent ? '✅' : '❌'} ${eventName}`)
      })
    }
  } else {
    console.log(`❌ ${contractName}: ABI文件无效或为空`)
  }
})

console.log('\n🎯 配置测试完成!')

// 4. 提供使用说明
console.log('\n📝 使用说明:')
console.log('1. 如果配置验证失败，请检查合约地址和ABI文件')
console.log('2. 确保所有合约都已正确部署到Avalanche Fuji测试网')
console.log('3. 平台费用功能已添加到TaskFactory合约')
console.log('4. 默认平台费率为0.5% (50基点)')
console.log('5. 用户创建任务时需要支付: 奖励金额 + 平台费用')

export { validation } 