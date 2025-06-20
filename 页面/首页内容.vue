<template>
  <!-- 只保留首页导航栏下方的内容部分，去除<header> -->
  <!-- 英雄区域 -->
  <section class="hero">
    <div class="hero-content">
      <h1>去中心化任务悬赏平台</h1>
      <p>基于区块链技术的全球任务协作网络，打破传统平台信任壁垒，实现高效价值交换。Dandelion让全球人才与需求实现无缝对接，共同开启去中心化协作的新纪元。</p>
      
      <div class="hero-actions">
        <button class="btn btn-primary btn-lg">
          <i class="fas fa-plus-circle"></i> 发布任务
        </button>
        <button class="btn btn-outline btn-lg hero-browse-btn">
          <i class="fas fa-search"></i> 浏览任务
        </button>
      </div>
      
      <div class="hero-stats">
        <div class="stat-item">
          <div class="stat-value">8,452</div>
          <div class="stat-label">已完成任务</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">23,189</div>
          <div class="stat-label">注册开发者</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">12,542 ETH</div>
          <div class="stat-label">累计交易额</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">96.7%</div>
          <div class="stat-label">任务成功率</div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Features Section -->
  <section class="features">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">为什么选择 Dandelion？</h2>
        <p class="section-subtitle">我们利用区块链技术重构信任体系，为全球用户提供透明、高效、低成本的协作环境</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-coins"></i>
          </div>
          <h3 class="feature-title">超低成本</h3>
          <p class="feature-description">平台仅收取0.5%的手续费，远低于传统平台10-30%的佣金，让雇主和执行者获得更多收益</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h3 class="feature-title">资金安全保障</h3>
          <p class="feature-description">赏金托管在智能合约中，任务完成后自动发放，彻底杜绝资金挪用和恶意拖欠风险</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-globe"></i>
          </div>
          <h3 class="feature-title">全球无障碍协作</h3>
          <p class="feature-description">支持多链资产结算，打破地域限制，让全球人才无缝对接任务需求</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-users"></i>
          </div>
          <h3 class="feature-title">DAO治理仲裁</h3>
          <p class="feature-description">争议由社区随机选出的仲裁员投票解决，基于链上数据确保公平公正</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-code-branch"></i>
          </div>
          <h3 class="feature-title">Web3原生支持</h3>
          <p class="feature-description">集成Chainlink预言机验证GitHub代码提交，支持分阶段验收，专为Web3任务优化</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-file-contract"></i>
          </div>
          <h3 class="feature-title">永久存证</h3>
          <p class="feature-description">任务成果、操作记录等关键数据同时存储于区块链与IPFS，确保永久可追溯</p>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Popular Tasks -->
  <section class="popular-tasks">
    <div class="container">
      <div class="section-header left">
        <div>
          <h2 class="section-title">热门任务</h2>
          <p class="section-subtitle">探索最新任务机会，展示你的技能，获得丰厚回报</p>
        </div>
        <a href="#" class="view-all">
          查看全部 <i class="fas fa-arrow-right"></i>
        </a>
      </div>
      
      <div class="task-grid">
        <div class="task-card">
          <div class="task-header">
            <div class="task-status status-bidding">竞标中</div>
            <div class="task-title">
              <a href="#">DEX交易平台前端开发</a>
            </div>
            <div class="task-meta">
              <div><i class="far fa-clock"></i> 截止: 2023-10-15</div>
              <div><i class="far fa-user"></i> 参与: 3/10</div>
              <div><i class="fas fa-layer-group"></i> Web3开发</div>
            </div>
          </div>
          <div class="task-body">
            <p class="task-description">为去中心化交易所开发响应式前端界面，要求兼容MetaMask钱包，实现代币交易、流动性添加等功能</p>
            <div class="task-skills">
              <span class="skill-tag">Web3</span>
              <span class="skill-tag">React</span>
              <span class="skill-tag">Ethers.js</span>
              <span class="skill-tag">Solidity</span>
            </div>
          </div>
          <div class="task-footer">
            <div class="reward">1.5 <span class="reward-currency">ETH</span></div>
            <button class="btn btn-primary btn-sm">参与竞标</button>
          </div>
        </div>
        
        <div class="task-card">
          <div class="task-header">
            <div class="task-status status-developing">开发中</div>
            <div class="task-title">
              <a href="#">NFT艺术画廊UI设计</a>
            </div>
            <div class="task-meta">
              <div><i class="far fa-clock"></i> 截止: 2023-10-20</div>
              <div><i class="far fa-user"></i> 中标: @DesignerPro</div>
              <div><i class="fas fa-layer-group"></i> UI/UX设计</div>
            </div>
          </div>
          <div class="task-body">
            <p class="task-description">设计现代简约风格的NFT艺术画廊界面，包含画廊浏览、NFT详情、收藏家资料等页面，需要提供Figma设计稿</p>
            <div class="task-skills">
              <span class="skill-tag">UI设计</span>
              <span class="skill-tag">Figma</span>
              <span class="skill-tag">NFT</span>
            </div>
          </div>
          <div class="task-footer">
            <div class="reward">0.8 <span class="reward-currency">ETH</span></div>
            <button class="btn btn-outline btn-sm">查看详情</button>
          </div>
        </div>
        
        <div class="task-card">
          <div class="task-header">
            <div class="task-status status-reviewing">评审中</div>
            <div class="task-title">
              <a href="#">DAO治理合约开发</a>
            </div>
            <div class="task-meta">
              <div><i class="far fa-clock"></i> 提交于: 1天前</div>
              <div><i class="far fa-user"></i> 执行者: @SolidityDev</div>
              <div><i class="fas fa-layer-group"></i> Web3开发</div>
            </div>
          </div>
          <div class="task-body">
            <p class="task-description">开发基于ERC-20的DAO治理合约，包含提案创建、投票、执行等功能，需通过全面测试并提供部署脚本</p>
            <div class="task-skills">
              <span class="skill-tag">Solidity</span>
              <span class="skill-tag">DAO</span>
              <span class="skill-tag">Hardhat</span>
              <span class="skill-tag">Web3</span>
            </div>
          </div>
          <div class="task-footer">
            <div class="reward">2.2 <span class="reward-currency">ETH</span></div>
            <button class="btn btn-outline btn-sm">查看提交</button>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- 工作流程部分 -->
  <section class="workflow">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">简单高效的工作流程</h2>
        <p class="section-subtitle">从任务创建到赏金发放，全流程自动化保障交易安全</p>
      </div>
      
      <div class="workflow-steps">
        <div class="step">
          <div class="step-icon">
            <i class="fas fa-file-alt"></i>
          </div>
          <h3 class="step-title">创建任务</h3>
          <p class="step-description">雇主发布任务需求，设置赏金金额和截止时间，资金自动托管至智能合约</p>
        </div>
        
        <div class="step">
          <div class="step-icon">
            <i class="fas fa-gavel"></i>
          </div>
          <h3 class="step-title">参与竞标</h3>
          <p class="step-description">执行者浏览任务，提交竞标方案，支付小额押金确保参与诚意</p>
        </div>
        
        <div class="step">
          <div class="step-icon">
            <i class="fas fa-code"></i>
          </div>
          <h3 class="step-title">执行任务</h3>
          <p class="step-description">中标者按任务要求完成工作，支持分阶段提交成果</p>
        </div>
        
        <div class="step">
          <div class="step-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3 class="step-title">验收付款</h3>
          <p class="step-description">雇主验收成果，智能合约自动释放赏金，执行者获得报酬</p>
        </div>
      </div>
    </div>
  </section>
  
  <!-- 用户评价部分 -->
  <section class="testimonials">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">用户评价</h2>
        <p class="section-subtitle">听听我们的用户怎么说</p>
      </div>
      
      <div class="testimonial-grid">
        <div class="testimonial-card">
          <p class="testimonial-content">Dandelion彻底改变了我的工作方式！作为自由开发者，现在我可以轻松找到高质量的Web3项目，而且佣金只有传统平台的5%。资金托管在智能合约中，再也不用担心雇主拖欠款项了。</p>
          <div class="testimonial-author">
            <div class="author-avatar">JD</div>
            <div class="author-info">
              <h4>张开发者</h4>
              <div class="author-role">区块链开发工程师</div>
            </div>
          </div>
        </div>
        
        <div class="testimonial-card">
          <p class="testimonial-content">我们创业团队使用Dandelion外包了UI设计和智能合约开发，效率远超预期。DAO仲裁机制非常公正，有一次设计稿争议，社区仲裁员在24小时内就给出了公平的解决方案。</p>
          <div class="testimonial-author">
            <div class="author-avatar">LW</div>
            <div class="author-info">
              <h4>李伟</h4>
              <div class="author-role">TechStart 创始人</div>
            </div>
          </div>
        </div>
        
        <div class="testimonial-card">
          <p class="testimonial-content">作为设计师，我最喜欢Dandelion的全球协作能力。最近完成了一个美国NFT项目的界面设计，赏金直接以ETH支付，避免了传统跨境支付的高额手续费和漫长等待。</p>
          <div class="testimonial-author">
            <div class="author-avatar">CX</div>
            <div class="author-info">
              <h4>陈曦</h4>
              <div class="author-role">UI/UX设计师</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- 行动召唤部分 -->
  <section class="cta">
    <div class="container">
      <div class="cta-content">
        <h2>加入去中心化任务协作革命</h2>
        <p>无论你是寻找优秀人才的雇主，还是希望展示技能的自由职业者，Dandelion都能为你提供最透明、高效、安全的协作平台</p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-lg">
            <i class="fas fa-plus-circle"></i> 发布任务
          </button>
          <button class="btn btn-outline btn-lg hero-browse-btn">
            <i class="fas fa-search"></i> 浏览任务
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// 如有首页内容相关逻辑，可在此添加
</script>
<style scoped>
/* 英雄区域全宽无留白 */
.hero {
  background: var(--purple-gradient);
  color: white;
  padding: 100px 0 80px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 80px;
  /* 增宽hero区域 */
  width: 100vw;
  min-width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  max-width: 100vw;
  box-sizing: border-box;
}

.hero-content {
  /* 增宽内容区域 */
  width: 1400px;
  max-width: 95vw;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.1;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 40px;
  opacity: 0.9;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 25px 0;
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari 9+ */
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  box-sizing: border-box;
  user-select: none;
  -webkit-user-select: none; /* Safari 3+ */
}

.stat-item {
  text-align: center;
  min-width: 180px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
}

/* 平台优势部分 */
.features {
  padding: 80px 0;
}

.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 60px;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--purple-gradient);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 40px 30px;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
  border: 1px solid var(--border);
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-light);
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 25px;
  background: var(--purple-gradient);
  color: white;
}

.feature-title {
  font-size: 1.3rem;
  margin-bottom: 15px;
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.7;
}

/* 热门任务 */
.popular-tasks {
  padding: 80px 0;
  background-color: var(--background-alt);
}

.section-header.left {
  text-align: left;
  max-width: 100%;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.view-all {
  font-size: 1rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: var(--transition);
}

.view-all:hover {
  color: var(--primary-dark);
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.task-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
  background-color: var(--card-bg);
  position: relative;
}

.task-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
}

.task-header {
  padding: 20px;
  border-bottom: 1px solid var(--border);
  position: relative;
}

.task-status {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

.status-bidding {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--info);
}

.status-developing {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.status-reviewing {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.status-disputed {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error);
}

.task-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-title a {
  color: var(--text-primary);
  text-decoration: none;
  transition: var(--transition);
}

.task-title a:hover {
  color: var(--primary);
}

.task-meta {
  display: flex;
  gap: 16px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  flex-wrap: wrap;
}

.task-meta div {
  display: flex;
  align-items: center;
  gap: 5px;
}

.task-body {
  padding: 20px;
}

.task-description {
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-size: 0.95rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.skill-tag {
  background-color: rgba(108, 99, 255, 0.1);
  color: var(--primary);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 500;
}

.task-footer {
  padding: 15px 20px;
  background-color: rgba(241, 245, 249, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reward {
  font-weight: 700;
  color: var(--primary);
  font-size: 1.1rem;
}

.reward-currency {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-left: 4px;
}

/* 工作流程 */
.workflow {
  padding: 80px 0;
}

.workflow-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  counter-reset: step-counter;
  position: relative;
}

.workflow-steps::before {
  content: '';
  position: absolute;
  top: 60px;
  left: 50px;
  right: 50px;
  height: 3px;
  background: var(--background);
  z-index: 1;
}

.step {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 30px 20px;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition);
}

.step:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-xl);
}

.step::before {
  counter-increment: step-counter;
  content: counter(step-counter);
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background: var(--purple-gradient);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.step-icon {
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 20px;
}

.step-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.step-description {
  color: var(--text-secondary);
  line-height: 1.7;
}

/* 用户评价 */
.testimonials {
  padding: 80px 0;
  background-color: var(--background-alt);
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.testimonial-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 30px;
  box-shadow: var(--shadow-md);
  position: relative;
  border: 1px solid var(--border);
}

.testimonial-card::before {
  content: '"';
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 4rem;
  color: var(--primary-light);
  font-family: Georgia, serif;
  line-height: 1;
}

.testimonial-content {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 25px;
  position: relative;
  z-index: 2;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-full);
  background: var(--teal-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.author-info h4 {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.author-role {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* 行动召唤 */
.cta {
  padding: 80px 0;
  text-align: center;
  background: var(--purple-gradient);
  color: white;
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
}

.cta h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.cta p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
}

/* 页脚 */
footer {
  background-color: var(--card-bg);
  padding: 60px 0 0;
  border-top: 1px solid var(--border);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 50px;
}

.footer-column h3 {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: var(--text-primary);
  position: relative;
  padding-bottom: 10px;
}

.footer-column h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: var(--purple-gradient);
  border-radius: 2px;
}

.footer-column ul {
  list-style: none;
}

.footer-column ul li {
  margin-bottom: 12px;
}

.footer-column a {
  text-decoration: none;
  color: var(--text-secondary);
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-column a:hover {
  color: var(--primary);
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-links a {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: var(--transition);
}

.social-links a:hover {
  background: var(--purple-gradient);
  color: white;
  transform: translateY(-3px);
}

.copyright {
  text-align: center;
  padding: 25px 0;
  margin-top: 30px;
  border-top: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }
  
  nav ul {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--card-bg);
    padding: 20px;
    box-shadow: var(--shadow-md);
    flex-direction: column;
    gap: 15px;
  }
  
  nav ul.open {
    display: flex;
  }
  
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  
  .task-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .workflow-steps::before {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>
