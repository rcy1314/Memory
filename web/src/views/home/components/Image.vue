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
}

const onImageError = () => {
  // 图片加载失败时不显示错误图片，保持占位符状态
  imageLoaded.value = false
  imageSrc.value = ''
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
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersecting.value = true
            // 添加轻微延迟，优化加载体验
            const delay = Math.random() * 100 + 50 // 50-150ms随机延迟
            setTimeout(() => {
              loadImage()
            }, delay)
            // 图片开始加载后取消观察
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px', // 减少提前加载距离，避免一次性加载太多
        threshold: 0.3 // 增加阈值，确保图片更多进入视口才开始加载
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
