<template>
  <article class="thumb img-area" ref="thumbRef">
    <a class="thumb-a my-photo">
      <div class="image-container">
        <div v-if="!imageSrc" class="image-placeholder">
          <div class="placeholder-content">
            <div v-if="isIntersecting" class="loading-spinner"></div>
          </div>
        </div>
        <img
          v-if="imageSrc"
          class="thumb-image my-photo"
          ref="imageRef"
          :src="imageSrc"
          @load="onImageLoad"
          @error="onImageError"
          :style="{ opacity: imageLoaded ? 1 : 0.3 }"
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
          <a v-if="thumbnail_show_time && data.time" class="tag-time thumbnail-tag">{{
            data.thumbnail_time
          }}</a>
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

const settingStore = useSettingStore()
const thumbRef = ref(null)
const imageRef = ref(null)
const imageLoaded = ref(false)
const imageSrc = ref('')
const isIntersecting = ref(false)

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

// 懒加载逻辑
let observer = null

const onImageLoad = () => {
  imageLoaded.value = true
  // 手机端性能优化：图片加载完成后移除observer
  if (observer && thumbRef.value) {
    observer.unobserve(thumbRef.value)
  }
}

const onImageError = () => {
  // 图片加载失败时不显示错误图片，保持占位符状态
  imageLoaded.value = false
  imageSrc.value = ''
  console.warn('图片加载失败:', props.data.title)
}

const loadImage = () => {
  // 从images数组中获取第一张图片的image_url
  let imageUrl = null
  
  if (props.data.images && props.data.images.length > 0) {
    imageUrl = props.data.images[0].image_url
  } else if (props.data.image_url) {
    imageUrl = props.data.image_url
  }
  
  if (imageUrl && !imageSrc.value) {
    // 响应式图片优化：根据设备类型添加不同尺寸参数
    const isMobile = window.innerWidth <= 768
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768
    
    if (imageUrl.includes('http')) {
      // 如果是外部图片URL，根据设备类型添加优化参数
      const separator = imageUrl.includes('?') ? '&' : '?'
      if (isMobile) {
        imageUrl = `${imageUrl}${separator}w=400&h=600&fit=crop&auto=compress,format&q=75`
      } else if (isTablet) {
        imageUrl = `${imageUrl}${separator}w=600&h=800&fit=crop&auto=compress,format&q=80`
      } else {
        // 电脑端优化：适中的压缩以平衡质量和加载速度
        imageUrl = `${imageUrl}${separator}w=800&h=1000&fit=crop&auto=compress,format&q=85`
      }
    }
    
    // 预加载图片以确保加载成功
    const img = new Image()
    img.onload = () => {
      imageSrc.value = imageUrl
    }
    img.onerror = () => {
      console.warn('图片加载失败:', imageUrl)
    }
    img.src = imageUrl
  }
}

onMounted(() => {
  // 使用 Intersection Observer 实现懒加载
  if ('IntersectionObserver' in window && thumbRef.value) {
    // 响应式优化的Intersection Observer配置
    const isMobile = window.innerWidth <= 768
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768
    
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersecting.value = true
            // 根据设备类型优化加载延迟
            let delay = 0
            if (isMobile) {
              delay = Math.random() * 100 + 50 // 手机端：50-150ms随机延迟
            } else if (isTablet) {
              delay = Math.random() * 50 + 25 // 平板端：25-75ms随机延迟
            } else {
              delay = Math.random() * 30 + 10 // 电脑端：10-40ms随机延迟，更快响应
            }
            
            setTimeout(() => {
              loadImage()
            }, delay)
            // 图片开始加载后取消观察
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: isMobile ? '100px' : isTablet ? '75px' : '50px', // 电脑端适中的预加载距离
        threshold: isMobile ? 0.05 : isTablet ? 0.1 : 0.2 // 电脑端更精确的触发阈值
      }
    )
    observer.observe(thumbRef.value)
  } else {
    // 降级处理：直接加载图片
    isIntersecting.value = true
    loadImage()
  }
})

onUnmounted(() => {
  if (observer && thumbRef.value) {
    observer.unobserve(thumbRef.value)
  }
})
</script>
<style>
.thumb .detail-tag {
  display: none;
}

/* 图片容器和占位符样式 */
.image-container {
  position: relative;
  width: 100%;
  background: #333333;
  border-radius: 8px;
  overflow: hidden;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 手机端图片容器优化 */
@media screen and (max-width: 768px) {
  .image-placeholder {
    height: 150px; /* 减少占位符高度 */
    background: #e8eaed;
  }
  
  .image-container {
    border-radius: 6px;
  }
}

@media screen and (max-width: 480px) {
  .image-placeholder {
    height: 120px;
  }
  
  .image-container {
    border-radius: 4px;
  }
}

.placeholder-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
  will-change: transform;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.thumb-image {
  width: 100%;
  height: auto;
  display: block;
  transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  object-fit: cover;
  border-radius: 8px;
  will-change: opacity, transform;
  transform: translateZ(0);
  /* 图片渲染优化 */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  backface-visibility: hidden;
}

/* 电脑端图片优化 */
@media screen and (min-width: 1025px) {
  .thumb-image {
    /* 电脑端更平滑的过渡效果 */
    transition: opacity 0.2s ease, transform 0.2s ease;
    image-rendering: auto; /* 电脑端使用默认渲染以获得更好质量 */
  }
  
  .image-container:hover .thumb-image {
    transform: translateZ(0) scale(1.02); /* 轻微的悬停缩放效果 */
  }
}

/* 平板端图片优化 */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .thumb-image {
    transition: opacity 0.25s ease;
    image-rendering: -webkit-optimize-contrast;
  }
}

.thumb:hover .thumb-image {
  transform: translateZ(0) scale(0.98);
}

.thumb-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  padding: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 3;
}

.thumb:hover .thumb-overlay {
  opacity: 1;
}

.thumb-overlay .thumb-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.75em;
  margin: 4px 0;
  line-height: 1.2;
}

.thumb-overlay .tags {
  margin: 8px 0 0 0;
  padding: 0;
  list-style: none;
}

.thumb-overlay .tag-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.thumb-overlay .thumbnail-tag,
.thumb-overlay .tag-categories a {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7em;
  text-decoration: none;
  transition: background 0.2s ease;
}

.thumb-overlay .thumbnail-tag:hover,
.thumb-overlay .tag-categories a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-content .caption .thumb-desc {
  padding-top: 5px;
  display: block;
}

.lightbox-content .thumbnail-tag {
  display: none;
}

.lightbox-content .caption ul.tags {
  margin-bottom: 0.6em;
}

.lightbox-content .caption .breadcrumb-nav {
  margin-bottom: 0.6em;
}

.thumb-image {
  border: 0;
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  cursor: pointer;
  outline: 0px;
  border-radius: 0;
}

@media (max-width: 768px) {
  .thumb-image {
    background-image: url(/assets/20200212-6dafa53ecf4e3.gif);
    background-size: 100% 100%;
  }
}

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .thumb-image {
    background-image: url(/assets/20200212-38ce26bb0bd0d.gif);
    background-size: 100% 100%;
  }
}

@media only screen and (device-width: 375px) and (device-height: 667px) {
  .thumb-image {
    background-image: url(/assets/20200212-e056a5f2914d6.gif);
    background-size: 100% 100%;
  }
}

#blog-main .thumb:after {
  background-image: linear-gradient(to top, rgba(10, 17, 25, 0.35) 5%, rgba(10, 17, 25, 0) 35%);
  pointer-events: none;
  background-size: cover;
  content: '';
  display: block;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

#blog-main .thumb .thumb-title {
  pointer-events: none;
  font-size: 0.85em;
  color: white;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 4px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

#blog-main .thumb {
  transition: opacity 0.3s ease-in-out, transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  opacity: 1;
  pointer-events: auto;
  overflow: hidden;
  position: relative;
  margin: 0 0 10px 0;
  box-sizing: border-box;
  display: block;
  width: 100%;
  border-radius: 8px;
  box-shadow: none;
  break-inside: avoid;
  page-break-inside: avoid;
  /* 优化渲染性能 */
  contain: layout style paint;
  will-change: transform;
}

/* 电脑端缩略图优化 */
@media screen and (min-width: 1025px) {
  #blog-main .thumb {
    /* 电脑端更快的过渡效果 */
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    /* 启用硬件加速 */
    transform: translateZ(0);
  }
  
  #blog-main .thumb:hover {
    transform: translateZ(0) scale(0.97); /* 电脑端更精细的悬停效果 */
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
}

/* 平板端缩略图优化 */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  #blog-main .thumb {
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    margin: 0 0 12px 0;
  }
  
  #blog-main .thumb:hover {
    transform: scale(0.98);
  }
}

/* 手机端缩略图优化 */
@media screen and (max-width: 768px) {
  #blog-main .thumb {
    margin: 0 0 8px 0;
    border-radius: 6px;
    /* 减少动画以提升性能 */
    transition: transform 0.15s ease;
  }
  
  #blog-main .thumb:hover {
    transform: scale(0.99); /* 减少缩放效果 */
  }
}

@media screen and (max-width: 480px) {
  #blog-main .thumb {
    margin: 0 0 6px 0;
    border-radius: 4px;
  }
}

#blog-main .thumb:hover {
  transform: scale(0.98);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  background-color: #333333;
}

body.is-preload #blog-main .thumb {
  pointer-events: none;
  opacity: 0;
}

/* 动画延迟效果 */
#blog-main .thumb:nth-child(1) {
  transition-delay: 0.1s;
}
#blog-main .thumb:nth-child(2) {
  transition-delay: 0.2s;
}
#blog-main .thumb:nth-child(3) {
  transition-delay: 0.3s;
}
#blog-main .thumb:nth-child(4) {
  transition-delay: 0.4s;
}
#blog-main .thumb:nth-child(5) {
  transition-delay: 0.5s;
}
#blog-main .thumb:nth-child(6) {
  transition-delay: 0.6s;
}
#blog-main .thumb:nth-child(7) {
  transition-delay: 0.7s;
}
#blog-main .thumb:nth-child(8) {
  transition-delay: 0.8s;
}
#blog-main .thumb:nth-child(9) {
  transition-delay: 0.9s;
}
#blog-main .thumb:nth-child(10) {
  transition-delay: 1s;
}
#blog-main .thumb:nth-child(11) {
  transition-delay: 1.1s;
}
#blog-main .thumb:nth-child(12) {
  transition-delay: 1.2s;
}
</style>
