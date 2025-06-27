// 智能合约服务类
import { ethers } from 'ethers'
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from './contracts.js'

const { utils } = ethers

export class ContractService {
  constructor(provider, signer) {
    this.provider = provider
    this.signer = signer
    this.contracts = {}
    this.initializeContracts()
  }

  // 初始化所有合约实例
  initializeContracts() {
    if (!this.signer) {
      throw new Error('Signer not provided')
    }

    this.contracts = {
      taskFactory: new ethers.Contract(CONTRACT_ADDRESSES.TASK_FACTORY, CONTRACT_ABIS.TaskFactory, this.signer),
      biddingSystem: new ethers.Contract(CONTRACT_ADDRESSES.BIDDING_SYSTEM, CONTRACT_ABIS.BiddingSystem, this.signer),
      escrow: new ethers.Contract(CONTRACT_ADDRESSES.ESCROW, CONTRACT_ABIS.Escrow, this.signer),
      disputeDAO: new ethers.Contract(CONTRACT_ADDRESSES.DISPUTE_DAO, CONTRACT_ABIS.DisputeDAO, this.signer)
    }
  }

  // 获取合约实例
  getContract(name) {
    if (!this.contracts[name]) {
      throw new Error(`Contract ${name} not found`)
    }
    return this.contracts[name]
  }

  // =============== TaskFactory 合约方法 ===============

  // 创建任务
  async createTask(title, ipfsHash, reward, deadline, taskTypeNumber) {
    const contract = this.getContract('taskFactory')
    const rewardWei = utils.parseEther(reward.toString())
    
    // 获取平台费用信息
    const [totalAmountWei, rewardAmountWei, platformFeeWei] = await contract.calculateTotalAmount(rewardWei)
    
    console.log('任务创建费用明细:')
    console.log('- 奖励金额:', utils.formatEther(rewardAmountWei), 'AVAX')
    console.log('- 平台费用:', utils.formatEther(platformFeeWei), 'AVAX')
    console.log('- 总金额:', utils.formatEther(totalAmountWei), 'AVAX')

    const tx = await contract.createTask(
      title,
      ipfsHash,
      rewardWei,
      Math.floor(new Date(deadline).getTime() / 1000),
      taskTypeNumber,
      { value: totalAmountWei } // 发送总金额（奖励+平台费用）
    )

    return tx.wait()
  }

  // 获取所有任务
  async getAllTasks() {
    const contract = this.getContract('taskFactory')
    return await contract.getAllTasks()
  }

  // 根据ID获取任务
  async getTaskById(taskId) {
    const contract = this.getContract('taskFactory')
    return await contract.getTaskById(taskId)
  }

  // 根据所有者获取任务
  async getTaskByOwner(owner) {
    const contract = this.getContract('taskFactory')
    return await contract.getTaskByOwner(owner)
  }

  // 参与任务
  async participateInTask(taskId, url) {
    const contract = this.getContract('taskFactory')
    return await contract.participateInTask(taskId, url)
  }

  // 请求任务验证
  async requestTaskVerification(taskId, completeUrl) {
    const contract = this.getContract('taskFactory')
    const tx = await contract.requestTaskVerification(taskId, completeUrl)
    return tx.wait()
  }

  // 选择获胜者
  async selectWinner(taskId, winnerAddress) {
    const contract = this.getContract('taskFactory')
    const tx = await contract.selectWinner(taskId, winnerAddress)
    return tx.wait()
  }

  // 雇主确认任务
  async employerConfirmTask(taskId, isConfirm) {
    const contract = this.getContract('taskFactory')
    const tx = await contract.employerConfirmTask(taskId, isConfirm)
    return tx.wait()
  }

  // 取消任务
  async cancelTask(taskId) {
    const contract = this.getContract('taskFactory')
    const tx = await contract.cancelTask(taskId)
    return tx.wait()
  }

  // 争议任务
  async disputeTask(taskId) {
    const contract = this.getContract('taskFactory')
    const tx = await contract.disputeTask(taskId)
    return tx.wait()
  }

  // 开始竞价
  async startBidding(taskId) {
    const contract = this.getContract('taskFactory')
    const tx = await contract.startBidding(taskId)
    return tx.wait()
  }

  // =============== BiddingSystem 合约方法 ===============

  // 开放竞价
  async openBidding(taskId) {
    const contract = this.getContract('biddingSystem')
    const tx = await contract.openBidding(taskId)
    return tx.wait()
  }

  // 投标
  async placeBid(taskId, bidAmount) {
    const contract = this.getContract('biddingSystem')
    const bidAmountWei = utils.parseEther(bidAmount.toString())
    const tx = await contract.placeBid(taskId, { value: bidAmountWei })
    return tx.wait()
  }

  // 资格认证投标者
  async qualifyBidder(taskId, bidIndex) {
    const contract = this.getContract('biddingSystem')
    const tx = await contract.qualifyBidder(taskId, bidIndex)
    return tx.wait()
  }

  // 选择获胜者（竞价系统）
  async selectWinnerBidding(taskId, bidIndex) {
    const contract = this.getContract('biddingSystem')
    const tx = await contract.selectWinner(taskId, bidIndex)
    return tx.wait()
  }

  // 获取任务投标信息
  async getTaskBids(taskId, bidIndex) {
    const contract = this.getContract('biddingSystem')
    return await contract.taskBids(taskId, bidIndex)
  }

  // 获取获胜者
  async getWinner(taskId) {
    const contract = this.getContract('biddingSystem')
    return await contract.winners(taskId)
  }

  // =============== Escrow 合约方法 ===============

  // 为任务存入资金
  async depositFunds(taskId, amount) {
    const contract = this.getContract('escrow')
    const amountWei = utils.parseEther(amount.toString())
    const tx = await contract.depositFunds(taskId, { value: amountWei })
    return tx.wait()
  }

  // 释放资金
  async releaseFunds(taskId, winner) {
    const contract = this.getContract('escrow')
    const tx = await contract.releaseFunds(taskId, winner)
    return tx.wait()
  }

  // 退还资金
  async refundFunds(taskId, creator) {
    const contract = this.getContract('escrow')
    const tx = await contract.refundFunds(taskId, creator)
    return tx.wait()
  }

  // 添加到资金池
  async addToPool(taskId, amount) {
    const contract = this.getContract('escrow')
    const tx = await contract.addToPool(taskId, amount)
    return tx.wait()
  }

  // 奖励陪审团
  async rewardJuror(taskId, juror, amount) {
    const contract = this.getContract('escrow')
    const tx = await contract.rewardJuror(taskId, juror, amount)
    return tx.wait()
  }

  // 扣除保证金
  async slashDeposit(taskId, bidder) {
    const contract = this.getContract('escrow')
    const tx = await contract.slashDeposit(taskId, bidder)
    return tx.wait()
  }

  // 获取任务资金
  async getTaskFunds(taskId) {
    const contract = this.getContract('escrow')
    return await contract.taskFunds(taskId)
  }

  // 获取平台资金池
  async getPlatformPool() {
    const contract = this.getContract('escrow')
    return await contract.platformPool()
  }

  // =============== DisputeDAO 合约方法 ===============

  // 质押成为陪审团
  async stake(stakeAmount) {
    const contract = this.getContract('disputeDAO')
    const stakeAmountWei = utils.parseEther(stakeAmount.toString())
    const tx = await contract.stake({ value: stakeAmountWei })
    return tx.wait()
  }

  // 取消质押
  async unstake() {
    const contract = this.getContract('disputeDAO')
    const tx = await contract.unstake()
    return tx.wait()
  }

  // 处理争议
  async handleDispute(disputeId) {
    const contract = this.getContract('disputeDAO')
    const tx = await contract.handleDispute(disputeId)
    return tx.wait()
  }

  // 投票
  async vote(disputeId, winner) {
    const contract = this.getContract('disputeDAO')
    const tx = await contract.vote(disputeId, winner)
    return tx.wait()
  }

  // 仲裁恶意任务
  async arbitrateMaliciousTask(disputeId) {
    const contract = this.getContract('disputeDAO')
    const tx = await contract.arbitrateMaliciousTask(disputeId)
    return tx.wait()
  }

  // 获取活跃陪审团
  async getActiveJurors() {
    const contract = this.getContract('disputeDAO')
    return await contract.getActiveJurors()
  }

  // 获取争议陪审团
  async getDisputeJurors(disputeId) {
    const contract = this.getContract('disputeDAO')
    return await contract.getDisputeJurors(disputeId)
  }

  // 获取陪审团信息
  async getJurorInfo(jurorAddr) {
    const contract = this.getContract('disputeDAO')
    return await contract.getJurorInfo(jurorAddr)
  }

  // 获取投票数量
  async getVoteCount(disputeId) {
    const contract = this.getContract('disputeDAO')
    return await contract.voteCount(disputeId)
  }

  // 获取候选人投票数
  async getCandidateVotes(disputeId, candidate) {
    const contract = this.getContract('disputeDAO')
    return await contract.candidateVotes(disputeId, candidate)
  }

  // 检查是否已投票
  async hasVoted(disputeId, juror) {
    const contract = this.getContract('disputeDAO')
    return await contract.hasVoted(disputeId, juror)
  }

  // =============== 平台费用相关方法 ===============

  // 获取平台费用信息
  async getPlatformFeeInfo() {
    const contract = this.getContract('taskFactory')
    const [platformAddr, feeRate, totalFees] = await contract.getPlatformFeeInfo()
    return {
      platformAddress: platformAddr,
      feeRate: feeRate.toNumber(),
      feeRatePercent: (feeRate.toNumber() / 100).toFixed(2),
      totalFees: utils.formatEther(totalFees)
    }
  }

  // 计算平台费用
  async calculatePlatformFee(rewardAmount) {
    const contract = this.getContract('taskFactory')
    const rewardWei = utils.parseEther(rewardAmount.toString())
    const platformFeeWei = await contract.calculatePlatformFee(rewardWei)
    return utils.formatEther(platformFeeWei)
  }

  // 计算总金额
  async calculateTotalAmount(rewardAmount) {
    const contract = this.getContract('taskFactory')
    const rewardWei = utils.parseEther(rewardAmount.toString())
    const [totalAmountWei, rewardAmountWei, platformFeeWei] = await contract.calculateTotalAmount(rewardWei)
    
    return {
      totalAmount: utils.formatEther(totalAmountWei),
      rewardAmount: utils.formatEther(rewardAmountWei),
      platformFee: utils.formatEther(platformFeeWei),
      totalAmountWei,
      rewardAmountWei,
      platformFeeWei
    }
  }

  // =============== 工具方法 ===============

  // 格式化以太坊金额
  formatEther(amountWei) {
    return utils.formatEther(amountWei)
  }

  // 解析以太坊金额
  parseEther(amount) {
    return utils.parseEther(amount.toString())
  }

  // 检查交易状态
  async checkTransactionStatus(txHash) {
    const receipt = await this.provider.getTransactionReceipt(txHash)
    return receipt ? receipt.status === 1 : false
  }

  // 获取交易详情
  async getTransactionDetails(txHash) {
    const [tx, receipt] = await Promise.all([
      this.provider.getTransaction(txHash),
      this.provider.getTransactionReceipt(txHash)
    ])
    return { tx, receipt }
  }

  // 估算Gas费用
  async estimateGas(contract, method, ...args) {
    return await contract.estimateGas[method](...args)
  }
}

// 导出合约服务类
export default ContractService 