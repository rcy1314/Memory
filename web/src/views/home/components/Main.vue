<template>
  <div id="blog-main" ref="listRef" :class="{ loading: isLoading }">
    <!-- 普通加载状态 -->
    <div v-if="isLoading && !isFirstLoad" class="gallery-loading-message">
      <div class="loading-content">
        <div class="loading-spinner-main"></div>
        <div class="loading-text">图片请稍后</div>
      </div>
    </div>
    
    <!-- 首次加载弹窗状态 -->
    <div v-if="isLoading && isFirstLoad" class="loading-modal-overlay">
      <div class="loading-modal">
        <div class="loading-content">
          <div class="loading-spinner-main"></div>
          <div class="loading-text">正在为您加载缓存，请稍后</div>
          <div class="loading-progress-container">
            <div class="loading-progress-bar">
              <div class="loading-progress-fill" :style="{ width: loadingProgress + '%' }"></div>
            </div>
            <div class="loading-progress-text">{{ loadingProgress }}%</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图片显示区域 -->
    <div class="gallery-container" :class="{ 'loading-state': isLoading || isImagesLoading }">
      <!-- 图片网格 -->
      <transition-group v-if="blogs.length > 0" name="fade-slide" tag="div" class="images-container" :class="{ 'images-loading': isLoading || isImagesLoading }">
        <ImageOptimized v-for="blog in blogs" :key="blog.id" :data="blog" @click="showImage(blog)" @image-loaded="onImageLoaded" />
      </transition-group>
      
      <!-- 图片展示区域加载遮罩 -->
      <div v-if="isLoading || isImagesLoading" class="gallery-loading-overlay">
        <div class="gallery-loading-content">
          <div class="gallery-loading-spinner"></div>
          <div class="gallery-loading-text">
            <span v-if="isLoading">{{ page === 1 ? '正在加载图片...' : `正在加载第 ${page} 页...` }}</span>
            <span v-else-if="isImagesLoading">图片加载中 {{ loadedImageCount }}/{{ totalImageCount }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 分页导航 -->
    <div v-if="total > 0 && !isLoading" class="pagination-container">
      <div class="pagination-info">
        <span>第 {{ page }} 页，共 {{ Math.ceil(total / page_size) }} 页</span>
        <span class="total-count">（共 {{ total }} 张图片）</span>
      </div>
      <div class="pagination-buttons">
        <button 
          @click="goToPrevPage" 
          :disabled="page <= 1 || isLoading" 
          class="pagination-button prev-button"
          :class="{ disabled: page <= 1 || isLoading }"
        >
          <div v-if="isLoading" class="button-loading-spinner"></div>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ isLoading ? '加载中...' : '上一页' }}
        </button>
        <button 
          @click="goToNextPage" 
          :disabled="page >= Math.ceil(total / page_size) || isLoading" 
          class="pagination-button next-button"
          :class="{ disabled: page >= Math.ceil(total / page_size) || isLoading }"
        >
          {{ isLoading ? '加载中...' : '下一页' }}
          <div v-if="isLoading" class="button-loading-spinner"></div>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 已加载完成提示 -->
    <!-- 底部加载状态 -->
    <div v-if="isLoading && blogs.length > 0" class="bottom-loading-indicator">
      <div class="bottom-loading-content">
        <div class="loading-spinner-small"></div>
        <span class="loading-text">正在加载第 {{ page }} 页...</span>
      </div>
    </div>
    
    <!-- 加载完成指示器 -->
    <div v-if="page * page_size >= total && total > 0 && !isLoading" class="load-complete-indicator">
      <span>已加载所有图片</span>
    </div>
    <VueFinalModal
      v-model="show"
      content-class="lightbox"
      :overlay-transition="'vfm-fade'"
      :content-transition="'vfm-fade'"
      @before-close="close"
      @click-outside="close"
    >
      <div
        class="lightbox-content"
        :style="{
          width: currentSize.width + 'px',
          height: currentSize.height + 'px',
          transition: 'width 1s ease-in-out, height 1s ease-in-out',
          overflow: 'hidden',
          transformOrigin: 'center center',
        }"
        @transitionend="onTransitionEnd"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div v-if="!imageVisible" class="lightbox-loading-container" @click="close">
          <div class="lightbox-spinner"></div>
          <div class="lightbox-loading-text">加载中，请稍后</div>
          <div class="loading-close-hint">点击此处关闭</div>
        </div>
        <transition name="fade" mode="out-in">
          <div class="pic" style="display: block; text-indent: 0px">
            <img
              :key="imageSrc"
              :src="imageSrc"
              alt=""
              :style="['vertical-align: bottom;', imageVisible ? '' : 'display: none;']"
              class="img"
              @load="onImageLoad"
              @error="onImageError"
              @click.stop
            />
          </div>
        </transition>
        <div v-if="imageVisible" class="caption" style="display: flex">
          <h2 class="thumb-title">{{ currentBlog.current_title }}</h2>
          <p class="thumb-desc">{{ currentBlog.current_desc }}</p>
          <ul class="tag-meta">
            <router-link
              v-if="detail_show_location && isValueNotEmpty(currentBlog.current_location)"
                            class="tag-location detail-tag"
              :to="'/location/' + currentBlog.current_location"
            >
              <i class="iconfont icon-map-pin-2-line"></i>
              {{ currentBlog.current_full_location }}
            </router-link>
            <a
              v-if="detail_show_time && isValueNotEmpty(currentBlog.current_metadata)"
              class="tag-time detail-tag"
            >
              {{ currentBlog.current_metadata }}
            </a>
            <a
              v-if="detail_show_time && isValueNotEmpty(currentBlog.current_detail_time)"
              class="tag-time detail-tag"
            >
              {{ currentBlog.current_detail_time }}
            </a>
          </ul>
          <ul class="tags">
            <li class="tag-categories">
              <router-link
                v-for="category in currentBlog.categories"
                :key="category.alias"
                :to="'/category/' + category.alias"
                >{{ category.name }}</router-link
              >
            </li>
          </ul>
          <div v-if="currentBlog.images.length > 1" class="breadcrumb-nav">
            <span
              v-for="(item, index) in currentBlog.images"
              :key="index"
              class="nav-dot"
              :class="{ 'active': currentBlog.currentIndex === index }"
              :data-index="index"
              @mouseenter="(e) => handleSwipe(currentBlog, e)"
            ></span>
          </div>
        </div>
        <span class="closer" style="cursor: pointer; display: block" @click="close">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
        <div class="nav-previous" style="display: block" @click.stop="prev">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </div>
        <div class="nav-next" style="display: block" @click.stop="next">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </div>
        <div v-if="imageVisible" class="download-button" @click="downloadImage" title="下载图片">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
      </div>
    </VueFinalModal>
  </div>
</template>

<script setup>
import { throttle } from 'lodash'
import ImageOptimized from './ImageOptimized.vue'
import { useSettingStore } from '@/store'
import api from '@/api'
import { isValueNotEmpty, isValueEmpty, scrollToload, parseDateTime, formatDateTime } from '@/utils'
import { useRouter } from 'vue-router'
import { VueFinalModal } from 'vue-final-modal'

// 接收父组件传递的当前分类
const props = defineProps({
  currentCategory: {
    type: String,
    default: null,
  },
})

const router = useRouter()
var current_category = props.currentCategory
var current_location = router.currentRoute.value.params.location
const blogs = ref([])
const listRef = ref(null)
const isLoading = ref(true)
// 简化加载状态管理
const isFirstLoad = ref(false) // 移除复杂的首次加载判断
const loadedImageCount = ref(0) // 已加载图片数量
const totalImageCount = ref(0) // 总图片数量
const isImagesLoading = ref(false) // 图片是否正在加载
const currentBlog = ref(null)
const currentSize = ref({
  width: Math.min(400, window.innerWidth - 40),
  height: Math.min(300, window.innerHeight - 40),
})

const show = ref(false)
const imageVisible = ref(false)
const imageSrc = ref('')
const imageTransitioning = ref(false)
const nextImageUrl = ref('')
const preloadedImages = ref(new Map()) // 预加载的图片缓存
const imageLoadingPromises = ref(new Map()) // 正在加载的图片Promise缓存

// 触摸滑动相关变量
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const minSwipeDistance = 50 // 最小滑动距离

var page = 1
var total = 0
const settingStore = useSettingStore()
const baseTitle = isValueNotEmpty(settingStore.metaSetting?.site_name)
  ? settingStore.metaSetting?.site_name
  : import.meta.env.VITE_TITLE
const splitter = isValueNotEmpty(settingStore.metaSetting?.site_splitter)
  ? settingStore.metaSetting?.site_splitter
  : import.meta.env.VITE_TITLE_SPLITTER
const page_size = isValueNotEmpty(settingStore.contentSetting?.page_size)
  ? parseInt(settingStore.contentSetting?.page_size)
  : parseInt(import.meta.env.VITE_PAGE_SIZE)
var thumbnail_suffix = isValueNotEmpty(settingStore.contentSetting?.thumbnail_suffix)
  ? settingStore.contentSetting?.thumbnail_suffix
  : ''
var detail_suffix = isValueNotEmpty(settingStore.contentSetting?.detail_suffix)
  ? settingStore.contentSetting?.detail_suffix
  : ''
var detail_show_location = isValueNotEmpty(settingStore.contentSetting.detail_show_location)
  ? settingStore.contentSetting.detail_show_location
  : true
var thumbnail_time_format =
  settingStore.contentSetting.thumbnail_time_format &&
  settingStore.contentSetting.thumbnail_time_format != ''
    ? settingStore.contentSetting.thumbnail_time_format
    : 'YYYY年M月D日'
var detail_show_time = isValueNotEmpty(settingStore.contentSetting.detail_show_time)
  ? settingStore.contentSetting.detail_show_time
  : true
var detail_time_format =
  settingStore.contentSetting.detail_time_format &&
  settingStore.contentSetting.detail_time_format != ''
    ? settingStore.contentSetting.detail_time_format
    : 'YYYY-MM-DD HH:mm'

function updateAttr(blog) {
  // 安全检查：确保images数组存在且不为空
  if (!blog.images || blog.images.length === 0) {
    console.warn('Blog images array is empty or undefined:', blog)
    return
  }
  
  // 安全检查：确保currentIndex在有效范围内
  if (blog.currentIndex < 0 || blog.currentIndex >= blog.images.length) {
    console.warn('Invalid currentIndex:', blog.currentIndex, 'for blog:', blog)
    blog.currentIndex = 0
  }
  
  const currentImage = blog.images[blog.currentIndex]
  if (!currentImage) {
    console.warn('Current image is undefined at index:', blog.currentIndex, 'for blog:', blog)
    return
  }
  
  blog.current_thumbnail = blog.images[0].thumbnail
  blog.current_detail = currentImage.detail
  blog.current_desc = currentImage.desc || blog.desc
  blog.current_title = currentImage.title || blog.title
  blog.current_detail_time = currentImage.detail_time || blog.detail_time
  blog.current_location = currentImage.location || blog.location
  blog.current_metadata = currentImage.metadata
  if (isValueNotEmpty(blog.location)) {
    if (isValueNotEmpty(currentImage.location)) {
      blog.current_full_location = `${blog.location} - ${currentImage.location}`
    } else {
      blog.current_full_location = blog.location
    }
  } else {
    if (isValueNotEmpty(currentImage.location)) {
      blog.current_full_location = currentImage.location
    } else {
      blog.current_full_location = null
    }
  }
}

function handleResize() {
  throttle(() => {
    if (currentBlog.value == null) return
    showImage(currentBlog.value)
  }, 300)()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)

  // 页面加载后开始预加载前几张图片
  nextTick(() => {
    setTimeout(() => {
      if (blogs.value.length > 0) {
        // 只预加载前3张图片，减少初始加载压力
        for (let i = 0; i < Math.min(3, blogs.value.length); i++) {
          preloadImage(blogs.value[i].current_detail)
        }
      }
    }, 200) // 减少延迟时间，但仍避免影响页面初始加载
  })
})

function handleSwipe(blog, event) {
  const index = Number(event.target.dataset.index)
  if (!isNaN(index)) {
    blog.currentIndex = index
    updateAttr(blog)
    showImage(blog)
  }
}
function close() {
  show.value = false
  imageVisible.value = false
  imageTransitioning.value = false
  currentBlog.value = null
  currentSize.value = {
    width: Math.min(400, window.innerWidth - 40),
    height: Math.min(300, window.innerHeight - 40),
  }
  imageSrc.value = ''
  nextImageUrl.value = ''
}
function prev() {
  // 如果当前博客是合集且不在第一张图片，则在合集内导航
  if (currentBlog.value.images && currentBlog.value.images.length > 1 && currentBlog.value.currentIndex > 0) {
    currentBlog.value.currentIndex--
    updateAttr(currentBlog.value)
    showImage(currentBlog.value)
  } else {
    // 否则导航到上一个博客
    const index = blogs.value.findIndex((b) => b.id === currentBlog.value.id)
    if (index > 0) {
      showImage(blogs.value[index - 1])
    }
  }
}

function next() {
  // 如果当前博客是合集且不在最后一张图片，则在合集内导航
  if (currentBlog.value.images && currentBlog.value.images.length > 1 && currentBlog.value.currentIndex < currentBlog.value.images.length - 1) {
    currentBlog.value.currentIndex++
    updateAttr(currentBlog.value)
    showImage(currentBlog.value)
  } else {
    // 否则导航到下一个博客
    const index = blogs.value.findIndex((b) => b.id === currentBlog.value.id)
    if (index < blogs.value.length - 1) {
      showImage(blogs.value[index + 1])
    }
  }
}

// 触摸事件处理函数
function onTouchStart(event) {
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
}

function onTouchMove(event) {
  // 阻止默认滚动行为
  event.preventDefault()
}

function onTouchEnd(event) {
  touchEndX.value = event.changedTouches[0].clientX
  touchEndY.value = event.changedTouches[0].clientY
  
  const deltaX = touchEndX.value - touchStartX.value
  const deltaY = touchEndY.value - touchStartY.value
  
  // 确保是水平滑动（水平距离大于垂直距离）
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
    if (deltaX > 0) {
      // 向右滑动，显示上一张图片
      prev()
    } else {
      // 向左滑动，显示下一张图片
      next()
    }
  }
}

// 处理单个图片加载完成
function onImageLoaded() {
  loadedImageCount.value++
  console.log(`图片加载完成: ${loadedImageCount.value}/${totalImageCount.value}`)
  
  // 当所有图片加载完成时，隐藏加载提示
  if (loadedImageCount.value >= totalImageCount.value) {
    setTimeout(() => {
      isImagesLoading.value = false
      console.log('所有图片加载完成，隐藏加载提示')
      // 开始预加载下一页
      preloadNextPage()
    }, 300) // 延迟300ms隐藏，让用户看到100%的进度
  }
}

// 预加载下一页图片
function preloadNextPage() {
  if (page < Math.ceil(total / page_size)) {
    const nextPage = page + 1
    const params = {
      page: nextPage,
      page_size: page_size,
      category: current_category,
      location: current_location
    }
    
    // 静默预加载下一页的前几张图片
    api.getBlogsVisitor(params).then(res => {
      if (res.code === 200 && res.data.length > 0) {
        // 预加载前3张图片的缩略图
        res.data.slice(0, 3).forEach(blog => {
          if (blog.images && blog.images.length > 0) {
            const img = new Image()
            img.src = blog.images[0].thumbnail || blog.images[0].image_url
          }
        })
        console.log(`预加载第${nextPage}页前3张图片`)
      }
    }).catch(e => {
      console.log('预加载下一页失败:', e)
    })
  }
}

// 预加载分类图片
function preloadCategoryImages(category) {
  const params = {
    page: 1,
    page_size: 6, // 预加载前6张
    category: category,
    location: current_location
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

// 生成优化图片URL的函数
function getOptimizedImageUrl(originalUrl, type = 'lightbox') {
  if (!originalUrl || (!originalUrl.includes('http') && !originalUrl.includes('/api/'))) {
    return originalUrl
  }
  
  const separator = originalUrl.includes('?') ? '&' : '?'
  const isMobile = window.innerWidth <= 768
  const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768
  const isSlowConnection = navigator.connection && navigator.connection.effectiveType && 
                         ['slow-2g', '2g', '3g'].includes(navigator.connection.effectiveType)
  
  if (type === 'lightbox') {
    // lightbox显示：只压缩质量，保持原始比例
    if (isMobile) {
      const quality = isSlowConnection ? 60 : 70
      return `${originalUrl}${separator}auto=compress,format&q=${quality}`
    } else if (isTablet) {
      const quality = isSlowConnection ? 65 : 75
      return `${originalUrl}${separator}auto=compress,format&q=${quality}`
    } else {
      const quality = isSlowConnection ? 70 : 80
      return `${originalUrl}${separator}auto=compress,format&q=${quality}`
    }
  }
  
  return originalUrl
}

// 下载图片函数 - 始终下载原始高质量图片
function downloadImage() {
  if (!currentBlog.value) return
  
  // 使用原始图片URL进行下载，确保下载高质量图片
  const originalImageUrl = currentBlog.value.current_detail
  
  const link = document.createElement('a')
  link.href = originalImageUrl
  link.download = `${currentBlog.value.current_title || 'image'}_${Date.now()}.jpg`
  link.target = '_blank'
  
  // 对于跨域图片，使用fetch下载
  fetch(originalImageUrl)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob)
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
    .catch(() => {
      // 如果fetch失败，直接使用原链接
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
}
// 预加载图片函数
function preloadImage(imageUrl) {
  if (!imageUrl) return Promise.resolve(null)
  
  // 检查是否已经预加载过
  if (preloadedImages.value.has(imageUrl)) {
    return Promise.resolve(preloadedImages.value.get(imageUrl))
  }
  
  // 检查是否正在加载中
  if (imageLoadingPromises.value.has(imageUrl)) {
    return imageLoadingPromises.value.get(imageUrl)
  }

  const loadingPromise = new Promise((resolve) => {
    const img = new window.Image()
    let resolved = false
    
    const resolveOnce = (data) => {
      if (!resolved) {
        resolved = true
        imageLoadingPromises.value.delete(imageUrl) // 清理Promise缓存
        resolve(data)
      }
    }
    
    // 添加crossOrigin属性以支持跨域图片
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const imageData = {
        src: img.src,
        width: img.width,
        height: img.height,
      }
      preloadedImages.value.set(imageUrl, imageData)
      resolveOnce(imageData)
    }
    
    img.onerror = () => {
      console.warn('图片预加载失败:', imageUrl)
      // 尝试加载原图（去掉查询参数）
      const originalUrl = imageUrl.replace(/\?.*$/, '')
      if (originalUrl !== imageUrl) {
        console.log('尝试加载原图:', originalUrl)
        const originalImg = new window.Image()
        originalImg.crossOrigin = 'anonymous'
        originalImg.onload = () => {
          const imageData = {
            src: originalImg.src,
            width: originalImg.width,
            height: originalImg.height,
          }
          preloadedImages.value.set(imageUrl, imageData)
          resolveOnce(imageData)
        }
        originalImg.onerror = () => {
          console.error('原图也加载失败:', originalUrl)
          resolveOnce(null)
        }
        originalImg.src = originalUrl
      } else {
        resolveOnce(null)
      }
    }
    
    // 添加超时处理
    setTimeout(() => {
      if (!resolved) {
        console.warn('图片加载超时:', imageUrl)
        resolveOnce(null)
      }
    }, 1500) // 进一步减少超时时间，提高响应速度
    
    img.src = imageUrl
  })
  
  // 缓存加载Promise
  imageLoadingPromises.value.set(imageUrl, loadingPromise)
  return loadingPromise
}

// 预加载相邻图片
function preloadAdjacentImages(currentIndex) {
  const preloadCount = 3 // 增加预加载数量，预加载前后各3张图片
  for (
    let i = Math.max(0, currentIndex - preloadCount);
    i <= Math.min(blogs.value.length - 1, currentIndex + preloadCount);
    i++
  ) {
    if (i !== currentIndex && blogs.value[i]) {
      // 异步预加载，不阻塞当前图片显示
      setTimeout(() => {
        const optimizedUrl = getOptimizedImageUrl(blogs.value[i].current_detail, 'lightbox')
        preloadImage(optimizedUrl)
      }, i === currentIndex + 1 || i === currentIndex - 1 ? 0 : 100)
    }
  }
}

function showImage(blog) {
  currentBlog.value = blog
  imageVisible.value = false
  imageTransitioning.value = true

  // 为lightbox生成优化的缩略图URL以提高加载速度
  const originalImageUrl = blog.current_detail
  const optimizedImageUrl = getOptimizedImageUrl(originalImageUrl, 'lightbox')
  
  // 检查优化图片是否已预加载
  const preloadedData = preloadedImages.value.get(optimizedImageUrl)

  if (preloadedData) {
    // 图片已预加载，立即显示
    const maxW = window.innerWidth - 40
    const maxH = window.innerHeight - 40
    
    // 使用原始尺寸，只在超出屏幕时才缩放
    let finalWidth = preloadedData.width
    let finalHeight = preloadedData.height
    
    // 如果图片超出屏幕，进行等比例缩放
    if (finalWidth > maxW || finalHeight > maxH) {
      const scaleRatio = Math.min(maxW / finalWidth, maxH / finalHeight)
      finalWidth = finalWidth * scaleRatio
      finalHeight = finalHeight * scaleRatio
    }
    
    currentSize.value = {
      width: finalWidth,
      height: finalHeight,
    }
    nextImageUrl.value = preloadedData.src

    setTimeout(() => {
      imageSrc.value = nextImageUrl.value
      imageTransitioning.value = false
      imageVisible.value = true
    }, 100) // 进一步减少延迟时间
  } else {
    // 图片未预加载，开始加载流程
    preloadImage(optimizedImageUrl).then((imageData) => {
      if (imageData) {
        const maxW = window.innerWidth - 40
        const maxH = window.innerHeight - 40
        
        // 使用原始尺寸，只在超出屏幕时才缩放
        let finalWidth = imageData.width
        let finalHeight = imageData.height
        
        // 如果图片超出屏幕，进行等比例缩放
        if (finalWidth > maxW || finalHeight > maxH) {
          const scaleRatio = Math.min(maxW / finalWidth, maxH / finalHeight)
          finalWidth = finalWidth * scaleRatio
          finalHeight = finalHeight * scaleRatio
        }
        
        currentSize.value = {
          width: finalWidth,
          height: finalHeight,
        }
        nextImageUrl.value = imageData.src
        
        // 图片加载完成后再显示
        setTimeout(() => {
          imageSrc.value = nextImageUrl.value
          imageTransitioning.value = false
          imageVisible.value = true
        }, 50) // 减少延迟，提高响应速度
      } else {
        // 图片加载失败，使用默认尺寸并尝试显示
        console.warn('图片预加载失败，使用默认尺寸')
        currentSize.value = {
          width: Math.min(800, window.innerWidth - 40),
          height: Math.min(600, window.innerHeight - 40),
        }
        nextImageUrl.value = optimizedImageUrl
        
        setTimeout(() => {
          imageSrc.value = nextImageUrl.value
          imageTransitioning.value = false
        }, 100)
      }
    }).catch((error) => {
      console.error('图片加载出错:', error)
      // 加载出错时也要显示，避免无限等待
      currentSize.value = {
        width: Math.min(800, window.innerWidth - 40),
        height: Math.min(600, window.innerHeight - 40),
      }
      nextImageUrl.value = optimizedImageUrl
        
        setTimeout(() => {
          imageSrc.value = nextImageUrl.value
        imageTransitioning.value = false
      }, 100)
    })
    
    // 添加超时保护，如果5秒内没有加载完成，强制显示
    setTimeout(() => {
      if (imageTransitioning.value && !imageVisible.value) {
        console.warn('图片加载超时，强制显示')
        if (!nextImageUrl.value) {
          nextImageUrl.value = imageUrl
        }
        imageSrc.value = nextImageUrl.value
        imageTransitioning.value = false
        imageVisible.value = true
      }
    }, 3000) // 减少超时时间
  }

  // 预加载相邻图片
  const currentIndex = blogs.value.findIndex((b) => b.id === blog.id)
  preloadAdjacentImages(currentIndex)

  show.value = true
}
function onTransitionEnd(e) {
  // console.log("Transition ended for property:", e.propertyName);
  if (
    (e == null || e.propertyName === 'width' || e.propertyName === 'height') &&
    imageTransitioning.value
  ) {
    imageSrc.value = nextImageUrl.value
    imageTransitioning.value = false
  }
}
function onImageLoad() {
  imageVisible.value = true
}

function onImageError() {
  console.warn('Lightbox图片加载失败，尝试显示原图:', imageSrc.value)
  // 图片加载失败时仍然显示，避免无限加载状态
  imageVisible.value = true
  
  // 尝试加载原图（如果当前不是原图的话）
  if (currentBlog.value && imageSrc.value !== currentBlog.value.current_detail.replace(/\?.*$/, '')) {
    const originalUrl = currentBlog.value.current_detail.replace(/\?.*$/, '')
    console.log('尝试加载原图:', originalUrl)
    imageSrc.value = originalUrl
    imageVisible.value = false // 重新开始加载流程
  }
}
async function getBlogs(silentError = false) {
  try {
    isLoading.value = true
    
    var params = { page: page, page_size: page_size }
    if (isValueNotEmpty(current_category)) params.category = current_category
    if (isValueNotEmpty(current_location)) params.location = current_location
    
    const res = await api.getBlogsVisitor(params)

    if (res.code == 200) {
      // 简化加载时间，移动端优化
      const isMobile = window.innerWidth <= 768
      const minLoadingTime = isMobile ? 50 : 100
      await new Promise((resolve) => setTimeout(resolve, minLoadingTime))

      // 分页模式下，每次都替换数据
      blogs.value = [...res.data]
      
      formatBlogs()
      page = res.page
      total = res.total
      
      // 初始化图片加载状态
      totalImageCount.value = blogs.value.length
      loadedImageCount.value = 0
      isImagesLoading.value = totalImageCount.value > 0
      
      // 数据处理完成后关闭加载状态
      isLoading.value = false
      
      // 强制触发图片加载，特别是在移动端
      nextTick(() => {
        setTimeout(() => {
          // 强制重新触发所有图片的懒加载检测
          const imageElements = document.querySelectorAll('.thumb')
          imageElements.forEach((element, index) => {
            // 添加延迟确保DOM完全渲染
            setTimeout(() => {
              // 触发重新检测
              const event = new Event('scroll')
              window.dispatchEvent(event)
              
              // 对于移动端，强制触发图片加载
              const isMobile = window.innerWidth <= 768
              if (isMobile) {
                const imgContainer = element.querySelector('.image-container')
                if (imgContainer) {
                  // 强制触发intersection observer
                  const rect = imgContainer.getBoundingClientRect()
                  if (rect.top < window.innerHeight + 200) {
                    const img = imgContainer.querySelector('img')
                    if (!img || !img.src) {
                      // 强制加载图片
                      element.dispatchEvent(new Event('forceLoad'))
                    }
                  }
                }
              }
            }, index * 5) // 减少延迟，提高加载速度
          })
        }, 100)
      })
    }
  } catch (e) {
    // 简化错误处理
    console.log('图片加载失败:', e)
    isLoading.value = false
    
    // 移动端快速重试一次
    if (page === 1 && blogs.value.length === 0 && !silentError) {
      const isMobile = window.innerWidth <= 768
      const retryDelay = isMobile ? 500 : 1000
      setTimeout(() => {
        if (blogs.value.length === 0) {
          getBlogs(true)
        }
      }, retryDelay)
    }
  }
}
function formatBlogs() {
  for (let i = 0; i < blogs.value.length; i++) {
    var blog = blogs.value[i]
    blog.currentIndex = 0
    blog.detail_image_urls = []
    for (var index in blog.images) {
      var image = blog.images[index]
      // 优化缩略图URL生成，如果没有缩略图后缀则使用原图
      image.thumbnail = thumbnail_suffix ? image.image_url + thumbnail_suffix : image.image_url
      image.detail = image.image_url + detail_suffix
      if (image.time) {
        image.detail_time = formatDateTime(parseDateTime(image.time), detail_time_format)
      }
      blog.detail_image_urls.push(image.detail)
    }
    var time = parseDateTime(blog.time)
    blog.thumbnail_time = formatDateTime(time, thumbnail_time_format)
    blog.detail_time = formatDateTime(time, detail_time_format)
    updateAttr(blog)
  }

  // 简化预加载逻辑
  nextTick(() => {
    if (blogs.value.length > 0) {
      // 减少预加载数量，提升响应速度
      const isMobile = window.innerWidth <= 768
      const preloadCount = isMobile ? 2 : 3
      
      for (let i = 0; i < Math.min(preloadCount, blogs.value.length); i++) {
        if (blogs.value[i] && blogs.value[i].current_detail) {
          setTimeout(() => preloadImage(blogs.value[i].current_detail), i * 100)
        }
      }
    }
  })  
}

// 处理图片加载完成事件
function onImageLoadComplete() {
  loadedImageCount.value++
  if (loadedImageCount.value >= totalImageCount.value) {
    isImagesLoading.value = false
  }
}

async function getCategory() {
  if (isValueEmpty(current_category)) return []
  try {
    var params = {}
    params.alias = current_category
    const res = await api.getCategoryByAliasVisitor(params)
    if (res.code == 200) {
      document.title = `${res.data.name} ${splitter} ${baseTitle}`
    }
  } catch (e) {}
  return []
}
// 上一页
function goToPrevPage() {
  if (page > 1 && !isLoading.value) {
    page--
    isLoading.value = true
    blogs.value = []
    getBlogs()
    scrollToGallery()
  }
}

// 下一页
function goToNextPage() {
  if (page < Math.ceil(total / page_size) && !isLoading.value) {
    page++
    isLoading.value = true
    blogs.value = []
    getBlogs()
    scrollToGallery()
  }
}

// 滚动到相册区域
function scrollToGallery() {
  // 延迟滚动，确保加载状态已经显示
  setTimeout(() => {
    // 查找分类导航区域
    const categoriesSection = document.querySelector('.categories-nav-section')
    if (categoriesSection) {
      // 滚动到分类导航下方，留一些间距
      const targetPosition = categoriesSection.offsetTop + categoriesSection.offsetHeight + 20
      window.scrollTo({ top: targetPosition, behavior: 'smooth' })
    } else {
      // 如果找不到分类导航，则滚动到相册区域
      const gallerySection = document.querySelector('.gallery-section')
      if (gallerySection) {
        window.scrollTo({ top: gallerySection.offsetTop, behavior: 'smooth' })
      } else {
        // 如果都找不到，滚动到页面顶部
        const mainSection = document.querySelector('#blog-main')
        if (mainSection) {
          window.scrollTo({ top: mainSection.offsetTop, behavior: 'smooth' })
        }
      }
    }
  }, 100)
}

// 保留原有的loadMore函数以兼容其他可能的调用
function loadMore() {
  // 分页模式下不再使用滚动加载
  return
}
// 监听当前分类变化
watch(
  () => props.currentCategory,
  async (newCategory) => {
    current_category = newCategory
    close()
    page = 1
    total = 0

    // 立即显示加载状态并清空数据
    isLoading.value = true
    blogs.value = []

    getBlogs()
    getCategory()
  },
  { immediate: true }
)

// 监听分类变化
watch(
  () => props.currentCategory,
  (newCategory) => {
    current_category = newCategory
    close()
    isLoading.value = true
    page = 1
    total = 0
    blogs.value = []
    getBlogs()
  },
  { immediate: true }
)

// 监听路由变化（仅处理location参数）
watch(
  () => router.currentRoute.value.params.location,
  (newLocation) => {
    current_location = newLocation
    close()
    blogs.value = []
    page = 1
    total = 0
    
    // 显示加载状态
    isLoading.value = true
    
    getBlogs()
    if (isValueNotEmpty(current_location)) {
      document.title = `${current_location} ${splitter} ${baseTitle}`
    }
  },
  { immediate: true }
)
// 移除滚动加载监听器，改为分页模式
// scrollToload(listRef, loadMore)
// scrollToload(null, loadMore)
</script>
<style>
.img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.lightbox-content .pic {
  display: block;
  text-align: center;
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.lightbox {
  background: transparent;
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 20000;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 1;
}

.lightbox-content {
  background: transparent;
  cursor: default;
  display: block;
  position: relative;
  z-index: 20001;
  width: auto;
  height: auto;
  max-width: 95vw;
  max-height: 85vh;
}

.lightbox-content:before {
  transition: opacity 0.2s ease-in-out;
  content: '';
  display: block;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
  opacity: 1;
}

.lightbox-content .loader {
  animation: spinner 1s infinite linear !important;
  background-image: url(/assets/spinner.svg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: block;
  font-size: 2em;
  height: 2em;
  left: 50%;
  line-height: 2em;
  margin: -1em 0 0 -1em;
  opacity: 0.25;
  position: absolute;
  text-align: center;
  top: 50%;
  width: 2em;
}

.lightbox-content .nav-previous,
.lightbox-content .nav-next {
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  height: 50px;
  margin-top: -25px;
  opacity: 1;
  position: absolute;
  top: 50%;
  width: 50px;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.lightbox-content .nav-previous {
  left: 20px;
}

.lightbox-content .nav-next {
  right: 20px;
}

.lightbox-content:hover .closer,
.lightbox-content:hover .nav-previous,
.lightbox-content:hover .nav-next,
.lightbox-content:hover .download-button {
  opacity: 1;
}

.lightbox-content:hover .closer:hover,
.lightbox-content:hover .nav-previous:hover,
.lightbox-content:hover .nav-next:hover {
  opacity: 1;
}

.lightbox-content:hover .download-button:hover {
  opacity: 1;
}

.lightbox-content .closer {
  transition: all 0.2s ease-in-out;
  height: 50px;
  opacity: 1;
  position: absolute;
  right: 20px;
  top: 20px;
  width: 50px;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.lightbox-content .download-button {
  transition: all 0.2s ease-in-out;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  cursor: pointer;
  height: 40px;
  width: 40px;
  opacity: 0;
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 20003;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  backdrop-filter: blur(4px);
}

.lightbox-content .download-button:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.05);
}

/* 移动端下载按钮优化 */
@media screen and (max-width: 768px) {
  .lightbox-content .download-button {
    height: 44px;
    width: 44px;
    right: 16px;
    bottom: 16px;
    opacity: 0.6;
  }
  
  .lightbox-content .download-button:active {
    opacity: 1;
    background: rgba(0, 0, 0, 0.9);
    transform: scale(0.95);
  }
}

.lightbox-content .caption {
  padding: 2em 2em 0.1em;
  background-image: linear-gradient(to top, rgba(16, 16, 16, 0.45) 25%, rgba(16, 16, 16, 0) 100%);
  bottom: 0rem;
  cursor: default;
  left: 0;
  position: absolute;
  text-align: left;
  width: 100%;
  z-index: 2;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
}

#blog-main {
  transition: filter 0.2s ease, opacity 0.2s ease;
  column-count: 4;
  column-gap: 16px;
  overflow: auto;
  width: 100%;
  padding: 8px;
  margin: 0;
  box-sizing: border-box;
  position: relative;
  /* 优化滚动性能 */
  contain: layout style;
  scroll-behavior: smooth;
}

#blog-main.loading {
  opacity: 1;
  pointer-events: none;
}

.images-container {
  width: 100%;
}

/* 过渡动画 */
.fade-slide-enter-active {
  transition: all 0.4s ease;
}

.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.fade-slide-move {
  transition: transform 0.4s ease;
}

@media screen and (max-width: 1280px) {
  #blog-main {
    column-count: 3;
    column-gap: 16px;
  }
}

@media screen and (max-width: 768px) {
  #blog-main {
    column-count: 2;
    column-gap: 16px;
  }
}

@media screen and (max-width: 480px) {
  #blog-main {
    column-count: 2;
    column-gap: 16px;
  }
}

@media screen and (max-width: 360px) {
  #blog-main {
    column-count: 2;
    column-gap: 16px;
  }
}

body {
  padding-bottom: 80px;
}

@media screen and (max-width: 736px) {
  body {
    padding-top: 60px;
  }
}

#blog-main:after {
  pointer-events: none;
  transition: opacity 0.5s ease, visibility 0.5s;
  background: rgba(36, 38, 41, 0.25);
  content: '';
  display: block;
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  visibility: hidden;
  width: 100%;
  z-index: 1;
}

body.content-active #blog-main:after {
  pointer-events: auto;
  opacity: 1;
  visibility: visible;
  backdrop-filter: saturate(180%) blur(20px);
  background: var(--moment-maskbgdeep);
}

.lightbox-content .caption {
  padding: 2em 2em 0.1em 2em;
  background-image: linear-gradient(to top, rgba(16, 16, 16, 0.45) 25%, rgba(16, 16, 16, 0) 100%);
  bottom: 0rem;
  cursor: default;
  left: 0;
  position: absolute;
  text-align: left;
  width: 100%;
  z-index: 2;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
}

.lightbox-content .caption h2,
.lightbox-content .caption h3,
.lightbox-content .caption h4,
.lightbox-content .caption h5,
.lightbox-content .caption h6 {
  margin: 0;
  font-weight: bold;
}

.lightbox-content .caption .thumb-desc {
  color: #ffffff;
  font-size: 15px;
  margin: 4px 0;
}

.lightbox-content:hover .closer,
.lightbox-content:hover .nav-previous,
.lightbox-content:hover .nav-next {
  opacity: 0.5;
}

.lightbox-content:hover .closer:hover,
.lightbox-content:hover .nav-previous:hover,
.lightbox-content:hover .nav-next:hover {
  opacity: 1;
}

.lightbox-content.loading:before {
  opacity: 0;
}

body.touch .lightbox-content .closer,
body.touch .lightbox-content .nav-previous,
body.touch .lightbox-content .nav-next {
  opacity: 1 !important;
}

ul.tags {
  display: flex;
  padding-left: 0px;
  flex-wrap: wrap;
}

#blog-main ul.tags {
  padding-left: 12px;
}

.tag-categories,
.tag-meta {
  display: flex;
  flex-wrap: wrap;
}

.tag-meta a[data-content=''] {
  display: none;
}

#blog-main .tag-meta {
  display: none;
}

.lightbox-content .tag-meta a[data-show-detail=''] {
  display: none;
}

.tag-categories a,
.tag-meta a {
  padding: 4px 6px;
  border-radius: 8px;
  background: var(--moment-black-op);
  font-size: 12px;
  color: var(--moment-fontcolor);
  transition: 0.3s;
  z-index: 1;
  margin: 12px 12px 0 0px;
  backdrop-filter: saturate(180%) blur(20px);
}

.tag-categories a:hover,
.tag-location:hover {
  background: var(--moment-theme);
  color: var(--moment-white);
}

.lightbox-content .tag-categories a {
  background: var(--moment-black-op);
}

.lightbox-content .tag-categories a:hover {
  background: var(--moment-theme);
}

@media screen and (max-width: 980px) {
  .lightbox-content .closer {
    background-size: 3em;
  }

  .lightbox-content .nav-previous,
  .lightbox-content .nav-next {
    background-size: 4em;
  }
}

@media screen and (max-width: 736px) {
  .lightbox-content:before {
    display: none;
  }

  .lightbox-content .caption .thumb-desc {
    margin: 10px 0px 0px 0px;
  }

  .lightbox-content .caption {
    bottom: 10px;
    position: fixed;
    z-index: 10000;
  }

  .lightbox-content .closer,
  .lightbox-content .nav-previous,
  .lightbox-content .nav-next {
    opacity: 1 !important;
  }

  .lightbox-content .closer:active,
  .lightbox-content .nav-previous:active,
  .lightbox-content .nav-next:active {
    opacity: 1 !important;
  }

  .nav-item .nav-item-child {
    top: 30px;
  }
}

/* Wrapper */
#wrapper {
  transition: filter 0.5s ease;
  position: relative;
}

#wrapper:after {
  pointer-events: none;
  transition: opacity 0.5s ease, visibility 0.5s;
  background: rgba(36, 38, 41, 0.5);
  content: '';
  display: block;
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  visibility: hidden;
  width: 100%;
  z-index: 1;
}

body.ie #wrapper:after {
  background: rgba(36, 38, 41, 0.8);
}

body.modal-active #wrapper:after {
  pointer-events: auto;
  opacity: 0;
  visibility: visible;
  z-index: 10003;
}

@-moz-keyframes spinner {
  0% {
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -moz-transform: rotate(359deg);
    -webkit-transform: rotate(359deg);
    -ms-transform: rotate(359deg);
    transform: rotate(359deg);
  }
}

@-webkit-keyframes spinner {
  0% {
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -moz-transform: rotate(359deg);
    -webkit-transform: rotate(359deg);
    -ms-transform: rotate(359deg);
    transform: rotate(359deg);
  }
}

@-ms-keyframes spinner {
  0% {
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -moz-transform: rotate(359deg);
    -webkit-transform: rotate(359deg);
    -ms-transform: rotate(359deg);
    transform: rotate(359deg);
  }
}

@keyframes spinner {
  0% {
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -moz-transform: rotate(359deg);
    -webkit-transform: rotate(359deg);
    -ms-transform: rotate(359deg);
    transform: rotate(359deg);
  }
}

#wrapper:before {
  -moz-animation: spinner 1s infinite linear !important;
  -webkit-animation: spinner 1s infinite linear !important;
  -ms-animation: spinner 1s infinite linear !important;
  animation: spinner 1s infinite linear !important;
  pointer-events: none;
  -moz-transition: top 0.75s ease-in-out, opacity 0.35s ease-out, visibility 0.35s;
  -webkit-transition: top 0.75s ease-in-out, opacity 0.35s ease-out, visibility 0.35s;
  -ms-transition: top 0.75s ease-in-out, opacity 0.35s ease-out, visibility 0.35s;
  transition: top 0.75s ease-in-out, opacity 0.35s ease-out, visibility 0.35s;
  background-image: url('/assets/spinner.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  content: '';
  display: block;
  font-size: 2em;
  height: 2em;
  left: 50%;
  line-height: 2em;
  margin: -1em 0 0 -1em;
  opacity: 0;
  position: fixed;
  text-align: center;
  top: 75%;
  visibility: hidden;
  width: 2em;
}

/* 面包屑导航样式 */
/* .breadcrumb-nav {
    display: none;
} */

/* 只在弹出层中显示面包屑，并调整位置到底部 */
.lightbox-content .breadcrumb-nav {
  display: flex;
  gap: 10px;
  justify-content: center;
  order: 999;
  /* 确保在caption内容的最后面 */
}

.nav-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 999;
}

.nav-dot:hover {
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.nav-dot.active {
  background-color: #fff;
  transform: scale(1.2);
}

/* 普通加载状态样式 */
.gallery-loading-message {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  width: 100%;
  min-height: 200px;
  height: 40vh;
  text-align: center;
  position: relative;
  box-sizing: border-box;
}

/* 弹窗加载样式 */
.loading-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.loading-modal {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.loading-progress-container {
  margin-top: 20px;
  width: 100%;
}

.loading-progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 107, 53, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
}

.loading-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b35, #ffa500);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.loading-progress-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 优化的加载提示样式 */

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-spinner-main {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 107, 53, 0.2);
  border-top: 4px solid #ff6b35;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.loading-text {
  color: #666;
  font-size: 16px;
  font-weight: 500;
  animation: textPulse 2s ease-in-out infinite;
}

.loading-text.secondary {
  font-size: 14px;
  color: #888;
  margin-top: -10px;
  animation: textFadeIn 0.5s ease-in-out;
}

.loading-progress {
  width: 200px;
  height: 4px;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #ff6b35, #ffa500);
  border-radius: 2px;
  animation: progressMove 2s ease-in-out infinite;
}

@keyframes progressMove {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}

@keyframes textPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.button-loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 移动端优化 */
@media screen and (max-width: 768px) {
  .gallery-loading-message {
    padding: 40px 20px;
    min-height: 180px;
    height: 35vh;
    /* 移动端确保垂直居中 */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .loading-spinner-main {
    width: 32px;
    height: 32px;
    border-width: 3px;
  }
  
  .loading-text {
    font-size: 14px;
  }
  
  .loading-progress {
    width: 150px;
    height: 3px;
  }
  
  .loading-modal {
    padding: 30px;
    max-width: 350px;
  }
  
  .loading-progress-bar {
    height: 4px;
  }
}

@keyframes textFadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes textPulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes textFadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 加载动画样式 */
.lightbox-loading-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.8);
  cursor: pointer;
}

.loading-close-hint {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.lightbox-loading-container:hover .loading-close-hint {
  opacity: 1;
}

.lightbox-spinner {
  width: 40px;
  height: 40px;
  position: relative;
  display: inline-block;
}

.lightbox-spinner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid #ffffff;
  border-right: 3px solid #ffffff;
  border-radius: 50%;
  animation: lightboxSpinPrimary 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

.lightbox-spinner::after {
  content: '';
  position: absolute;
  top: 6px;
  left: 6px;
  width: calc(100% - 12px);
  height: calc(100% - 12px);
  border: 2px solid transparent;
  border-bottom: 2px solid rgba(255, 255, 255, 0.7);
  border-left: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  animation: lightboxSpinSecondary 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
}

@keyframes lightboxSpinPrimary {
  0% {
    transform: rotate(0deg);
    border-top-color: #ffffff;
    border-right-color: #ffffff;
  }
  50% {
    transform: rotate(180deg);
    border-top-color: rgba(255, 255, 255, 0.8);
    border-right-color: rgba(255, 255, 255, 0.8);
  }
  100% {
    transform: rotate(360deg);
    border-top-color: #ffffff;
    border-right-color: #ffffff;
  }
}

@keyframes lightboxSpinSecondary {
  0% {
    transform: rotate(0deg);
    border-bottom-color: rgba(255, 255, 255, 0.7);
    border-left-color: rgba(255, 255, 255, 0.7);
  }
  50% {
    transform: rotate(-180deg);
    border-bottom-color: rgba(255, 255, 255, 0.5);
    border-left-color: rgba(255, 255, 255, 0.5);
  }
  100% {
    transform: rotate(-360deg);
    border-bottom-color: rgba(255, 255, 255, 0.7);
    border-left-color: rgba(255, 255, 255, 0.7);
  }
}

.lightbox-loading-text {
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  margin-top: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 分页导航样式 */
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  column-span: all;
  width: 100%;
  gap: 20px;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 14px;
}

.total-count {
  font-size: 12px;
  opacity: 0.8;
}

.pagination-buttons {
  display: flex;
  gap: 15px;
  align-items: center;
}

.pagination-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  border: 2px solid rgba(255, 107, 53, 0.3);
  border-radius: 20px;
  color: #333;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.1);
  min-width: 80px;
  justify-content: center;
}

.pagination-button:hover:not(.disabled) {
  color: #ff6b35;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 165, 0, 0.1) 100%);
  border-color: #ff6b35;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.2);
}

.pagination-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(200, 200, 200, 0.5);
  color: #999;
}

.pagination-button.disabled:hover {
  transform: none;
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.1);
}

.prev-button svg {
  order: -1;
}

.next-button svg {
  order: 1;
}

@media (max-width: 768px) {
  .pagination-container {
    padding: 25px 20px;
    gap: 25px;
  }
  
  .pagination-buttons {
    gap: 15px;
    width: 100%;
    justify-content: center;
  }
  
  .pagination-button {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    min-width: 90px;
    min-height: 40px;
    border-radius: 25px;
    border-width: 2px;
    box-shadow: 0 4px 16px rgba(255, 107, 53, 0.12);
    backdrop-filter: blur(10px);
  }
  
  .pagination-button:hover:not(.disabled) {
    transform: translateY(-1px) scale(1.01);
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.25);
  }
  
  .pagination-button:active:not(.disabled) {
    transform: translateY(0) scale(0.98);
    transition: all 0.1s ease;
  }
  
  .pagination-info {
    font-size: 14px;
    gap: 8px;
  }
  
  .total-count {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .pagination-container {
    padding: 20px 15px;
    gap: 20px;
  }
  
  .pagination-buttons {
    gap: 12px;
    flex-direction: row;
    width: 100%;
  }
  
  .pagination-button {
    padding: 8px 16px;
    font-size: 13px;
    min-width: 80px;
    min-height: 36px;
    border-radius: 20px;
    flex: 1;
    max-width: 120px;
  }
  
  .pagination-info {
    font-size: 13px;
    text-align: center;
  }
  
  .total-count {
    font-size: 11px;
  }
}

/* 底部加载指示器样式 */
.bottom-loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 20px;
  margin: 20px 0;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%);
  border-radius: 16px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 107, 53, 0.2);
  box-shadow: 0 8px 32px rgba(255, 107, 53, 0.1);
  animation: slideInUp 0.5s ease-out;
  position: relative;
  overflow: hidden;
}

.bottom-loading-indicator::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 2s ease-in-out infinite;
}

/* 图片展示区域容器 */
.gallery-container {
  position: relative;
  min-height: 400px;
  width: 100%;
}

/* 图片展示区域加载遮罩 */
.gallery-loading-overlay {
  position: relative;
  margin: 20px auto 0;
  width: fit-content;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
  animation: fadeIn 0.3s ease-out;
  padding: 16px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

/* 图片展示区域加载内容 */
.gallery-loading-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  text-align: center;
  color: white;
  white-space: nowrap;
}

/* 图片展示区域加载旋转器 */
.gallery-loading-spinner {
  width: 24px;
  height: 24px;
  position: relative;
  display: inline-block;
  flex-shrink: 0;
}

.gallery-loading-spinner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-top: 2px solid #ff6b35;
  border-right: 2px solid #ff6b35;
  border-radius: 50%;
  animation: gallerySpinPrimary 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

.gallery-loading-spinner::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  border: 2px solid transparent;
  border-bottom: 2px solid #ffa500;
  border-left: 2px solid #ffa500;
  border-radius: 50%;
  animation: gallerySpinSecondary 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
}

@keyframes gallerySpinPrimary {
  0% {
    transform: rotate(0deg);
    border-top-color: #ff6b35;
    border-right-color: #ff6b35;
  }
  50% {
    transform: rotate(180deg);
    border-top-color: #ffa500;
    border-right-color: #ffa500;
  }
  100% {
    transform: rotate(360deg);
    border-top-color: #ff6b35;
    border-right-color: #ff6b35;
  }
}

@keyframes gallerySpinSecondary {
  0% {
    transform: rotate(0deg);
    border-bottom-color: #ffa500;
    border-left-color: #ffa500;
  }
  50% {
    transform: rotate(-180deg);
    border-bottom-color: #ff6b35;
    border-left-color: #ff6b35;
  }
  100% {
    transform: rotate(-360deg);
    border-bottom-color: #ffa500;
    border-left-color: #ffa500;
  }
}

/* 图片展示区域加载文字 */
.gallery-loading-text {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 图片展示区域进度条 */
.gallery-loading-progress {
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.gallery-progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.gallery-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b35 0%, #ffa500 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
  position: relative;
}

.gallery-progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: progressShimmer 2s ease-in-out infinite;
}

.gallery-progress-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* 图片容器在加载时的样式 */
.images-container.images-loading {
  /* 移除遮罩效果，保持图片清晰可见 */
  opacity: 1;
  pointer-events: auto;
  transition: all 0.3s ease;
}

/* 图片加载指示器样式 - 在分页栏上方 */
.images-loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px 24px;
  margin: 20px 0;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(255, 165, 0, 0.04) 100%);
  border-radius: 14px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 107, 53, 0.15);
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.08);
  animation: slideInUp 0.4s ease-out;
  position: relative;
  overflow: hidden;
}

.images-loading-indicator::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
  animation: shimmer 2.5s ease-in-out infinite;
}

.images-loading-content {
  display: flex;
  align-items: center;
  gap: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 500;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.bottom-loading-content {
  display: flex;
  align-items: center;
  gap: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 500;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.loading-spinner-small {
  width: 18px;
  height: 18px;
  position: relative;
  display: inline-block;
}

.loading-spinner-small::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-top: 2px solid #ff6b35;
  border-right: 2px solid #ff6b35;
  border-radius: 50%;
  animation: spinSmallPrimary 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

.loading-spinner-small::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  border: 1px solid transparent;
  border-bottom: 1px solid #ffa500;
  border-left: 1px solid #ffa500;
  border-radius: 50%;
  animation: spinSmallSecondary 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
}

@keyframes spinSmallPrimary {
  0% {
    transform: rotate(0deg);
    border-top-color: #ff6b35;
    border-right-color: #ff6b35;
  }
  50% {
    transform: rotate(180deg);
    border-top-color: #ffa500;
    border-right-color: #ffa500;
  }
  100% {
    transform: rotate(360deg);
    border-top-color: #ff6b35;
    border-right-color: #ff6b35;
  }
}

@keyframes spinSmallSecondary {
  0% {
    transform: rotate(0deg);
    border-bottom-color: #ffa500;
    border-left-color: #ffa500;
  }
  50% {
    transform: rotate(-180deg);
    border-bottom-color: #ff6b35;
    border-left-color: #ff6b35;
  }
  100% {
    transform: rotate(-360deg);
    border-bottom-color: #ffa500;
    border-left-color: #ffa500;
  }
}

/* 响应式优化 - 确保在所有设备上完美居中 */
@media (max-width: 768px) {
  .gallery-loading-message {
    min-height: 180px;
    height: 35vh;
    padding: 30px 20px;
    font-size: 15px;
    /* 确保移动端垂直居中 */
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
  
  .bottom-loading-indicator {
    padding: 20px 15px;
    margin: 15px 0;
  }
  
  .bottom-loading-content {
    font-size: 13px;
  }
  
  .images-loading-indicator {
    padding: 12px 16px;
    margin: 15px 0;
  }
  
  .images-loading-content {
    font-size: 12px;
    gap: 6px;
  }
}

@media (max-width: 480px) {
  .gallery-loading-message {
    min-height: 160px;
    height: 30vh;
    padding: 20px 15px;
  }
  
  .loading-modal {
    padding: 25px;
    max-width: 300px;
  }
  
  .images-loading-indicator {
    padding: 10px 12px;
    margin: 12px 0;
  }
  
  .images-loading-content {
    font-size: 11px;
    gap: 5px;
  }
  
  .loading-content {
    gap: 15px;
  }
  
  .loading-spinner-main {
    width: 28px !important;
    height: 28px !important;
    border-width: 2px !important;
  }
  
  .loading-text {
    font-size: 13px !important;
  }
  
  .loading-progress-bar {
    height: 4px;
  }
}

/* 加载完成提示样式 */
.load-complete-indicator {
  display: flex;
  justify-content: center;
  padding: 20px;
  opacity: 1;
  transition: opacity 0.3s ease;
  column-span: all;
  width: 100%;
}

.load-complete-indicator span {
  color: #999;
  font-size: 14px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  backdrop-filter: blur(5px);
}

/* 优化页面loading效果 */
body.is-preload #blog-main {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(2px);
}

/* 图片容器布局优化 */
.images-container {
  width: 100%;
}

/* 淡入滑动动画 */
.fade-slide-enter-active {
  transition: all 0.4s ease;
  will-change: opacity, transform;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) translateZ(0);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0) translateZ(0);
}
</style>
