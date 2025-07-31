<template>
  <div class="home-container">
    <!-- 封面轮播图区域 -->
    <div class="hero-section">
      <div class="hero-carousel">
        <div class="hero-slide" v-for="(slide, index) in heroSlides" :key="index" 
             :class="{ active: currentSlide === index }">
          <img :src="slide.image" :alt="slide.title" class="hero-image" />
          <div class="hero-overlay">
            <div class="hero-content">
              <h1 class="hero-title">{{ slide.title }}</h1>
              <p class="hero-description">{{ slide.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-controls" v-if="heroSettings.showControls">
        <button class="hero-prev" @click="prevSlide">‹</button>
        <button class="hero-next" @click="nextSlide">›</button>
      </div>
      <div class="hero-indicators" v-if="heroSettings.showIndicators">
        <span v-for="(slide, index) in heroSlides" :key="index" 
              :class="{ active: currentSlide === index }"
              @click="goToSlide(index)"></span>
      </div>
      <!-- 向下滑动指示箭头 -->
      <div v-show="showScrollIndicator" class="scroll-indicator" @click="scrollToGallery">
        <div class="scroll-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 左上角品牌logo -->
    <div class="top-brand" :class="{ hidden: isNavHidden }">
      <div class="brand-content">
        <router-link :to="'/'" class="brand-link">
          <img class="site-logo" :src="bottom_icon" alt="Logo">
          <h2 class="site-name">{{ site_name }}</h2>
        </router-link>
        <div class="brand-description" v-if="bottom_desc">{{ bottom_desc }}</div>
      </div>
    </div>

    <!-- 右上角操作按钮 -->
    <div class="top-actions" :class="{ hidden: isNavHidden }">
      <button @click="toggleFullScreen" class="action-btn">{{ fullScreenText }}</button>
      <button @click="showAboutModal" class="action-btn">关于</button>
    </div>

    <!-- 分类导航 -->
    <div class="categories-nav-section">
      <div class="categories-container">
        <div class="categories-scroll">
          <div class="category-item" :class="{ active: currentCategory === null }" @click="handleCategoryClick(null)">全部</div>
          <div v-for="category in categories" :key="category.id" 
               class="category-item"
               :class="{ active: currentCategory === category.alias }"
               @click="handleCategoryClick(category.alias)">{{ category.name }}</div>
        </div>
      </div>
    </div>

    <!-- 瀑布流相册 -->
    <div class="gallery-section">
      <Main :current-category="currentCategory" />
    </div>

    <Footer />

    <!-- 关于弹窗 -->
    <div v-if="showAbout" class="about-modal" @click="closeAboutModal">
      <div class="about-content" @click.stop>
        <button class="close-btn" @click="closeAboutModal">×</button>
        <h2>关于{{ site_name }}</h2>
        <div class="about-info">
          <p>{{ site_desc }}</p>
        </div>
        <section v-if="entries.length > 0" class="about-shortcuts">
          <h3>快捷入口</h3>
          <ul class="about-shortcuts-list">
            <li v-for="entry in entries" :key="entry.id || entry.name" class="about-shortcut">
              <a :href="entry.url" target="_blank" rel="noopener nofollow">
                <TheIcon :icon="entry.icon" :size="20" />
                <span class="about-shortcut-label">{{ entry.name }}</span>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>

    <!-- 回到顶部按钮 -->
    <div v-show="showBackToTop" class="back-to-top" @click="scrollToTop">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 14L12 9L7 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import Footer from './components/Footer.vue'
import Main from './components/Main.vue'
import TheIcon from '@/components/icon/TheIcon.vue'
import { useSettingStore } from '@/store'
import api from '@/api'
import { isValueNotEmpty } from '@/utils'

const settingStore = useSettingStore()
const categories = ref([])
const heroSlides = ref([])
const currentSlide = ref(0)
const fullScreenText = ref("全屏")
let slideInterval = null

// 当前选中的分类
const currentCategory = ref(null)

// 分类切换处理函数
const handleCategoryClick = (categoryAlias = null) => {
  currentCategory.value = categoryAlias
  // 滚动到相册区域
  setTimeout(() => {
    const gallerySection = document.querySelector('.gallery-section')
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

// 网站配置 - 使用响应式计算属性
const site_name = computed(() => {
  return isValueNotEmpty(settingStore.metaSetting?.site_name) ? settingStore.metaSetting?.site_name : import.meta.env.VITE_TITLE
})
const site_desc = computed(() => {
  return isValueNotEmpty(settingStore.metaSetting?.site_desc) ? settingStore.metaSetting?.site_desc : import.meta.env.VITE_DESC
})
const bottom_icon = computed(() => {
  return isValueNotEmpty(settingStore.metaSetting?.bottom_icon) ? settingStore.metaSetting?.bottom_icon : import.meta.env.VITE_ICON
})
const bottom_desc = computed(() => {
  return isValueNotEmpty(settingStore.metaSetting?.bottom_desc) ? settingStore.metaSetting?.bottom_desc : ''
})
const entries = computed(() => {
  const rawEntries = isValueNotEmpty(settingStore.metaSetting?.entries) ? settingStore.metaSetting?.entries : []
  return rawEntries.filter(entry => entry && entry.name && entry.name.trim() !== '' && entry.url && entry.url.trim() !== '')
})
const site_url = computed(() => {
  return isValueNotEmpty(settingStore.metaSetting?.site_url) ? settingStore.metaSetting?.site_url : window.location.origin
})
const primary_color = computed(() => {
  return isValueNotEmpty(settingStore.metaSetting?.primary_color) ? settingStore.metaSetting?.primary_color : import.meta.env.VITE_PRIMARY_COLOR
})
const site_splitter = computed(() => {
  return isValueNotEmpty(settingStore.metaSetting?.site_splitter) ? settingStore.metaSetting?.site_splitter : import.meta.env.VITE_TITLE_SPLITTER
})

// 轮播图控制
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? heroSlides.value.length - 1 : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// 自动轮播
const startAutoSlide = () => {
  if (heroSettings.value.autoplay) {
    slideInterval = setInterval(nextSlide, heroSettings.value.interval)
  }
}

const stopAutoSlide = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

// 全屏功能
const isFullScreen = () => {
  return document.fullScreen || document.fullscreenElement !== null
}

const toggleFullScreen = () => {
  if (isFullScreen()) {
    document.exitFullscreen()
    fullScreenText.value = "全屏"
  } else {
    document.documentElement.requestFullscreen()
    fullScreenText.value = "退出全屏"
  }
}

// 关于弹窗
const showAbout = ref(false)

const showAboutModal = () => {
  showAbout.value = true
  document.body.style.overflow = 'hidden'
}

const closeAboutModal = () => {
  showAbout.value = false
  document.body.style.overflow = 'auto'
}

// 滚动到相册区域
const scrollToGallery = () => {
  const gallerySection = document.querySelector('.gallery-section')
  if (gallerySection) {
    gallerySection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 滚动指示器显示状态
const showScrollIndicator = ref(true)

// 导航栏隐藏状态
const isNavHidden = ref(false)
let lastScrollY = 0

// 回到顶部按钮显示状态
const showBackToTop = ref(false)

// 滚动监听函数
const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  // 滚动指示器逻辑
  showScrollIndicator.value = currentScrollY < 50 // 滚动超过50px时隐藏
  
  // 导航栏隐藏逻辑
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    // 向下滚动且超过100px时隐藏导航栏
    isNavHidden.value = true
  } else {
    // 向上滚动时显示导航栏
    isNavHidden.value = false
  }
  
  // 回到顶部按钮显示逻辑
  showBackToTop.value = currentScrollY > 300 // 滚动超过300px时显示
  
  lastScrollY = currentScrollY
}

// 回到顶部方法
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 获取数据
const loadCategories = async () => {
  try {
    const response = await api.getCategoriesVisitor()
    if (response.code === 200) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

// 封面设置
const heroSettings = ref({
  autoplay: true,
  interval: 5000,
  showIndicators: true,
  showControls: true
})

const loadHeroSlides = async () => {
  try {
    // 确保获取最新的meta设置
    await settingStore.getMetaSetting()
    const metaSetting = settingStore.metaSetting || {}
    
    // 更新封面设置
    heroSettings.value = {
      autoplay: metaSetting.hero_autoplay ?? true,
      interval: metaSetting.hero_interval ?? 5000,
      showIndicators: metaSetting.hero_show_indicators ?? true,
      showControls: metaSetting.hero_show_controls ?? true
    }
    
    if (metaSetting.hero_images && metaSetting.hero_images.length > 0) {
      heroSlides.value = metaSetting.hero_images.map(item => ({
        image: item.url,
        title: item.title,
        description: item.description
      }))
    } else {
      // 默认封面图
      heroSlides.value = [
        {
          image: '/assets/20200212-38ce26bb0bd0d.gif',
          title: '欢迎来到时光工作室',
          description: '记录生活中的美好瞬间'
        },
        {
          image: '/assets/20200212-6dafa53ecf4e3.gif',
          title: '摄影作品集',
          description: '用镜头捕捉世界的精彩'
        },
        {
          image: '/assets/20200212-e056a5f2914d6.gif',
          title: '创意无限',
          description: '探索视觉艺术的无限可能'
        }
      ]
    }
  } catch (error) {
    console.error('Failed to load hero slides:', error)
    // 使用默认封面图
    heroSlides.value = [
      {
        image: '/assets/20200212-38ce26bb0bd0d.gif',
        title: '欢迎来到时光工作室',
        description: '记录生活中的美好瞬间'
      }
    ]
  }
}

onMounted(async () => {
  await loadCategories()
  await loadHeroSlides()
  if (heroSlides.value.length > 1) {
    startAutoSlide()
  }
  
  // 应用动态样式
  const style = document.createElement('style')
  style.textContent = `:root { --moment-theme: ${primary_color.value} !important; }`
  document.head.appendChild(style)
  
  // 设置页面标题
  document.title = `${site_name.value}${site_splitter.value}${site_desc.value}`
  
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  stopAutoSlide()
  // 移除滚动监听
  window.removeEventListener('scroll', handleScroll)
})
</script>
<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background: #0a0a0a;
  color: #e0e0e0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
}

.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  padding-top: 0;
}

/* 封面轮播图样式 */
.hero-section {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.hero-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.hero-slide.active {
  opacity: 1;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 60%, rgba(10,10,10,0.95) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 0 15px;
}

.hero-title {
  font-size: 8.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  animation: fadeInUp 1s ease-out;
}

.hero-description {
  font-size: 6.5rem;
  font-weight: 300;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  animation: fadeInUp 1s ease-out 0.3s both;
}

.hero-controls {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hero-section:hover .hero-controls {
  opacity: 1;
}

.hero-prev,
.hero-next {
  background: transparent;
  border: none;
  color: white;
  font-size: 8rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.hero-prev:hover,
.hero-next:hover {
  background: rgba(255,255,255,0.3);
  transform: scale(1.1);
}

.hero-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.hero-indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-indicators span.active {
  background: white;
  transform: scale(1.2);
}

/* 滚动指示器样式 */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 30px;
  color: white;
  opacity: 0.8;
  transition: all 0.3s ease;
  z-index: 10;
  cursor: pointer;
}

.scroll-indicator:hover {
  opacity: 1;
}

.scroll-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

/* 左上角品牌logo样式 */
.top-brand {
  position: fixed;
  top: 30px;
  left: 30px;
  z-index: 1000;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.top-brand.hidden {
  transform: translateY(-100px);
}

.brand-description {
  color: #a0a0a1;
  font-size: 14px;
  margin-top: 8px;
  margin-left: 60px;
  opacity: 0.8;
}

/* 右上角操作按钮样式 */
.top-actions {
  position: fixed;
  top: 30px;
  right: 30px;
  display: flex;
  gap: 15px;
  z-index: 1000;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.top-actions.hidden {
  transform: translateY(-100px);
}

/* 分类导航区域样式 */
.categories-nav-section {
  background: linear-gradient(180deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.98) 100%);
  backdrop-filter: blur(20px);
  border: none;
  padding: 10px 0;
  margin: 0;
  margin-top: -1px;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
}

.brand-content {
  display: flex;
  flex-direction: column;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
}

.brand-link:hover {
  transform: scale(1.05);
}

.site-logo {
  width: 45px;
  height: 45px;
  margin-right: 15px;
  border-radius: 6px;
  flex-shrink: 0;
}

.site-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  padding: 0;
}

.categories-container {
  display: flex;
  justify-content: center;
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
  transition: transform 0.3s ease;
}

.categories-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 10px 0;
  scrollbar-width: none;
  justify-content: center;
  flex-wrap: nowrap;
  transition: opacity 0.3s ease;
}

.categories-scroll::-webkit-scrollbar {
  display: none;
}

.categories-scroll::-webkit-scrollbar-track {
  display: none;
}

.categories-scroll::-webkit-scrollbar-thumb {
  display: none;
}

.categories-scroll::-webkit-scrollbar-thumb:hover {
  display: none;
}

.category-item {
  display: inline-block;
  padding: 4px 12px;
  color: #d0d0d0;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.2px;
  white-space: nowrap;
  flex-shrink: 0;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.category-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: left 0.6s ease;
}

.category-item:hover::before {
  left: 100%;
}

.category-item:hover {
  border-color: transparent;
  color: white;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.category-item.active {
  border-color: transparent;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

.action-btn {
  background: rgba(10,10,10,0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  color: #e0e0e0;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.action-btn:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.4);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

/* 关于弹窗样式 */
.about-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  backdrop-filter: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.about-content {
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  position: relative;
  animation: slideUp 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: #e0e0e0;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.about-content h2 {
  color: white;
  margin: 0 0 20px 0;
  font-size: 24px;
  text-align: center;
}

.about-info p {
  color: #d0d0d0;
  margin: 10px 0;
  line-height: 1.6;
  text-align: center;
}

/* 关于模态框快捷入口样式 */
.about-shortcuts {
  margin-top: 30px;
  text-align: center;
}

.about-shortcuts h3 {
  color: white;
  margin: 0 0 15px 0;
  font-size: 18px;
}

.about-shortcuts-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
}

.about-shortcut {
  display: inline-block;
}

.about-shortcut a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #d0d0d0;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 14px;
}

.about-shortcut a:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
  transform: translateY(-2px);
}

.about-shortcut-label {
  white-space: nowrap;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 相册区域样式 */
.gallery-section {
  padding: 10px 0;
  width: 100%;
  margin: 0;
  background: #000000;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 10.5rem;
  }
  
  .hero-description {
    font-size: 6rem;
  }
  
  .top-brand {
    top: 20px;
    left: 20px;
  }
  
  .top-actions {
    top: 20px;
    right: 20px;
    gap: 10px;
  }
  
  .action-btn {
    padding: 6px 14px;
    font-size: 15px;
  }
  
  .categories-nav-section {
    padding: 15px 0;
  }
  
  .site-logo {
    width: 35px;
    height: 35px;
    margin-right: 15px;
  }
  
  .site-name {
    font-size: 16px;
  }
  
  .categories-container {
    padding: 0 15px;
  }
  
  .category-item {
    padding: 6px 12px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 7.5rem;
  }
  
  .hero-description {
    font-size: 4.5rem;
  }
  
  .top-brand {
    top: 15px;
    left: 15px;
  }
  
  .top-actions {
    top: 15px;
    right: 15px;
    gap: 8px;
  }
  
  .action-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .categories-nav-section {
    padding: 10px 0;
  }
  
  .site-logo {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  
  .site-name {
    font-size: 11px;
  }
  
  .categories-container {
    padding: 0 10px;
  }
  
  .category-item {
    padding: 5px 10px;
    font-size: 10px;
  }
  
  .about-content {
    padding: 30px 20px;
    margin: 20px;
  }
  
  .about-content h2 {
    font-size: 20px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .hero-controls {
    padding: 0 15px;
  }
  
  .hero-prev,
  .hero-next {
    width: 45px;
    height: 45px;
    font-size: 1.5rem;
  }
}



/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: transparent;
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* 选择文本样式 */
::selection {
  background: rgba(255,255,255,0.2);
  color: white;
}

/* 链接样式 */
a {
  color: #e0e0e0;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: white;
}

/* 标题样式 */
h1, h2, h3, h4, h5, h6 {
  color: white;
  margin: 0;
  line-height: 1.2;
}

strong, b {
  color: white;
  font-weight: 600;
}

h5 {
  font-size: 0.9em;
}

h6 {
  font-size: 0.7em;
}

@media screen and (max-width: 736px) {
  h2 {
    font-size: 1em;
  }

  h3 {
    font-size: 0.9em;
  }

  h4 {
    font-size: 0.8em;
  }

  h5 {
    font-size: 0.7em;
  }

  h6 {
    font-size: 0.7em;
  }
}

body.is-preload #wrapper:before {
  transition: opacity 1s ease-out !important;
  transition-delay: 0.5s !important;
  opacity: 0.25;
  top: 50%;
  visibility: visible;
}

/* 回到顶部按钮样式 */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.back-to-top:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
}

.back-to-top svg {
  transition: transform 0.3s ease;
}

.back-to-top:hover svg {
  transform: translateY(-1px);
}

@media screen and (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
}
</style>