<template>
  <div class="home-container">
    <!-- 首次访问提示弹窗 -->
    <div v-if="showFirstVisitModal" class="first-visit-modal">
      <div class="modal-backdrop" @click="closeFirstVisitModal"></div>
      <div class="modal-content">
        <div class="modal-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12a9 9 0 11-6.219-8.56" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="modal-title">首次载入页面，请等待加载缓存</h3>
        <div class="modal-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    </div>

    <!-- 页面加载状态 -->
    <div v-if="isPageLoading" class="page-loading">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-text">正在加载页面...</p>
        <div class="loading-progress">
          <div class="loading-progress-bar">
            <div class="loading-progress-fill"></div>
          </div>
          <div class="loading-tips">请稍候，正在为您准备精彩内容</div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div v-show="!isPageLoading" class="main-content">
      <!-- 封面轮播图区域 -->
      <div class="hero-section">
        <div class="hero-carousel">
          <div
            v-for="(slide, index) in heroSlides"
            :key="index"
            class="hero-slide"
            :class="{ active: currentSlide === index }"
          >
            <img :src="slide.image" :alt="slide.title" class="hero-image" />
            <div class="hero-overlay">
              <div class="hero-content">
                <h1 class="hero-title">{{ slide.title }}</h1>
                <p class="hero-description">{{ slide.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="heroSettings.showControls" class="hero-controls">
          <button class="hero-prev" @click="prevSlide">‹</button>
          <button class="hero-next" @click="nextSlide">›</button>
        </div>
        <div v-if="heroSettings.showIndicators" class="hero-indicators">
          <span
            v-for="(slide, index) in heroSlides"
            :key="index"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></span>
        </div>
        <!-- 向下滑动指示箭头 -->
        <div v-show="showScrollIndicator" class="scroll-indicator" @click="scrollToGallery">
          <div class="scroll-arrow">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- 左上角品牌logo -->
      <div class="top-brand" :class="{ hidden: isNavHidden }">
        <div class="brand-content">
          <router-link :to="'/'" class="brand-link">
            <img class="site-logo" :src="bottom_icon" alt="Logo" />
            <h2 class="site-name">{{ site_name }}</h2>
          </router-link>
          <div v-if="bottom_desc" class="brand-description">{{ bottom_desc }}</div>
        </div>
      </div>

      <!-- 右上角操作按钮 -->
      <div class="top-actions" :class="{ hidden: isNavHidden }">
        <button class="action-btn" @click="toggleFullScreen">{{ fullScreenText }}</button>
        <button class="action-btn" @click="showAboutModal">关于</button>
        <button class="action-btn" @click="goToAdmin">后台</button>
      </div>

      <!-- 分类导航 -->
      <div class="categories-nav-section">
        <div class="categories-container">
          <div class="categories-scroll">
            <div
              class="category-item"
              :class="{ active: currentCategory === null }"
              @click="handleCategoryClick(null)"
            >
              全部
            </div>
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-item"
              :class="{ active: currentCategory === category.alias }"
              @click="handleCategoryClick(category.alias)"
              @mouseenter="handleCategoryHover(category.alias)"
            >
              {{ category.name }}
            </div>
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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 14L12 9L7 14"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from './components/Footer.vue'
import Main from './components/Main.vue'
import TheIcon from '@/components/icon/TheIcon.vue'
import { useSettingStore } from '@/store'
import api from '@/api'
import { isValueNotEmpty } from '@/utils'

const router = useRouter()
const settingStore = useSettingStore()
const categories = ref([])
const heroSlides = ref([])
const currentSlide = ref(0)
const fullScreenText = ref('全屏')
const isPageLoading = ref(true)
const showFirstVisitModal = ref(false)
let slideInterval = null

// 当前选中的分类
const currentCategory = ref(router.currentRoute.value.params.category || null)

// 检测是否为首次访问
const checkFirstVisit = () => {
  // 检查localStorage中是否有访问记录
  const hasVisited = localStorage.getItem('memory_visited')
  // 检查是否有任何cookie
  const hasCookies = document.cookie.length > 0
  
  // 如果没有访问记录且没有cookie，则显示首次访问提示
  if (!hasVisited && !hasCookies) {
    showFirstVisitModal.value = true
    // 3秒后自动关闭
    setTimeout(() => {
      closeFirstVisitModal()
    }, 3000)
  }
}

// 关闭首次访问弹窗
const closeFirstVisitModal = () => {
  showFirstVisitModal.value = false
  // 设置访问记录
  localStorage.setItem('memory_visited', 'true')
}

// 预加载分类图片
const preloadCategoryImages = (category) => {
  const params = {
    page: 1,
    page_size: 6, // 预加载前6张
    category: category,
    location: router.currentRoute.value.params.location || null
  }
  
  // 静默预加载分类的前几张图片
  api.getBlogsVisitor(params).then(res => {
    if (res.code === 200 && res.data.length > 0) {
      // 预加载前6张图片的缩略图
      res.data.forEach(blog => {
        if (blog.images && blog.images.length > 0) {
          const img = new Image()
          img.src = blog.images[0].thumbnail || blog.images[0].image_url
        }
      })
      console.log(`预加载分类 ${category} 的前${res.data.length}张图片`)
    }
  }).catch(e => {
    console.log('预加载分类图片失败:', e)
  })
}

// 分类预加载缓存
const categoryPreloadCache = new Set()

// 分类悬停预加载
const handleCategoryHover = (categoryAlias = null) => {
  // 如果不是当前分类且未预加载过，则开始预加载
  if (categoryAlias !== currentCategory.value && !categoryPreloadCache.has(categoryAlias)) {
    categoryPreloadCache.add(categoryAlias)
    preloadCategoryImages(categoryAlias)
  }
}

// 分类切换处理函数
const handleCategoryClick = (categoryAlias = null) => {
  // 如果不是当前分类，预加载该分类的图片（如果还没预加载）
  if (categoryAlias !== currentCategory.value && !categoryPreloadCache.has(categoryAlias)) {
    preloadCategoryImages(categoryAlias)
  }
  
  // 使用路由导航到对应的分类页面
  if (categoryAlias) {
    router.push(`/category/${categoryAlias}`)
  } else {
    router.push('/')
  }
  
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
  return isValueNotEmpty(settingStore.metaSetting?.site_name)
    ? settingStore.metaSetting?.site_name
    : import.meta.env.VITE_TITLE
})
const site_desc = computed(() => {
  return isValueNotEmpty(settingStore.metaSetting?.site_desc)
    ? settingStore.metaSetting?.site_desc
    : import.meta.env.VITE_DESC
})
const bottom_icon = computed(() => {
  return isValueNotEmpty(settingStore.metaSetting?.bottom_icon)
    ? settingStore.metaSetting?.bottom_icon
    : import.meta.env.VITE_ICON
})
const bottom_desc = computed(() => {
  return isValueNotEmpty(settingStore.metaSetting?.bottom_desc)
    ? settingStore.metaSetting?.bottom_desc
    : ''
})
const entries = computed(() => {
  const rawEntries = isValueNotEmpty(settingStore.metaSetting?.entries)
    ? settingStore.metaSetting?.entries
    : []
  return rawEntries.filter(
    (entry) =>
      entry && entry.name && entry.name.trim() !== '' && entry.url && entry.url.trim() !== ''
  )
})
const site_url = computed(() => {
  return isValueNotEmpty(settingStore.metaSetting?.site_url)
    ? settingStore.metaSetting?.site_url
    : window.location.origin
})
const primary_color = computed(() => {
  return isValueNotEmpty(settingStore.metaSetting?.primary_color)
    ? settingStore.metaSetting?.primary_color
    : import.meta.env.VITE_PRIMARY_COLOR
})
const site_splitter = computed(() => {
  return isValueNotEmpty(settingStore.metaSetting?.site_splitter)
    ? settingStore.metaSetting?.site_splitter
    : import.meta.env.VITE_TITLE_SPLITTER
})

// 轮播图控制
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
}

const prevSlide = () => {
  currentSlide.value =
    currentSlide.value === 0 ? heroSlides.value.length - 1 : currentSlide.value - 1
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
const isFullScreen = async () => {
  // 检查是否在Tauri环境中
  if (window.__TAURI__) {
    try {
      const { invoke } = window.__TAURI__.core
      return await invoke('is_fullscreen')
    } catch (error) {
      console.error('Failed to check fullscreen status:', error)
      return false
    }
  } else {
    // 浏览器环境
    return document.fullScreen || document.fullscreenElement !== null
  }
}

const toggleFullScreen = async () => {
  // 检查是否在Tauri环境中
  if (window.__TAURI__) {
    try {
      const { invoke } = window.__TAURI__.core
      await invoke('toggle_fullscreen')
      const isFullscreenNow = await isFullScreen()
      fullScreenText.value = isFullscreenNow ? '退出全屏' : '全屏'
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error)
    }
  } else {
    // 浏览器环境
    const currentlyFullscreen = await isFullScreen()
    if (currentlyFullscreen) {
      document.exitFullscreen()
      fullScreenText.value = '全屏'
    } else {
      document.documentElement.requestFullscreen()
      fullScreenText.value = '退出全屏'
    }
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

// 跳转到后台
const goToAdmin = () => {
  router.push('/admin/workbench')
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
    behavior: 'smooth',
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
  showControls: true,
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
      showControls: metaSetting.hero_show_controls ?? true,
    }

    if (metaSetting.hero_images && metaSetting.hero_images.length > 0) {
      heroSlides.value = metaSetting.hero_images.map((item) => ({
        image: item.url,
        title: item.title,
        description: item.description,
      }))
    } else {
      // 默认封面图
      heroSlides.value = [
        {
          image: '/assets/Cover/1.jpg',
          title: '欢迎来到时光工作室',
          description: '记录生活中的美好瞬间',
        },
        {
          image: '/assets/Cover/2.jpg',
          title: '摄影作品集',
          description: '用镜头捕捉世界的精彩',
        },
        {
          image: '/assets/Cover/3.jpg',
          title: '创意无限',
          description: '探索视觉艺术的无限可能',
        },
        {
          image: '/assets/Cover/4.jpg',
          title: '精彩瞬间',
          description: '捕捉生活中的每一个精彩时刻',
        },
        {
          image: '/assets/Cover/5.jpg',
          title: '美好回忆',
          description: '珍藏那些值得纪念的美好时光',
        },
      ]
    }
  } catch (error) {
    console.error('Failed to load hero slides:', error)
    // 使用默认封面图
    heroSlides.value = [
      {
        image: '/assets/Cover/1.jpg',
        title: '欢迎来到时光工作室',
        description: '记录生活中的美好瞬间',
      },
      {
        image: '/assets/Cover/2.jpg',
        title: '摄影作品集',
        description: '用镜头捕捉世界的精彩',
      },
      {
        image: '/assets/Cover/3.jpg',
        title: '创意无限',
        description: '探索视觉艺术的无限可能',
      },
      {
        image: '/assets/Cover/4.jpg',
        title: '精彩瞬间',
        description: '捕捉生活中的每一个精彩时刻',
      },
      {
        image: '/assets/Cover/5.jpg',
        title: '美好回忆',
        description: '珍藏那些值得纪念的美好时光',
      },
    ]
  }
}

// 监听路由变化
watch(
  () => router.currentRoute.value.params.category,
  (newCategory) => {
    currentCategory.value = newCategory || null
  }
)

onMounted(async () => {
  try {
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
  } finally {
    // 数据加载完成，隐藏loading - 增加loading显示时间让用户能看到效果
    setTimeout(() => {
      isPageLoading.value = false
      // 检测首次访问（在页面加载完成后）
      setTimeout(() => {
        checkFirstVisit()
      }, 500)
    }, 800) // 调整为0.8秒，既能看到loading效果又不会过长
  }
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
  background: #000000;
  color: #e0e0e0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
}

.home-container {
  min-height: 100vh;
  background: #000000;
  padding-top: 0;
  position: relative;
}

/* 首次访问弹窗样式 */
.first-visit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal-content {
  position: relative;
  background: linear-gradient(145deg, rgba(30, 30, 35, 0.98), rgba(20, 20, 25, 0.95));
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 48px 40px;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 
              0 0 0 1px rgba(255, 255, 255, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  max-width: 420px;
  width: 90%;
  animation: modalSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.modal-icon {
  margin-bottom: 24px;
  color: #4fc3f7;
  animation: iconSpin 1.5s linear infinite;
  filter: drop-shadow(0 0 8px rgba(79, 195, 247, 0.4));
}

.modal-title {
  color: #ffffff;
  font-size: 19px;
  font-weight: 600;
  margin: 0 0 28px 0;
  line-height: 1.4;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.modal-progress {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4fc3f7, #29b6f6, #03a9f4);
  border-radius: 3px;
  animation: progressAnimation 3s ease-out;
  box-shadow: 0 0 12px rgba(79, 195, 247, 0.6),
              0 0 24px rgba(79, 195, 247, 0.3);
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: progressShimmer 1.5s ease-in-out infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes iconSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes progressAnimation {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

@keyframes progressShimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.loading-spinner::before {
  margin: -37.5px 0 0 -37.5px;
}

.loading-spinner::after {
  width: 90px;
  height: 90px;
  margin: -45px 0 0 -45px;
}

/* 页面加载样式 */
.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(10, 10, 15, 0.9) 50%, rgba(0, 0, 0, 0.85) 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  animation: pageLoadingFadeIn 0.5s ease-out;
}

.loading-spinner {
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
  position: relative;
}

.loading-spinner::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90px;
  height: 90px;
  margin: -45px 0 0 -45px;
  border: 1px solid rgba(255, 107, 53, 0.1);
  border-radius: 50%;
  animation: pulseRing 2s ease-in-out infinite;
}

.loading-spinner::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110px;
  height: 110px;
  margin: -55px 0 0 -55px;
  border: 1px solid rgba(255, 165, 0, 0.08);
  border-radius: 50%;
  animation: pulseRing 2s ease-in-out infinite 0.5s;
}

.spinner {
  width: 60px;
  height: 60px;
  position: relative;
  margin: 0 auto 35px;
  filter: drop-shadow(0 0 20px rgba(255, 107, 53, 0.3));
}

.spinner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top: 4px solid #ff6b35;
  border-right: 4px solid #ff6b35;
  border-radius: 50%;
  animation: spinPrimary 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
  box-shadow: 0 0 15px rgba(255, 107, 53, 0.4), inset 0 0 15px rgba(255, 107, 53, 0.2);
}

.spinner::after {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  border: 3px solid transparent;
  border-bottom: 3px solid #ffa500;
  border-left: 3px solid #ffa500;
  border-radius: 50%;
  animation: spinSecondary 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
  box-shadow: 0 0 12px rgba(255, 165, 0, 0.4), inset 0 0 12px rgba(255, 165, 0, 0.2);
}

.loading-text {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  opacity: 0.95;
  animation: textPulse 2.5s ease-in-out infinite;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
  background: linear-gradient(45deg, #ffffff, #f0f0f0, #ffffff);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: textPulse 2.5s ease-in-out infinite, textShimmer 3s ease-in-out infinite;
}

.loading-progress {
  margin-top: 30px;
  width: 280px;
  text-align: center;
}

.loading-progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
}

.loading-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b35, #ffa500, #ff6b35);
  background-size: 200% 100%;
  border-radius: 2px;
  animation: progressFlow 2s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(255, 107, 53, 0.5);
}

.loading-tips {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  opacity: 0.8;
  animation: tipsFade 3s ease-in-out infinite;
  letter-spacing: 0.3px;
}

@keyframes spinPrimary {
  0% {
    transform: rotate(0deg);
    border-top-color: #ff6b35;
    border-right-color: #ff6b35;
  }
  25% {
    border-top-color: #ffa500;
    border-right-color: #ff6b35;
  }
  50% {
    transform: rotate(180deg);
    border-top-color: #ffa500;
    border-right-color: #ffa500;
  }
  75% {
    border-top-color: #ff6b35;
    border-right-color: #ffa500;
  }
  100% {
    transform: rotate(360deg);
    border-top-color: #ff6b35;
    border-right-color: #ff6b35;
  }
}

@keyframes spinSecondary {
  0% {
    transform: rotate(0deg);
    border-bottom-color: #ffa500;
    border-left-color: #ffa500;
  }
  25% {
    border-bottom-color: #ff6b35;
    border-left-color: #ffa500;
  }
  50% {
    transform: rotate(-180deg);
    border-bottom-color: #ff6b35;
    border-left-color: #ff6b35;
  }
  75% {
    border-bottom-color: #ffa500;
    border-left-color: #ff6b35;
  }
  100% {
    transform: rotate(-360deg);
    border-bottom-color: #ffa500;
    border-left-color: #ffa500;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes textPulse {
  0%, 100% {
    opacity: 0.95;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.03);
  }
}

@keyframes textShimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes pageLoadingFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
}

@keyframes pulseRing {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
  100% {
    transform: scale(0.8);
    opacity: 1;
  }
}

@keyframes progressFlow {
  0% {
    background-position: 0% 50%;
    width: 0%;
  }
  50% {
    background-position: 100% 50%;
    width: 70%;
  }
  100% {
    background-position: 0% 50%;
    width: 100%;
  }
}

@keyframes tipsFade {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.5;
  }
}

.main-content {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
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
  /* 手机端优化 */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* 手机端封面优化 */
@media screen and (max-width: 768px) {
  .hero-section {
    height: 60vh; /* 减少手机端封面高度 */
  }
  
  .hero-image {
    object-position: center 30%; /* 优化手机端显示位置 */
    transform: scale(1.1); /* 轻微放大避免黑边 */
  }
  
  .hero-title {
    font-size: 320px; /* 手机端标题字体大小放大10倍 */
    margin-bottom: 0.8rem;
  }
  
  .hero-description {
    font-size: 240px; /* 手机端副标题字体大小放大10倍 */
  }
  
  .hero-prev,
  .hero-next {
    font-size: 80rem; /* 手机端按钮放大10倍 */
    width: 400px;
    height: 400px;
    background: transparent !important; /* 确保无背景 */
  }
  
  .hero-prev:hover,
  .hero-next:hover {
    background: transparent !important; /* 悬停时也无背景 */
    transform: scale(1.1);
  }
}



.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.2) 60%,
    rgba(10, 10, 10, 0.95) 100%
  );
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
  font-size: 8.5rem; /* 桌面端封面标题字体大小 */
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  animation: fadeInUp 1s ease-out;
}

.hero-description {
  font-size: 6.5rem; /* 桌面端封面副标题字体大小 */
  font-weight: 300;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
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
  background: rgba(255, 255, 255, 0.3);
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
  background: rgba(255, 255, 255, 0.4);
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
  0%,
  20%,
  50%,
  80%,
  100% {
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
  background: linear-gradient(180deg, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%);
  backdrop-filter: blur(20px);
  border: none;
  padding: 3px 0;
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.category-item:hover::before {
  left: 100%;
}

.category-item:hover {
  border-color: transparent;
  color: white;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.category-item.active {
  border-color: transparent;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.action-btn {
  background: transparent;
  backdrop-filter: none;
  border: 1px solid transparent;
  color: #e0e0e0;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.action-btn:hover,
.action-btn:focus,
.action-btn:active {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
    padding: 2px 0;
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
  background: rgba(255, 255, 255, 0.2);
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
h1,
h2,
h3,
h4,
h5,
h6 {
  color: white;
  margin: 0;
  line-height: 1.2;
}

strong,
b {
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
