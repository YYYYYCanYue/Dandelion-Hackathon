<template>
  <div class="arbitration-page">
    <!-- 页面头部 -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">仲裁中心</h1>
            <p class="mt-2 text-gray-600">去中心化争议解决机制，社区治理保障公平</p>
          </div>
          <div class="mt-4 md:mt-0 flex space-x-3">
            <button
              v-if="!isArbitrator && web3Store.isConnected"
              @click="showBecomeArbitratorModal = true"
              class="btn-outline"
            >
              申请成为仲裁员
            </button>
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
              <span>我的仲裁余额: {{ formatBalance(arbitratorBalance) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 统计概览 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">进行中争议</dt>
                <dd class="text-lg font-medium text-gray-900">{{ disputeStats.ongoing }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">已解决争议</dt>
                <dd class="text-lg font-medium text-gray-900">{{ disputeStats.resolved }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">解决率</dt>
                <dd class="text-lg font-medium text-gray-900">{{ disputeStats.resolutionRate }}%</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">总争议数</dt>
                <dd class="text-lg font-medium text-gray-900">{{ disputeStats.total }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- 选项卡 -->
      <div class="mb-8">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.name"
              @click="activeTab = tab.name"
              :class="[
                activeTab === tab.name
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- 争议列表 -->
      <div class="space-y-6">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p class="mt-2 text-gray-600">加载争议数据中...</p>
        </div>

        <div v-else-if="currentDisputes.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">暂无争议</h3>
          <p class="mt-1 text-sm text-gray-500">当前没有需要处理的争议案例</p>
        </div>

        <div
          v-for="dispute in currentDisputes"
          :key="dispute.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-3">
                  <span :class="getStatusClass(dispute.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ getStatusText(dispute.status) }}
                  </span>
                  <span class="text-sm text-gray-500">
                    争议ID: #{{ dispute.id }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{ formatDate(dispute.createdAt) }}
                  </span>
                </div>
                
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  任务争议: {{ dispute.taskTitle }}
                </h3>
                
                <p class="text-gray-600 mb-4">{{ dispute.description }}</p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span class="text-sm text-gray-500">争议发起人</span>
                    <div class="text-sm font-medium text-gray-900">{{ formatAddress(dispute.initiator) }}</div>
                  </div>
                  <div>
                    <span class="text-sm text-gray-500">被申请人</span>
                    <div class="text-sm font-medium text-gray-900">{{ formatAddress(dispute.respondent) }}</div>
                  </div>
                  <div>
                    <span class="text-sm text-gray-500">争议金额</span>
                    <div class="text-sm font-medium text-gray-900">{{ dispute.amount }} AVAX</div>
                  </div>
                </div>

                <!-- 投票进度 -->
                <div v-if="dispute.status === 'ongoing'" class="mb-4">
                  <div class="flex justify-between text-sm text-gray-600 mb-2">
                    <span>投票结果</span>
                    <span>{{ getVoteResult(dispute).totalVotes }} 票</span>
                  </div>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-green-600">支持</span>
                      <span class="text-sm font-medium">{{ getVoteResult(dispute).supportVotes }} ({{ getVoteResult(dispute).supportPercentage }}%)</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-green-500 h-2 rounded-full"
                        :style="{ width: `${getVoteResult(dispute).supportPercentage}%` }"
                      ></div>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-red-600">反对</span>
                      <span class="text-sm font-medium">{{ getVoteResult(dispute).opposeVotes }} ({{ getVoteResult(dispute).opposePercentage }}%)</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-red-500 h-2 rounded-full"
                        :style="{ width: `${getVoteResult(dispute).opposePercentage}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="ml-6 flex-shrink-0">
                <div v-if="canVote(dispute)" class="space-y-2">
                  <button
                    @click="voteOnDispute(dispute.id, 'support')"
                    class="w-full btn-primary text-sm"
                  >
                    支持
                  </button>
                  <button
                    @click="voteOnDispute(dispute.id, 'oppose')"
                    class="w-full btn-outline text-sm"
                  >
                    反对
                  </button>
                </div>
                <div v-else-if="hasVoted(dispute)" class="text-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    已投票
                  </span>
                </div>
                <div v-else class="text-center text-sm text-gray-500">
                  无法投票
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 我的投票 -->
      <div v-if="activeTab === 'my-votes'" class="space-y-6">
        <div v-if="myVotes.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">暂无投票记录</h3>
          <p class="mt-1 text-sm text-gray-500">您还没有参与任何仲裁投票</p>
        </div>

        <div
          v-for="vote in myVotes"
          :key="vote.id"
          class="bg-white rounded-lg shadow-lg p-6"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <span :class="vote.decision ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ vote.decision ? '支持' : '反对' }}
                </span>
                <span class="text-sm text-gray-500">{{ formatDate(vote.timestamp) }}</span>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ vote.disputeTitle }}</h3>
              <p class="text-gray-600 text-sm mb-2">{{ vote.reason }}</p>
              <div class="text-sm text-gray-500">
                奖励: {{ formatBalance(vote.reward) }} AVAX
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 仲裁员管理 -->
      <div v-if="activeTab === 'arbitrators'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">活跃仲裁员</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    仲裁员
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    质押金额
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    参与投票
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    准确率
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    声誉分数
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="arbitrator in arbitrators" :key="arbitrator.address">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span class="text-sm font-medium text-primary-600">
                          {{ arbitrator.address.slice(2, 4).toUpperCase() }}
                        </span>
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">
                          {{ formatAddress(arbitrator.address) }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatBalance(arbitrator.stake) }} AVAX
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ arbitrator.votesCount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ arbitrator.accuracy }}%
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="text-sm font-medium text-gray-900">{{ arbitrator.reputation }}</div>
                      <div class="ml-2 flex">
                        <svg v-for="i in 5" :key="i" :class="i <= Math.floor(arbitrator.reputation / 20) ? 'text-yellow-400' : 'text-gray-300'" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 投票模态框 -->
    <div
      v-if="showVoteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showVoteModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">仲裁投票</h3>
          <div v-if="selectedDispute" class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">争议概要</h4>
              <p class="text-sm text-gray-600">{{ selectedDispute.description }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                您的决定
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="voteForm.decision"
                    :value="true"
                    type="radio"
                    class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                  >
                  <span class="ml-2 text-sm text-gray-700">支持申请人</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="voteForm.decision"
                    :value="false"
                    type="radio"
                    class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                  >
                  <span class="ml-2 text-sm text-gray-700">支持被申请人</span>
                </label>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                投票理由
              </label>
              <textarea
                v-model="voteForm.reason"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请说明您的投票理由..."
                required
              ></textarea>
            </div>
            
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-yellow-800">
                    投票须知
                  </h3>
                  <div class="mt-2 text-sm text-yellow-700">
                    <p>• 投票后不可更改</p>
                    <p>• 投票奖励将在争议解决后发放</p>
                    <p>• 恶意投票可能导致质押金被扣除</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showVoteModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              @click="submitVote"
              :disabled="voteSubmitting || voteForm.decision === null"
              class="btn-primary flex items-center space-x-2"
            >
              <div v-if="voteSubmitting" class="loading-spinner"></div>
              <span>{{ voteSubmitting ? '提交中...' : '提交投票' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 申请成为仲裁员模态框 -->
    <div
      v-if="showBecomeArbitratorModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showBecomeArbitratorModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">申请成为仲裁员</h3>
          <form @submit.prevent="becomeArbitrator">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  质押金额 (AVAX)
                </label>
                <input
                  v-model="arbitratorForm.stake"
                  type="number"
                  step="0.1"
                  min="10"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="最低质押 10 AVAX"
                  required
                >
                <p class="mt-2 text-sm text-gray-500">
                  质押金额越高，获得仲裁机会越多
                </p>
              </div>
              
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex">
                  <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                  </svg>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-blue-800">
                      仲裁员职责
                    </h3>
                    <div class="mt-2 text-sm text-blue-700">
                      <ul class="list-disc list-inside space-y-1">
                        <li>公正客观地处理争议案例</li>
                        <li>及时参与投票，不得无故缺席</li>
                        <li>提供详细的投票理由</li>
                        <li>维护平台的公信力和声誉</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="showBecomeArbitratorModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="arbitratorSubmitting"
                class="btn-primary flex items-center space-x-2"
              >
                <div v-if="arbitratorSubmitting" class="loading-spinner"></div>
                <span>{{ arbitratorSubmitting ? '申请中...' : '提交申请' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWeb3Store } from '@/stores/web3'
import { useDataStore } from '@/stores/data'

const web3Store = useWeb3Store()
const dataStore = useDataStore()

// 响应式数据
const activeTab = ref('ongoing')
const showVoteModal = ref(false)
const showBecomeArbitratorModal = ref(false)
const selectedDispute = ref(null)
const voteSubmitting = ref(false)
const arbitratorSubmitting = ref(false)
const isArbitrator = ref(false)
const arbitratorBalance = ref('0.0')
const loading = ref(false)

// 选项卡配置
const tabs = [
  { name: 'ongoing', label: '进行中' },
  { name: 'completed', label: '已完成' },
  { name: 'my-disputes', label: '我的争议' }
]

// 计算属性
const ongoingDisputes = computed(() => {
  return dataStore.disputes.filter(dispute => dispute.status === 'ongoing')
})

const completedDisputes = computed(() => {
  return dataStore.disputes.filter(dispute => dispute.status === 'completed')
})

const myDisputes = computed(() => {
  if (!web3Store.account) return []
  return dataStore.disputes.filter(dispute => 
    dispute.initiator.toLowerCase() === web3Store.account.toLowerCase() ||
    dispute.respondent.toLowerCase() === web3Store.account.toLowerCase()
  )
})

const currentDisputes = computed(() => {
  switch (activeTab.value) {
    case 'ongoing':
      return ongoingDisputes.value
    case 'completed':
      return completedDisputes.value
    case 'my-disputes':
      return myDisputes.value
    default:
      return []
  }
})

// 争议统计
const disputeStats = computed(() => {
  const total = dataStore.disputes.length
  const ongoing = ongoingDisputes.value.length
  const completed = completedDisputes.value.length
  const resolved = completed
  
  return {
    total,
    ongoing,
    resolved,
    resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
  }
})

// 表单数据
const voteForm = ref({
  decision: null,
  reason: ''
})

const arbitratorForm = ref({
  stake: ''
})

// 争议列表
const disputes = ref([])
const myVotes = ref([])
const arbitrators = ref([])

// 方法
const loadDisputes = async () => {
  loading.value = true
  try {
    // 数据已经在dataStore中，无需额外加载
    // 如果需要刷新数据，可以调用 dataStore.initializeData()
    await dataStore.initializeData()
  } catch (error) {
    console.error('加载争议数据失败:', error)
  } finally {
    loading.value = false
  }
}

const voteOnDispute = async (disputeId, vote) => {
  if (!web3Store.isConnected) {
    alert('请先连接钱包')
    return
  }

  try {
    // 添加投票到争议
    await dataStore.addVoteToDispute(disputeId, {
      voter: web3Store.account,
      vote: vote, // 'support' 或 'oppose'
      timestamp: new Date().toISOString()
    })

    alert('投票成功！')
    
    // 刷新数据
    await loadDisputes()
    
  } catch (error) {
    console.error('投票失败:', error)
    alert('投票失败，请重试')
  }
}

const hasVoted = (dispute) => {
  if (!web3Store.account) return false
  return dispute.votes.some(vote => 
    vote.voter.toLowerCase() === web3Store.account.toLowerCase()
  )
}

const canVote = (dispute) => {
  return web3Store.isConnected && 
         dispute.status === 'ongoing' &&
         !hasVoted(dispute) &&
         dispute.initiator.toLowerCase() !== web3Store.account?.toLowerCase() &&
         dispute.respondent.toLowerCase() !== web3Store.account?.toLowerCase()
}

const getVoteResult = (dispute) => {
  const supportVotes = dispute.votes.filter(vote => vote.vote === 'support').length
  const opposeVotes = dispute.votes.filter(vote => vote.vote === 'oppose').length
  const totalVotes = supportVotes + opposeVotes
  
  return {
    supportVotes,
    opposeVotes,
    totalVotes,
    supportPercentage: totalVotes > 0 ? Math.round((supportVotes / totalVotes) * 100) : 0,
    opposePercentage: totalVotes > 0 ? Math.round((opposeVotes / totalVotes) * 100) : 0
  }
}

const getStatusClass = (status) => {
  const statusClasses = {
    ongoing: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const statusTexts = {
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusTexts[status] || '未知'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const formatAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// 格式化余额显示
const formatBalance = (balance) => {
  if (!balance || balance === '0') return '0'
  
  const num = parseFloat(balance)
  
  // 如果小于 0.01，显示完整精度但最多4位小数
  if (num < 0.01) {
    return num.toFixed(4).replace(/\.?0+$/, '')
  }
  
  // 如果小于 1，显示3位小数
  if (num < 1) {
    return num.toFixed(3).replace(/\.?0+$/, '')
  }
  
  // 如果小于 1000，显示2位小数
  if (num < 1000) {
    return num.toFixed(2).replace(/\.?0+$/, '')
  }
  
  // 如果大于等于 1000，使用K单位
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.?0+$/, '') + 'M'
  }
  
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.?0+$/, '') + 'K'
  }
  
  return num.toFixed(2).replace(/\.?0+$/, '')
}

const openVoteModal = (dispute) => {
  selectedDispute.value = dispute
  showVoteModal.value = true
  voteForm.value = {
    decision: null,
    reason: ''
  }
}

const submitVote = async () => {
  if (!web3Store.isConnected) {
    web3Store.error = '请先连接钱包'
    return
  }

  voteSubmitting.value = true
  try {
    // 调用智能合约投票
    // await web3Store.contracts.disputeDAO.vote(
    //   selectedDispute.value.id,
    //   voteForm.value.decision,
    //   voteForm.value.reason
    // )

    // 模拟交易
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 更新本地数据
    const dispute = disputes.value.find(d => d.id === selectedDispute.value.id)
    if (dispute) {
      if (voteForm.value.decision) {
        dispute.votes.for++
      } else {
        dispute.votes.against++
      }
    }

    // 添加到我的投票记录
    myVotes.value.push({
      id: myVotes.value.length + 1,
      disputeId: selectedDispute.value.id,
      disputeTitle: selectedDispute.value.taskTitle + '争议',
      decision: voteForm.value.decision,
      reason: voteForm.value.reason,
      timestamp: new Date().toISOString().split('T')[0],
      reward: '0.5'
    })

    showVoteModal.value = false
    selectedDispute.value = null

  } catch (error) {
    console.error('投票失败:', error)
    web3Store.error = '投票失败，请重试'
  } finally {
    voteSubmitting.value = false
  }
}

const becomeArbitrator = async () => {
  if (!web3Store.isConnected) {
    web3Store.error = '请先连接钱包'
    return
  }

  arbitratorSubmitting.value = true
  try {
    // 调用智能合约成为仲裁员
    // await web3Store.contracts.disputeDAO.becomeArbitrator({
    //   value: ethers.parseEther(arbitratorForm.value.stake)
    // })

    // 模拟交易
    await new Promise(resolve => setTimeout(resolve, 2000))

    isArbitrator.value = true
    arbitratorBalance.value = arbitratorForm.value.stake
    showBecomeArbitratorModal.value = false

  } catch (error) {
    console.error('申请仲裁员失败:', error)
    web3Store.error = '申请失败，请重试'
  } finally {
    arbitratorSubmitting.value = false
  }
}

onMounted(() => {
  loadDisputes()
})
</script> 