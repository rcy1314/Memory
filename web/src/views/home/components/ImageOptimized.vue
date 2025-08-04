<template>
  <article class="thumb img-area" ref="thumbRef">
    <a class="thumb-a my-photo">
      <div class="image-container">
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
import { ref, onMounted, onUnmounted } from 'vue'
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

// 图片加载并发控制
let loadingQueue = []
let currentLoadingCount = 0
const maxConcurrentLoads = window.innerWidth <= 768 ? 3 : 5

// 懒加载逻辑
let observer = null

// 获取设备和网络信息
const deviceType = getDeviceType()
const connectionType = getConnectionType()



const onImageLoad = () => {
  imageLoaded.value = true
  loadingText.value = '加载完成'
  compressionProgress.value = 100
  retryCount.value = 0 // 重置重试计数器
  emit('image-loaded')
  
  // 延迟隐藏加载提示
  setTimeout(() => {
    loadingText.value = ''
    compressionProgress.value = 0
  }, 500)
  
  // 手机端性能优化：图片加载完成后移除observer
  if (observer && thumbRef.value) {
    observer.unobserve(thumbRef.value)
  }
}

// 重试计数器
const retryCount = ref(0)
const maxRetries = 3

const onImageError = () => {
  console.warn('图片加载失败:', props.data.title, '重试次数:', retryCount.value)
  
  if (retryCount.value < maxRetries) {
    retryCount.value++
    loadingText.value = `重试中... (${retryCount.value}/${maxRetries})`
    
    // 延迟重试，避免立即重复请求
    setTimeout(() => {
      // 尝试使用原始URL重新加载
      let originalUrl = null
      if (props.data.images && props.data.images.length > 0) {
        originalUrl = props.data.images[0].image_url
      } else if (props.data.image_url) {
        originalUrl = props.data.image_url
      }
      
      if (originalUrl) {
        // 清除当前失败的URL
        imageSrc.value = ''
        // 使用原始URL重试
        imageSrc.value = originalUrl
      }
    }, 1000 * retryCount.value) // 递增延迟
  } else {
    imageLoaded.value = false
    imageSrc.value = ''
    loadingText.value = '加载失败'
    retryCount.value = 0
  }
}

const processLoadingQueue = () => {
  if (loadingQueue.length > 0 && currentLoadingCount < maxConcurrentLoads) {
    const nextLoad = loadingQueue.shift()
    nextLoad()
  }
}

// 压缩图片
const compressImage = async (imageUrl) => {
  try {
    loadingText.value = '正在压缩...'
    compressionProgress.value = 10
    
    const compressionOptions = getCompressionConfig()
    
    compressionProgress.value = 30
    
    const compressedUrl = await compressImageFromUrl(imageUrl, {
      ...compressionOptions,
      onProgress: (progress) => {
        compressionProgress.value = 30 + (progress * 0.6) // 30-90%
      }
    })
    
    compressionProgress.value = 100
    return compressedUrl
  } catch (error) {
    console.warn('图片压缩失败，使用原图:', error)
    compressionProgress.value = 100
    return imageUrl
  }
}

const loadImage = async (forceLoad = false) => {
  let imageUrl = null
  
  if (props.data.images && props.data.images.length > 0) {
    imageUrl = props.data.images[0].image_url
  } else if (props.data.image_url) {
    imageUrl = props.data.image_url
  }
  
  if (imageUrl && (!imageSrc.value || forceLoad)) {
    // 如果当前加载数量已达上限，加入队列
    if (currentLoadingCount >= maxConcurrentLoads) {
      loadingQueue.push(() => loadImage(forceLoad))
      return
    }
    
    currentLoadingCount++
    
    try {
      // 生成占位符
      placeholderSrc.value = generatePlaceholder()
      
      // 响应式图片优化：根据设备类型和网络状况添加不同尺寸参数
      const isMobile = deviceType === 'mobile'
      const isTablet = deviceType === 'tablet'
      const isSlowConnection = connectionType === 'slow'
      
      let optimizedUrl = imageUrl
      
      // 优化图片URL参数
      if (imageUrl.includes('http') || imageUrl.includes('/api/')) {
        const separator = imageUrl.includes('?') ? '&' : '?'
        
        if (isMobile) {
          const quality = isSlowConnection ? 30 : 40
          optimizedUrl = `${imageUrl}${separator}w=180&h=250&fit=crop&auto=compress,format&q=${quality}`
        } else if (isTablet) {
          const quality = isSlowConnection ? 35 : 45
          optimizedUrl = `${imageUrl}${separator}w=250&h=350&fit=crop&auto=compress,format&q=${quality}`
        } else {
          const quality = isSlowConnection ? 40 : 50
          optimizedUrl = `${imageUrl}${separator}w=280&h=400&fit=crop&auto=compress,format&q=${quality}`
        }
      }
      
      // 进一步压缩图片（仅在慢网络或移动端）
      if (isSlowConnection || isMobile) {
        optimizedUrl = await compressImage(optimizedUrl)
      }
      
      imageSrc.value = optimizedUrl
      currentLoadingCount--
      processLoadingQueue()
      
    } catch (error) {
      console.error('图片处理失败:', error)
      imageSrc.value = imageUrl // 降级到原图
      currentLoadingCount--
      processLoadingQueue()
    }
  }
}

onMounted(() => {
  // 使用 Intersection Observer 实现懒加载
  if ('IntersectionObserver' in window && thumbRef.value) {
    const isMobile = deviceType === 'mobile'
    const isTablet = deviceType === 'tablet'
    
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersecting.value = true
            
            let delay = 0
            if (isMobile) {
              delay = 5
            } else if (isTablet) {
              delay = 3
            } else {
              delay = 1
            }
            
            setTimeout(() => {
              loadImage()
            }, delay)
            
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: isMobile ? '500px' : isTablet ? '400px' : '350px',
        threshold: 0.001
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 8px;
}

.loading-indicator .loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  animation: spin 1s linear infinite;
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