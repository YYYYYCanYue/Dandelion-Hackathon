<template>
  <div class="profile-page min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20">
    <!-- 页面头部 -->
    <div class="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden dark-section">
      <div class="absolute inset-0 bg-hero-pattern opacity-10"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold mb-4 text-on-dark-bright animate-fade-in-up">
            个人中心
          </h1>
          <p class="text-xl text-on-dark-secondary animate-fade-in-up" style="animation-delay: 0.2s;">
            管理您的任务、收益和账户设置
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 用户信息卡片 -->
      <div class="card-business rounded-2xl p-8 mb-8 shadow-business-lg animate-fade-in-up">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <div class="w-20 h-20 business-gradient rounded-2xl flex items-center justify-center shadow-business">
              <span class="text-2xl font-bold text-white">
                {{ web3Store.account ? web3Store.account.slice(2, 4).toUpperCase() : '?' }}
              </span>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-neutral-900 mb-1">
                {{ web3Store.account ? formatAddress(web3Store.account) : '未连接钱包' }}
              </h2>
              <p class="text-neutral-600 mb-2">{{ userStats.role }}</p>
              <div class="flex items-center">
                <div class="flex text-secondary-400">
                  <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= userStats.rating ? 'text-secondary-400' : 'text-neutral-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <span class="ml-2 text-sm text-neutral-600">{{ userStats.rating.toFixed(1) }} ({{ userStats.reviewCount }} 评价)</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold gold-text mb-1">{{ formatBalance(userStats.balance) }} AVAX</div>
            <div class="text-sm text-neutral-600">可用余额</div>
          </div>
        </div>
      </div>

      <!-- 统计概览 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card-business rounded-2xl p-6 shadow-business animate-fade-in-up" style="animation-delay: 0.1s;">
          <div class="flex items-center">
            <div class="w-12 h-12 business-gradient rounded-xl flex items-center justify-center shadow-business">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <div class="text-sm font-medium text-neutral-600">发布任务</div>
              <div class="text-2xl font-bold text-neutral-900">{{ userStats.publishedTasks }}</div>
            </div>
          </div>
        </div>

        <div class="card-business rounded-2xl p-6 shadow-business animate-fade-in-up" style="animation-delay: 0.2s;">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <div class="text-sm font-medium text-neutral-600">完成任务</div>
              <div class="text-2xl font-bold text-neutral-900">{{ userStats.completedTasks }}</div>
            </div>
          </div>
        </div>

        <div class="card-business rounded-2xl p-6 shadow-business animate-fade-in-up" style="animation-delay: 0.3s;">
          <div class="flex items-center">
            <div class="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center shadow-gold">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <div class="text-sm font-medium text-neutral-600">总收益</div>
              <div class="text-2xl font-bold text-neutral-900">{{ formatBalance(userStats.totalEarnings) }} AVAX</div>
            </div>
          </div>
        </div>

        <div class="card-business rounded-2xl p-6 shadow-business animate-fade-in-up" style="animation-delay: 0.4s;">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <div class="text-sm font-medium text-neutral-600">成功率</div>
              <div class="text-2xl font-bold text-neutral-900">{{ userStats.successRate }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 选项卡导航 -->
      <div class="mb-8 animate-fade-in-up" style="animation-delay: 0.5s;">
        <nav class="card-business rounded-2xl p-2 shadow-business">
          <div class="flex space-x-2">
            <button
              v-for="tab in tabs"
              :key="tab.name"
              @click="activeTab = tab.name"
              :class="[
                activeTab === tab.name
                  ? 'business-gradient text-white shadow-business'
                  : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50',
                'flex-1 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </nav>
      </div>

      <!-- 选项卡内容 -->
      <div class="card-business rounded-2xl shadow-business-lg animate-fade-in-up" style="animation-delay: 0.6s;">
        <!-- 我发布的任务 -->
        <div v-show="activeTab === 'published'" class="p-8">
          <div v-if="publishedTasks.length === 0" class="text-center py-16">
            <div class="w-32 h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg class="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-neutral-900 mb-4">暂无发布的任务</h3>
            <p class="text-neutral-600 mb-8 max-w-md mx-auto">开始发布您的第一个任务，寻找合适的人才来完成您的项目</p>
            <router-link to="/create-task" class="btn-primary px-8 py-3 shadow-business">
              <span class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                发布任务
              </span>
            </router-link>
          </div>

          <div v-else class="space-y-6">
            <div
              v-for="(task, index) in publishedTasks"
              :key="task.id"
              class="card-business rounded-xl p-6 shadow-business hover:shadow-business-lg transition-all duration-300 card-hover"
              :style="`animation-delay: ${index * 0.1}s`"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <h3 class="text-xl font-bold text-neutral-900">{{ task.title }}</h3>
                    <span :class="getStatusClass(task.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                      {{ getStatusText(task.status) }}
                    </span>
                  </div>
                  <p class="text-neutral-600 mb-4 line-clamp-2">{{ task.description }}</p>
                  <div class="flex items-center gap-6 text-sm text-neutral-500">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                      </svg>
                      奖金: {{ formatBalance(task.reward) }} AVAX
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      参与者: {{ task.participants }} 人
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      截止: {{ formatDate(task.deadline) }}
                    </span>
                  </div>
                </div>
                <div class="ml-6 flex gap-3">
                  <router-link
                    :to="`/task/${task.id}`"
                    class="btn-outline px-4 py-2 text-sm"
                  >
                    查看详情
                  </router-link>
                  <button
                    v-if="task.status === 0"
                    @click="cancelTask(task.id)"
                    class="px-4 py-2 text-sm font-medium text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg transition-colors"
                  >
                    取消任务
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 我参与的任务 -->
        <div v-show="activeTab === 'participated'" class="p-8">
          <div v-if="participatedTasks.length === 0" class="text-center py-16">
            <div class="w-32 h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg class="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2a2 2 0 002 2h4a2 2 0 002-2zm0 2a2 2 0 11-4 0 2 2 0 014 0zM12 14l9-5-9-5-9 5 9 5z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-neutral-900 mb-4">暂无参与的任务</h3>
            <p class="text-neutral-600 mb-8 max-w-md mx-auto">去任务大厅寻找适合您技能的任务，开始您的接单之旅</p>
            <router-link to="/tasks" class="btn-primary px-8 py-3 shadow-business">
              <span class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                浏览任务
              </span>
            </router-link>
          </div>

          <div v-else class="space-y-6">
            <div
              v-for="(task, index) in participatedTasks"
              :key="task.id"
              class="card-business rounded-xl p-6 shadow-business hover:shadow-business-lg transition-all duration-300 card-hover"
              :style="`animation-delay: ${index * 0.1}s`"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <h3 class="text-xl font-bold text-neutral-900">{{ task.title }}</h3>
                    <span :class="getStatusClass(task.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                      {{ getStatusText(task.status) }}
                    </span>
                    <span
                      v-if="task.isWinner"
                      class="px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-800"
                    >
                      已中标
                    </span>
                  </div>
                  <p class="text-neutral-600 mb-4 line-clamp-2">{{ task.description }}</p>
                  <div class="flex items-center gap-6 text-sm text-neutral-500">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                      </svg>
                      奖金: {{ formatBalance(task.reward) }} AVAX
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      参与时间: {{ formatDate(task.participatedAt || task.createdAt) }}
                    </span>
                  </div>
                </div>
                <div class="ml-6 flex gap-3">
                  <router-link
                    :to="`/task/${task.id}`"
                    class="btn-outline px-4 py-2 text-sm"
                  >
                    查看详情
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 收益记录 -->
        <div v-show="activeTab === 'earnings'" class="p-8">
          <!-- 收益统计卡片 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="card-business rounded-xl p-6 shadow-business">
              <div class="flex items-center">
                <div class="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center shadow-gold">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-neutral-600">总收益</div>
                  <div class="text-2xl font-bold text-neutral-900">{{ formatBalance(earningsStats.totalEarnings) }} AVAX</div>
                </div>
              </div>
            </div>
            
            <div class="card-business rounded-xl p-6 shadow-business">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-neutral-600">月收益</div>
                  <div class="text-2xl font-bold text-neutral-900">{{ formatBalance(earningsStats.monthlyEarnings) }} AVAX</div>
                </div>
              </div>
            </div>
            
            <div class="card-business rounded-xl p-6 shadow-business">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-neutral-600">平均收益</div>
                  <div class="text-2xl font-bold text-neutral-900">{{ formatBalance(earningsStats.avgEarnings) }} AVAX</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 收益历史表格 -->
          <div class="card-business rounded-xl shadow-business overflow-hidden">
            <div class="px-6 py-4 border-b border-neutral-200">
              <h3 class="text-lg font-semibold text-neutral-900">收益历史</h3>
            </div>
            
            <div v-if="earningsHistory.length === 0" class="text-center py-16">
              <div class="w-32 h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg class="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-neutral-900 mb-4">暂无收益记录</h3>
              <p class="text-neutral-600">完成任务后，您的收益记录将显示在这里</p>
            </div>
            
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-neutral-200">
                <thead class="bg-neutral-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      任务信息
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      金额
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      时间
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      状态
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-neutral-200">
                  <tr v-for="earning in earningsHistory" :key="earning.id" class="hover:bg-neutral-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-sm font-medium text-neutral-900">{{ earning.taskTitle }}</div>
                        <div class="text-sm text-neutral-500">任务ID: {{ earning.taskId }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {{ earning.type }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-semibold text-success-600">+{{ formatBalance(earning.amount) }} AVAX</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {{ formatDate(earning.date) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800">
                        已完成
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 设置 -->
        <div v-show="activeTab === 'settings'" class="p-8">
          <div class="max-w-2xl">
            <h3 class="text-2xl font-bold text-neutral-900 mb-8">账户设置</h3>
            
            <div class="space-y-8">
              <div class="card-business rounded-xl p-6 shadow-business">
                <label class="block text-sm font-semibold text-neutral-700 mb-3">
                  钱包地址
                </label>
                <div class="flex items-center gap-3">
                  <input
                    :value="web3Store.account || ''"
                    type="text"
                    class="flex-1 input-business bg-neutral-50"
                    readonly
                  >
                  <button
                    @click="copyAddress"
                    class="btn-outline px-4 py-2 text-sm"
                  >
                    复制
                  </button>
                </div>
              </div>

              <div class="card-business rounded-xl p-6 shadow-business">
                <label class="block text-sm font-semibold text-neutral-700 mb-4">
                  通知设置
                </label>
                <div class="space-y-4">
                  <label class="flex items-center p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                    <input
                      v-model="notificationSettings.taskUpdates"
                      type="checkbox"
                      class="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    >
                    <div class="ml-3">
                      <div class="text-sm font-medium text-neutral-700">任务状态更新通知</div>
                      <div class="text-xs text-neutral-500">当您的任务状态发生变化时接收通知</div>
                    </div>
                  </label>
                  <label class="flex items-center p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                    <input
                      v-model="notificationSettings.newTasks"
                      type="checkbox"
                      class="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    >
                    <div class="ml-3">
                      <div class="text-sm font-medium text-neutral-700">新任务推荐通知</div>
                      <div class="text-xs text-neutral-500">根据您的技能和兴趣推荐相关任务</div>
                    </div>
                  </label>
                  <label class="flex items-center p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                    <input
                      v-model="notificationSettings.payments"
                      type="checkbox"
                      class="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    >
                    <div class="ml-3">
                      <div class="text-sm font-medium text-neutral-700">支付和收益通知</div>
                      <div class="text-xs text-neutral-500">当您收到付款或产生收益时接收通知</div>
                    </div>
                  </label>
                </div>
              </div>

              <div class="pt-6 border-t border-neutral-200">
                <button
                  @click="saveSettings"
                  class="btn-primary px-8 py-3 shadow-business"
                >
                  <span class="flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    保存设置
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useWeb3Store } from '@/stores/web3'
import { useDataStore } from '@/stores/data'

const web3Store = useWeb3Store()
const dataStore = useDataStore()

// 响应式数据
const activeTab = ref('published')

// 选项卡配置
const tabs = [
  { name: 'published', label: '我发布的' },
  { name: 'participated', label: '我参与的' },
  { name: 'earnings', label: '收益记录' },
  { name: 'settings', label: '设置' }
]

// 通知设置
const notificationSettings = ref({
  taskUpdates: true,
  newTasks: false,
  payments: true
})

// 计算属性 - 从dataStore获取数据
const publishedTasks = computed(() => {
  if (!web3Store.account) return []
  return dataStore.tasksByCreator(web3Store.account)
})

const participatedTasks = computed(() => {
  if (!web3Store.account) return []
  return dataStore.tasksByParticipant(web3Store.account).map(task => {
    const taskBids = dataStore.getBidsByTaskId(task.id)
    const userBid = taskBids.find(bid => 
      bid.bidder.toLowerCase() === web3Store.account.toLowerCase()
    )
    return {
      ...task,
      participatedAt: userBid?.timestamp,
      isWinner: userBid?.isWinner || false
    }
  })
})

// 用户统计数据
const userStats = computed(() => {
  const published = publishedTasks.value.length
  const participated = participatedTasks.value.length
  const completed = publishedTasks.value.filter(task => task.status === 3).length
  const wonTasks = participatedTasks.value.filter(task => task.isWinner).length
  
  const totalEarnings = participatedTasks.value
    .filter(task => task.isWinner && task.status === 3)
    .reduce((sum, task) => sum + parseFloat(task.reward || 0), 0)
  
  const successRate = participated > 0 ? Math.round((wonTasks / participated) * 100) : 0
  
  return {
    role: published > participated ? '雇主' : participated > published ? '雇佣兵' : '新用户',
    rating: 4.8, // 暂时使用固定值
    reviewCount: completed + wonTasks,
    balance: web3Store.formattedBalance,
    publishedTasks: published,
    completedTasks: completed,
    totalEarnings: totalEarnings.toFixed(1),
    successRate
  }
})

// 收益历史记录
const earningsHistory = computed(() => {
  return participatedTasks.value
    .filter(task => task.isWinner && task.status === 3)
    .map(task => ({
      id: task.id,
      taskId: task.id,
      taskTitle: task.title,
      type: '任务奖金',
      amount: task.reward,
      date: task.createdAt // 实际应该是完成时间
    }))
    .slice(0, 10) // 只显示最近10条
})

// 收益统计
const earningsStats = computed(() => {
  const total = parseFloat(userStats.value.totalEarnings)
  const monthly = total * 0.3 // 模拟月收益
  const avg = earningsHistory.value.length > 0 ? 
    total / earningsHistory.value.length : 0
  
  return {
    totalEarnings: total.toFixed(1),
    monthlyEarnings: monthly.toFixed(1),
    avgEarnings: avg.toFixed(1)
  }
})

// 方法
const loadUserData = async () => {
  // 数据通过计算属性从dataStore获取，无需额外加载
  // 如果需要刷新数据，可以调用 dataStore.initializeData()
}

const cancelTask = async (taskId) => {
  if (!confirm('确定要取消这个任务吗？已支付的资金将退还到您的钱包。')) {
    return
  }

  try {
    await dataStore.updateTask(taskId, { status: 4 }) // 4: 已取消
    // 数据会通过计算属性自动更新
    alert('任务取消成功')
  } catch (error) {
    console.error('取消任务失败:', error)
    alert('取消任务失败，请重试')
  }
}

const copyAddress = async () => {
  if (web3Store.account) {
    try {
      await navigator.clipboard.writeText(web3Store.account)
      // 这里可以显示复制成功的提示
    } catch (error) {
      console.error('复制地址失败:', error)
    }
  }
}

const saveSettings = () => {
  // 保存设置到本地存储或后端
  localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings.value))
  // 显示保存成功提示
}

const getStatusClass = (status) => {
  const statusClasses = {
    0: 'bg-green-100 text-green-800',
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-gray-100 text-gray-800',
    4: 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const statusTexts = {
    0: '开放竞标',
    1: '进行中',
    2: '等待确认',
    3: '已完成',
    4: '已取消'
  }
  return statusTexts[status] || '未知'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const formatAddress = (address) => {
  if (!address) return ''
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

// 监听钱包连接状态变化
// ... existing code ...

// 监听钱包连接状态变化
watch(() => web3Store.account, () => {
  if (web3Store.account) {
    loadUserData()
  }
})

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
/* 用户个人资料页面特定样式 */
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 75%, #ffffff 100%);
}

.profile-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 232, 240, 0.3);
  box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.1), 0 4px 6px -2px rgba(30, 58, 138, 0.05);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.profile-avatar {
  width: 6rem;
  height: 6rem;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.profile-name {
  font-size: 1.875rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.profile-role {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.profile-role.employer {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
}

.profile-role.mercenary {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: white;
}

.profile-role.newbie {
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
  color: white;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.profile-stat {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.3);
  transition: all 0.3s ease;
}

.profile-stat:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.profile-stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.profile-stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.profile-tabs {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 232, 240, 0.3);
  border-radius: 1rem;
  overflow: hidden;
}

.tab-nav {
  display: flex;
  border-bottom: 1px solid rgba(226, 232, 240, 0.3);
}

.tab-button {
  flex: 1;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button.active {
  color: #1e40af;
  background: rgba(59, 130, 246, 0.05);
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
}

.tab-button:hover:not(.active) {
  background: rgba(59, 130, 246, 0.02);
  color: #374151;
}

.tab-content {
  padding: 2rem;
  min-height: 400px;
}

.task-list {
  display: grid;
  gap: 1rem;
}

.task-item {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(226, 232, 240, 0.3);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.task-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.task-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.task-item-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.task-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.task-item-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.task-item-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.task-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(226, 232, 240, 0.3);
}

.task-item-reward {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}

.task-item-actions {
  display: flex;
  gap: 0.5rem;
}

.task-action-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.task-action-button.primary {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
}

.task-action-button.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(30, 58, 138, 0.2);
}

.task-action-button.danger {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: white;
}

.task-action-button.danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.2);
}

.earnings-section {
  margin-bottom: 2rem;
}

.earnings-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.earnings-stat {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(226, 232, 240, 0.3);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.earnings-stat:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.earnings-stat-number {
  font-size: 1.875rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.earnings-stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.earnings-history {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(226, 232, 240, 0.3);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.earnings-history-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.earnings-list {
  display: grid;
  gap: 0.75rem;
}

.earnings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0.5rem;
  border: 1px solid rgba(226, 232, 240, 0.2);
}

.earnings-item-info {
  flex: 1;
}

.earnings-item-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.earnings-item-meta {
  font-size: 0.875rem;
  color: #6b7280;
}

.earnings-item-amount {
  font-size: 1.125rem;
  font-weight: 700;
  color: #059669;
}

.settings-section {
  display: grid;
  gap: 2rem;
}

.settings-group {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(226, 232, 240, 0.3);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.settings-group-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.3);
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item-info {
  flex: 1;
}

.settings-item-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.settings-item-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.settings-toggle {
  width: 3rem;
  height: 1.5rem;
  background: #d1d5db;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.settings-toggle.active {
  background: #3b82f6;
}

.settings-toggle::after {
  content: '';
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.settings-toggle.active::after {
  transform: translateX(1.5rem);
}

.save-settings-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.save-settings-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.2);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-header {
    padding: 1.5rem;
  }
  
  .profile-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tab-nav {
    flex-wrap: wrap;
  }
  
  .tab-button {
    flex: 1 1 50%;
  }
  
  .tab-content {
    padding: 1.5rem;
  }
  
  .task-item {
    padding: 1rem;
  }
  
  .task-item-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .task-item-footer {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
  
  .earnings-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .profile-stats {
    grid-template-columns: 1fr;
  }
  
  .tab-button {
    flex: 1 1 100%;
  }
  
  .settings-item {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .profile-container {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 75%, #475569 100%);
  }
  
  .profile-header,
  .profile-tabs {
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(100, 116, 139, 0.3);
    color: #f1f5f9;
  }
  
  .profile-name {
    color: #f9fafb;
  }
  
  .profile-stat,
  .task-item,
  .earnings-stat,
  .earnings-history,
  .settings-group {
    background: rgba(30, 41, 59, 0.6);
    border-color: rgba(100, 116, 139, 0.3);
    color: #f1f5f9;
  }
  
  .profile-stat-number,
  .earnings-stat-number,
  .task-item-title,
  .earnings-history-title,
  .settings-group-title,
  .settings-item-title {
    color: #f9fafb;
  }
  
  .profile-stat-label,
  .earnings-stat-label,
  .task-item-description,
  .earnings-item-meta,
  .settings-item-description {
    color: #cbd5e1;
  }
}
</style> 