<template>
  <div class="video-item" :class="{ 'video-loading': !videoLoaded }">
    <div class="video-container" @click="$emit('click', data)">
      <!-- 视频封面 -->
      <div class="video-cover">
        <img 
          :src="data.cover_url || data.video_url" 
          :alt="data.title || '视频封面'"
          @load="onCoverLoad"
          @error="onCoverError"
          class="cover-image"
          referrerpolicy="no-referrer"
          crossorigin="anonymous"
        />
        <!-- 播放按钮覆盖层 -->
        <div class="play-overlay">
          <div class="play-button">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <!-- 视频时长显示 -->
        <div v-if="data.duration" class="video-duration">
          {{ formatDuration(data.duration) }}
        </div>
      </div>
      
      <!-- 视频信息 -->
      <div class="video-info">
        <h3 class="video-title">{{ data.title || '无标题' }}</h3>
        <p v-if="data.desc" class="video-desc">{{ data.desc }}</p>
        <div class="video-meta">
          <span v-if="data.time" class="video-time">
            {{ formatTime(data.time) }}
          </span>
          <span v-if="data.location" class="video-location">
            <i class="iconfont icon-map-pin-2-line"></i>
            {{ data.location }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { formatDateTime, parseDateTime } from '@/utils'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'video-loaded'])

const videoLoaded = ref(false)

function onCoverLoad() {
  videoLoaded.value = true
  emit('video-loaded')
}

function onCoverError() {
  console.warn('视频封面加载失败:', props.data.cover_url)
  videoLoaded.value = true
  emit('video-loaded')
}

function formatDuration(seconds) {
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatTime(timeStr) {
  try {
    const time = parseDateTime(timeStr)
    return formatDateTime(time, 'YYYY年M月D日')
  } catch (e) {
    return timeStr
  }
}

onMounted(() => {
  // 组件挂载后触发加载事件
  setTimeout(() => {
    if (!videoLoaded.value) {
      videoLoaded.value = true
      emit('video-loaded')
    }
  }, 100)
})
</script>

<style scoped>
.video-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.video-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.video-loading {
  opacity: 0.7;
}

.video-container {
  position: relative;
  width: 100%;
}

.video-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: #000;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-item:hover .cover-image {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  z-index: 3;
}

.video-item:hover .play-overlay {
  top: 8px;
  right: 8px;
  left: auto;
  bottom: auto;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.play-button {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  transition: all 0.3s ease;
  transform: scale(0.8);
}

.video-item:hover .play-button {
  width: 32px;
  height: 32px;
  transform: scale(1);
  background: rgba(255, 255, 255, 1);
}

.video-item:hover .play-button svg {
  width: 16px;
  height: 16px;
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.video-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.video-item:hover .video-info {
  opacity: 1;
}

.video-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.video-desc {
  font-size: 12px;
  color: #fff;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.video-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.video-time,
.video-location {
  display: flex;
  align-items: center;
  gap: 4px;
}

.video-location i {
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-info {
    padding: 8px;
  }
  
  .video-title {
    font-size: 13px;
  }
  
  .video-desc {
    font-size: 11px;
  }
  
  .play-button {
    width: 48px;
    height: 48px;
  }
  
  .play-button svg {
    width: 32px;
    height: 32px;
  }
}
</style>