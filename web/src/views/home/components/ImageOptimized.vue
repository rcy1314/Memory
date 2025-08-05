<template>
  <article class="thumb img-area" ref="thumbRef">
    <a class="thumb-a my-photo">
      <div class="image-container" :class="{ 'collection-stack': isCollection }">
        <!-- 简洁的加载提示 -->
        <div v-if="imageSrc && !imageLoaded" class="loading-indicator">
          <div class="loading-spinner"></div>
        </div>
        <!-- 渐进式图片加载 -->
        <img
          v-if="imageSrc"
          class="thumb-image my-photo"
          ref="imageRef"
          :src="imageSrc"
          @load="onImageLoad"
          @error="onImageError"
          :style="{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }"
        />
        <!-- 合集指示器 -->
        <div v-if="isCollection" class="collection-indicator">
          <div class="collection-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" fill="currentColor"/>
            </svg>
          </div>
          <span class="collection-count">{{ data.images.length }}</span>
        </div>
        <!-- 合集角标 - 已隐藏以避免遮挡标题 -->
        <!-- <div v-if="isCollection" class="collection-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" fill="currentColor"/>
          </svg>
        </div> -->
      </div>
    </a>
    <div class="thumb-overlay">
      <h2 class="thumb-title">{{ data.title }}</h2>
      <p v-if="data.desc" class="thumb-desc">{{ data.desc }}</p>
      <ul class="tags">
        <li class="tag-categories">
          <router-link
            v-if="thumbnail_show_location && data.location"
            class="tag-location thumbnail-tag"
            :to="'/location/' + data.location"
            >{{ data.location }}</router-link
          >
          <a v-if="thumbnail_show_time && data.time" class="tag-time thumbnail-tag">{{ data.thumbnail_time }}</a>
          <router-link
            v-for="category in data.categories"
            :key="category.alias"
            :to="'/category/' + category.alias"
            >{{ category.name }}</router-link
          >
        </li>
      </ul>
    </div>
  </article>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSettingStore } from '@/store'
import { isValueNotEmpty } from '@/utils'
import { 
  getCompressionConfig, 
  compressImageFromUrl, 
  generatePlaceholder,
  getDeviceType,
  getConnectionType
} from '@/utils/imageOptimizer'

const settingStore = useSettingStore()
const thumbRef = ref(null)
const imageRef = ref(null)
const imageLoaded = ref(false)
const imageSrc = ref('')
const placeholderSrc = ref('')
const isIntersecting = ref(false)
const loadingText = ref('加载中...')
const compressionProgress = ref(0)

var thumbnail_show_location = isValueNotEmpty(settingStore.contentSetting.thumbnail_show_location)
  ? settingStore.contentSetting.thumbnail_show_location
  : true
var thumbnail_show_time = isValueNotEmpty(settingStore.contentSetting.thumbnail_show_time)
  ? settingStore.contentSetting.thumbnail_show_time
  : false

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['image-loaded'])

// 判断是否为合集（包含多张图片）
const isCollection = computed(() => {
  return props.data.images && props.data.images.length > 1
})

// 简化加载控制
const maxRetries = 2

// 懒加载逻辑
let observer = null

// 获取设备和网络信息
const deviceType = getDeviceType()
const connectionType = getConnectionType()



const onImageLoad = () => {
  imageLoaded.value = true
  retryCount.value = 0 // 重置重试计数器
  emit('image-loaded')
  
  // 立即清除加载提示
  loadingText.value = ''
  compressionProgress.value = 0
  
  // 手机端性能优化：图片加载完成后移除observer
  if (observer && thumbRef.value) {
    observer.unobserve(thumbRef.value)
  }
}

// 重试计数器
const retryCount = ref(0)

const onImageError = () => {
  console.warn('图片加载失败:', props.data.title)
  
  if (retryCount.value < maxRetries) {
    retryCount.value++
    
    // 快速重试，使用原始URL
    setTimeout(() => {
      let originalUrl = null
      if (props.data.images && props.data.images.length > 0) {
        originalUrl = props.data.images[0].image_url
      } else if (props.data.image_url) {
        originalUrl = props.data.image_url
      }
      
      if (originalUrl) {
        imageSrc.value = originalUrl
      }
    }, 300) // 减少延迟
  } else {
    imageLoaded.value = false
    imageSrc.value = ''
    retryCount.value = 0
  }
}

// 移除复杂的压缩逻辑

const loadImage = (forceLoad = false) => {
  let imageUrl = null
  
  if (props.data.images && props.data.images.length > 0) {
    imageUrl = props.data.images[0].image_url
  } else if (props.data.image_url) {
    imageUrl = props.data.image_url
  }
  
  if (imageUrl && (!imageSrc.value || forceLoad)) {
    // 简化图片URL优化
    const isMobile = window.innerWidth <= 768
    let optimizedUrl = imageUrl
    
    // 优化缩略图尺寸和质量设置
    if (imageUrl.includes('http') || imageUrl.includes('/api/')) {
      const separator = imageUrl.includes('?') ? '&' : '?'
      
      // 根据屏幕尺寸调整缩略图参数
      let quality, width, height
      
      if (isMobile) {
        // 移动端：更小尺寸，适中质量
        quality = 45
        width = 200
        height = 280
      } else if (window.innerWidth <= 1280) {
        // 中等屏幕：3列布局
        quality = 55
        width = 280
        height = 380
      } else {
        // 大屏幕：4列布局
        quality = 60
        width = 320
        height = 420
      }
      
      optimizedUrl = `${imageUrl}${separator}w=${width}&h=${height}&fit=cover&q=${quality}`
    }
    
    imageSrc.value = optimizedUrl
  }
}

onMounted(() => {
  // 简化懒加载逻辑
  if ('IntersectionObserver' in window && thumbRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersecting.value = true
            loadImage()
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '200px',
        threshold: 0.1
      }
    )
    observer.observe(thumbRef.value)
  } else {
    isIntersecting.value = true
    loadImage()
  }
})

onUnmounted(() => {
  if (observer && thumbRef.value) {
    observer.unobserve(thumbRef.value)
  }
  
  // 清理压缩后的URL对象
  if (imageSrc.value && imageSrc.value.startsWith('blob:')) {
    URL.revokeObjectURL(imageSrc.value)
  }
})
</script>

<style scoped>
.compression-progress {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
}

.loading-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8px;
}

/* 继承原有样式 */
.thumb {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: transparent;
  margin: 6px 0.5px;
  break-inside: avoid;
}

.image-container {
  position: relative;
  width: 100%;
  background: transparent;
  border-radius: 8px;
  overflow: hidden;
}

.loading-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.loading-indicator .loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

.image-loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border-radius: 8px;
}

.loading-mask-content {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}



.thumb-image {
  width: 100%;
  height: auto;
  display: block;
  transition: opacity 0.3s ease-in-out;
  object-fit: cover;
  border-radius: 8px;
  /* 优化图片渲染 */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.thumb-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 20px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.thumb:hover .thumb-overlay {
  opacity: 1;
  transform: translateY(0);
}

.thumb-title {
  font-size: 14px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.thumb-desc {
  font-size: 12px;
  margin: 0 0 12px 0;
  opacity: 0.9;
}

/* 手机端字体优化 */
@media screen and (max-width: 768px) {
  .thumb-title {
    font-size: 12px;
  }
  
  .thumb-desc {
    font-size: 11px;
  }
  
  .tag-categories a {
    font-size: 10px;
    padding: 3px 6px;
  }
}

.tags {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tag-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-categories a {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 12px;
  transition: background 0.2s;
}

.tag-categories a:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 悬停效果 */
.thumb {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  transform: translateZ(0);
}

.thumb:hover {
  transform: translateZ(0) scale(0.97);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* 合集堆叠效果 */
.collection-stack {
  position: relative;
}

.collection-stack::before,
.collection-stack::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  border-radius: inherit;
  z-index: -1;
  transition: all 0.3s ease;
}

.collection-stack::before {
  transform: translate(4px, 4px) scale(0.96);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
}

.collection-stack::after {
  transform: translate(6px, 6px) scale(0.93);
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.3);
}

.thumb:hover .collection-stack::before {
  transform: translate(6px, 6px) scale(0.93);
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.3);
}

.thumb:hover .collection-stack::after {
  transform: translate(12px, 12px) scale(0.86);
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2);
}

/* 移动端堆叠效果优化 */
@media screen and (max-width: 768px) {
  .collection-stack::before {
    transform: translate(3px, 3px) scale(0.97);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
  }
  
  .collection-stack::after {
    transform: translate(6px, 6px) scale(0.94);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  .thumb:hover .collection-stack::before {
    transform: translate(4px, 4px) scale(0.95);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  }
  
  .thumb:hover .collection-stack::after {
    transform: translate(8px, 8px) scale(0.92);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
  }
}

/* 合集指示器样式 */
.collection-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.75));
  backdrop-filter: blur(6px);
  border-radius: 18px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-size: 14px;
  font-weight: 700;
  z-index: 3;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.collection-indicator:hover {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.85));
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(255, 255, 255, 0.25);
}

.collection-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.collection-icon svg {
  width: 12px;
  height: 12px;
}

.collection-count {
  line-height: 1;
  min-width: 16px;
  text-align: center;
}

/* 合集角标样式 */
.collection-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.9));
  backdrop-filter: blur(6px);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  z-index: 3;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.6);
}

.collection-badge:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.95));
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.6);
}

.collection-badge svg {
  width: 12px;
  height: 12px;
}

/* 移动端优化 */
@media screen and (max-width: 768px) {
  .collection-indicator {
    top: 6px;
    right: 6px;
    padding: 6px 8px;
    border-radius: 14px;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.15);
  }
  
  .collection-icon svg {
    width: 12px;
    height: 12px;
  }
  
  .collection-badge {
    bottom: 6px;
    left: 6px;
    width: 26px;
    height: 26px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.4);
    border: 2px solid rgba(255, 255, 255, 0.6);
  }
  
  .collection-badge svg {
    width: 12px;
    height: 12px;
  }
}

/* 平板端悬停效果 */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .thumb {
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }
  
  .thumb:hover {
    transform: scale(0.98);
  }
}

/* 手机端悬停效果 */
@media screen and (max-width: 768px) {
  .thumb {
    transition: transform 0.15s ease;
  }
  
  .thumb:hover {
    transform: scale(0.99);
  }
}
</style>