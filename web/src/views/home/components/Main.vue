<template>
  <div id="blog-main" ref="listRef" :class="{ loading: isLoading }">
    <!-- 简化的加载状态 -->
    <div v-if="isLoading" class="gallery-loading-message">
      正在加载图片，请稍后...
    </div>
    
    <!-- 只有在不加载且有数据时才显示图片 -->
    <transition-group v-if="!isLoading && blogs.length > 0" name="fade-slide" tag="div" class="images-container">
      <Image v-for="blog in blogs" :key="blog.id" :data="blog" @click="showImage(blog)" />
    </transition-group>
    

    
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
          <svg v-if="!isLoading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div v-if="isLoading" class="button-loading-spinner"></div>
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
          <svg v-if="!isLoading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 已加载完成提示 -->
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
      <div style="display: inline-block; height: 100%; vertical-align: middle"></div>
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
      >
        <div v-if="!imageVisible" class="lightbox-loading-container">
          <div class="lightbox-spinner"></div>
          <div class="lightbox-loading-text">加载中，请稍后</div>
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
        <span class="closer" style="cursor: pointer; display: block" @click="close"></span>
        <div class="nav-previous" style="display: block" @click.stop="prev"></div>
        <div class="nav-next" style="display: block" @click.stop="next"></div>
      </div>
    </VueFinalModal>
  </div>
</template>

<script setup>
import { throttle } from 'lodash'
import Image from './Image.vue'
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
// 移除isLoadingMore变量，分页模式下不再需要
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
  blog.current_thumbnail = blog.images[0].thumbnail
  blog.current_detail = blog.images[blog.currentIndex].detail
  blog.current_desc = blog.images[blog.currentIndex].desc || blog.desc
  blog.current_title = blog.images[blog.currentIndex].title || blog.title
  blog.current_detail_time = blog.images[blog.currentIndex].detail_time || blog.detail_time
  blog.current_location = blog.images[blog.currentIndex].location || blog.location
  blog.current_metadata = blog.images[blog.currentIndex].metadata
  if (isValueNotEmpty(blog.location)) {
    if (isValueNotEmpty(blog.images[blog.currentIndex].location)) {
      blog.current_full_location = `${blog.location} - ${blog.images[blog.currentIndex].location}`
    } else {
      blog.current_full_location = blog.location
    }
  } else {
    if (isValueNotEmpty(blog.images[blog.currentIndex].location)) {
      blog.current_full_location = blog.images[blog.currentIndex].location
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
    }, 500) // 减少延迟时间，但仍避免影响页面初始加载
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
  const index = blogs.value.findIndex((b) => b.id === currentBlog.value.id)
  if (index > 0) {
    showImage(blogs.value[index - 1])
  }
}
function next() {
  const index = blogs.value.findIndex((b) => b.id === currentBlog.value.id)
  if (index < blogs.value.length - 1) {
    showImage(blogs.value[index + 1])
  }
}
// 预加载图片函数
function preloadImage(imageUrl) {
  if (preloadedImages.value.has(imageUrl)) {
    return Promise.resolve(preloadedImages.value.get(imageUrl))
  }

  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => {
      const imageData = {
        src: img.src,
        width: img.width,
        height: img.height,
      }
      preloadedImages.value.set(imageUrl, imageData)
      resolve(imageData)
    }
    img.onerror = () => {
      resolve(null)
    }
    img.src = imageUrl
  })
}

// 预加载相邻图片
function preloadAdjacentImages(currentIndex) {
  const preloadCount = 2 // 预加载前后各2张图片
  for (
    let i = Math.max(0, currentIndex - preloadCount);
    i <= Math.min(blogs.value.length - 1, currentIndex + preloadCount);
    i++
  ) {
    if (i !== currentIndex && blogs.value[i]) {
      preloadImage(blogs.value[i].current_detail)
    }
  }
}

function showImage(blog) {
  currentBlog.value = blog
  imageVisible.value = false
  imageTransitioning.value = true

  // 检查图片是否已预加载
  const imageUrl = blog.current_detail
  const preloadedData = preloadedImages.value.get(imageUrl)

  if (preloadedData) {
    // 图片已预加载，立即显示
    const maxW = Math.min(1150, window.innerWidth - 40)
    const maxH = Math.min(890, window.innerHeight - 40)
    const ratio = Math.min(maxW / preloadedData.width, maxH / preloadedData.height, 1)
    currentSize.value = {
      width: preloadedData.width * ratio,
      height: preloadedData.height * ratio,
    }
    nextImageUrl.value = preloadedData.src

    setTimeout(() => {
      imageSrc.value = nextImageUrl.value
      imageTransitioning.value = false
      imageVisible.value = true
    }, 300) // 减少延迟时间
  } else {
    // 图片未预加载，正常加载
    setTimeout(() => {
      imageSrc.value = nextImageUrl.value
      imageTransitioning.value = false
      imageVisible.value = true
    }, 1200)

    preloadImage(imageUrl).then((imageData) => {
      if (imageData) {
        const maxW = Math.min(1150, window.innerWidth - 40)
        const maxH = Math.min(890, window.innerHeight - 40)
        const ratio = Math.min(maxW / imageData.width, maxH / imageData.height, 1)
        currentSize.value = {
          width: imageData.width * ratio,
          height: imageData.height * ratio,
        }
        nextImageUrl.value = imageData.src
      }
    })
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
async function getBlogs(silentError = false) {
  try {
    isLoading.value = true

    var params = { page: page, page_size: page_size }
    if (isValueNotEmpty(current_category)) params.category = current_category
    if (isValueNotEmpty(current_location)) params.location = current_location
    const res = await api.getBlogsVisitor(params)

    if (res.code == 200) {
      // 移除强制3秒延迟，改为最小延迟以确保加载状态可见
      await new Promise((resolve) => setTimeout(resolve, 300))

      // 分页模式下，每次都替换数据
      blogs.value = [...res.data]
      isLoading.value = false
      
      formatBlogs()
      page = res.page
      total = res.total
    }
  } catch (e) {
    // 静默处理加载错误，不显示错误提示
    console.log('图片加载失败，静默处理:', e)
    isLoading.value = false
    
    // 如果是首次加载失败，可以尝试重新加载
    if (page === 1 && blogs.value.length === 0 && !silentError) {
      // 延迟1秒后自动重试一次，减少等待时间
      setTimeout(() => {
        if (blogs.value.length === 0) {
          console.log('自动重试加载图片...')
          getBlogs(true) // 重试时使用静默模式
        }
      }, 1000)
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

  // 格式化完成后开始预加载前几张图片
  nextTick(() => {
    setTimeout(() => {
      if (blogs.value.length > 0) {
        // 只预加载前3张图片，减少初始加载压力
        for (let i = 0; i < Math.min(3, blogs.value.length); i++) {
          if (blogs.value[i] && blogs.value[i].current_detail) {
            preloadImage(blogs.value[i].current_detail)
          }
        }
      }
    }, 300) // 进一步减少延迟时间
  })
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
    blogs.value = [] // 清空当前数据
    isLoading.value = true // 设置加载状态
    getBlogs()
    // 滚动到分类栏下方（相册区域开始位置）
    scrollToGallery()
  }
}

// 下一页
function goToNextPage() {
  if (page < Math.ceil(total / page_size) && !isLoading.value) {
    page++
    blogs.value = [] // 清空当前数据
    isLoading.value = true // 设置加载状态
    getBlogs()
    // 滚动到分类栏下方（相册区域开始位置）
    scrollToGallery()
  }
}

// 滚动到相册区域
function scrollToGallery() {
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
    }
  }
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
}

.img {
  object-fit: contain;
  display: block;
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
  backdrop-filter: saturate(180%) blur(10px);
  background: var(--moment-maskbgdeep);
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 20000;
  width: 100%;
  height: 100%;
  text-align: center;
  cursor: pointer;
  display: block;
  opacity: 1;
}

.lightbox-content {
  background: transparent;
  box-shadow: 0 1em 3em 0.5em #00000040;
  cursor: default;
  border-radius: 12px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  z-index: 1;
  cursor: pointer;
  min-width: 150px;
  min-height: 150px;
  width: auto;
  height: auto;
  overflow: hidden;
  /* max-width: 1150px;
    max-height: 890px; */
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
  transition: opacity 0.2s ease-in-out;
  background-image: url(/assets/arrow.svg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 5em;
  cursor: pointer;
  height: 8em;
  margin-top: -4em;
  opacity: 0;
  position: absolute;
  top: 50%;
  width: 6em;
  z-index: 2;
}

.lightbox-content .nav-previous {
  transform: scaleX(-1);
  left: 0;
}

.lightbox-content .nav-next {
  right: 0;
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

.lightbox-content .closer {
  transition: opacity 0.2s ease-in-out;
  background-image: url(/assets/close.svg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 3em;
  height: 5em;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 5em;
  z-index: 2;
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
    column-gap: 12px;
  }
}

@media screen and (max-width: 768px) {
  #blog-main {
    column-count: 2;
    column-gap: 10px;
    padding: 6px;
  }
}

@media screen and (max-width: 480px) {
  #blog-main {
    column-count: 2; /* 改为2列布局 */
    column-gap: 8px;
    padding: 4px;
  }
}

/* 超小屏幕优化 */
@media screen and (max-width: 360px) {
  #blog-main {
    column-count: 2;
    column-gap: 6px;
    padding: 2px;
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
  }

  /* .lightbox-content .closer,
    .lightbox-content .nav-previous,
    .lightbox-content .nav-next {
        display: none !important;
    } */

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

/* 整体相册加载动画 */
/* 加载提示样式 */
.gallery-loading-message {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  width: 100%;
  min-height: 200px;
  height: 30vh;
  color: #666;
  font-size: 16px;
  text-align: center;
}

.button-loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}



/* 加载动画样式 */
.lightbox-loading-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.8);
}

.lightbox-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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

/* 响应式优化 - 确保在所有设备上完美居中 */
@media (max-width: 768px) {
  .gallery-loading-message {
    min-height: 150px;
    height: 25vh;
    padding: 30px 20px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .gallery-loading-message {
    min-height: 120px;
    height: 20vh;
    padding: 20px 15px;
    font-size: 14px;
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
