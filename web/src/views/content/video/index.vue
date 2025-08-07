<template>
  <div class="video-management">
    <n-card title="视频管理" :bordered="false" size="huge" role="dialog">
      <template #header-extra>
        <n-button type="primary" @click="showAddModal = true">
          <template #icon>
            <n-icon><AddIcon /></n-icon>
          </template>
          添加视频
        </n-button>
      </template>

      <!-- 视频列表 -->
      <div class="video-grid">
        <div
          v-for="(video, index) in videoList"
          :key="video.id || index"
          class="video-item"
        >
          <div class="video-preview" @click="previewVideo(video)">
            <img
              v-if="video.cover_url"
              :src="getProxiedImageUrl(video.cover_url)"
              :alt="video.title"
              class="video-cover"
            />
            <div v-else class="video-placeholder">
              <n-icon size="48" color="#ccc">
                <VideoIcon />
              </n-icon>
            </div>
            <div class="video-overlay">
              <n-icon size="32" color="white">
                <PlayIcon />
              </n-icon>
            </div>
            <div v-if="video.duration" class="video-duration">
              {{ formatDuration(video.duration) }}
            </div>
          </div>
          
          <div class="video-info">
            <div class="video-title">{{ video.title || '无标题' }}</div>
            <div class="video-desc">{{ video.desc || '无描述' }}</div>
            <div class="video-meta">
              <div class="video-type">{{ getVideoTypeLabel(video.video_type) }}</div>
              <div v-if="video.time" class="video-time">{{ formatVideoTime(video.time) }}</div>
              <div v-if="video.location" class="video-location">{{ video.location }}</div>
            </div>
          </div>
          
          <div class="video-actions">
            <n-button size="small" @click="editVideo(video, index)">
              编辑
            </n-button>
            <n-button size="small" type="error" @click="deleteVideo(index)">
              删除
            </n-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <n-empty v-if="videoList.length === 0" description="暂无视频">
        <template #extra>
          <n-button size="small" @click="showAddModal = true">
            添加第一个视频
          </n-button>
        </template>
      </n-empty>
    </n-card>

    <!-- 添加/编辑视频模态框 -->
    <n-modal
      :show="showAddModal"
      @update:show="showAddModal = $event"
      preset="dialog"
      :title="editingIndex !== -1 ? '编辑视频' : '添加视频'"
      style="width: 600px"
    >
      <n-form
        ref="videoFormRef"
        :model="videoForm"
        :rules="videoFormRules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="视频链接" path="video_url">
          <n-input
            v-model:value="videoForm.video_url"
            placeholder="请输入视频直链、Bilibili或YouTube链接"
            @blur="parseVideoUrl"
            @input="onVideoUrlInput"
            clearable
          />
        </n-form-item>
        
        <n-form-item label="视频类型" path="video_type">
          <n-select
            v-model:value="videoForm.video_type"
            :options="videoTypeOptions"
            placeholder="请选择视频类型"
          />
        </n-form-item>
        
        <n-form-item label="封面图片" path="cover_url">
          <n-input
            v-model:value="videoForm.cover_url"
            placeholder="封面图片链接（自动解析或手动输入）"
          />
        </n-form-item>
        
        <n-form-item label="视频标题" path="title">
          <n-input
            v-model:value="videoForm.title"
            placeholder="视频标题（自动解析或手动输入）"
          />
        </n-form-item>
        
        <n-form-item label="视频描述" path="desc">
          <n-input
            v-model:value="videoForm.desc"
            type="textarea"
            placeholder="视频描述（自动解析或手动输入）"
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
        </n-form-item>
        
        <n-form-item label="视频ID" path="video_id">
          <n-input
            v-model:value="videoForm.video_id"
            placeholder="视频ID（自动解析）"
            readonly
          />
        </n-form-item>
        
        <n-form-item label="时长" path="duration">
          <n-input-number
            v-model:value="videoForm.duration"
            placeholder="视频时长（秒）"
            :min="0"
          />
        </n-form-item>
        
        <n-form-item label="排序" path="order">
          <n-input-number
            v-model:value="videoForm.order"
            placeholder="排序值"
            :min="0"
          />
        </n-form-item>
        
        <div
          flex
          style="width: 100%; flex-wrap: nowrap; flex-direction: row; column-gap: 10px"
        >
          <n-form-item label="时间" path="time" style="flex: 1">
            <n-date-picker
              v-model:formatted-value="videoForm.time"
              type="datetime"
              placeholder="可选，留空则使用帖子时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              :is-date-disabled="disablePreviousDate"
            />
          </n-form-item>
          <n-form-item label="地点" path="location" style="flex: 1">
            <n-auto-complete
              v-model:value="videoForm.location"
              :input-props="{
                autocomplete: 'enabled',
              }"
              :options="locations"
              placeholder="可选，留空则使用帖子地点"
              clearable
              filterable
              @search="getLocations"
            />
          </n-form-item>
        </div>
        
        <n-form-item label="分类" path="category_ids">
          <n-tree-select
            v-model:value="videoForm.category_ids"
            :options="categoryOptions"
            multiple
            clearable
            placeholder="选择分类"
            check-strategy="child"
          />
        </n-form-item>
        
        <n-form-item label="是否隐藏">
          <n-switch v-model:value="videoForm.is_hidden" />
        </n-form-item>
      </n-form>
      
      <template #action>
        <n-space>
          <n-button @click="showAddModal = false">取消</n-button>
          <n-button type="primary" @click="saveVideo">保存</n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 视频预览模态框 -->
    <n-modal
      :show="showPreviewModal"
      @update:show="showPreviewModal = $event"
      preset="card"
      title="视频预览"
      style="width: 80%; max-width: 1000px"
    >
      <div v-if="previewVideoData" class="video-preview-container">
        <div class="video-player">
          <video
            v-if="previewVideoData.video_type === 'direct'"
            :src="previewVideoData.video_url"
            controls
            style="width: 100%; height: auto"
          >
            您的浏览器不支持视频播放。
          </video>
          
          <iframe
            v-else-if="previewVideoData.video_type === 'bilibili'"
            :src="getBilibiliEmbedUrl(previewVideoData.video_id)"
            style="width: 100%; height: 500px; border: none"
            allowfullscreen
          ></iframe>
          
          <iframe
            v-else-if="previewVideoData.video_type === 'youtube'"
            :src="getYouTubeEmbedUrl(previewVideoData.video_id)"
            style="width: 100%; height: 500px; border: none"
            allowfullscreen
          ></iframe>
        </div>
        
        <div class="video-details">
          <h3>{{ previewVideoData.title }}</h3>
          <p>{{ previewVideoData.desc }}</p>
          <div class="video-meta">
            <span>类型: {{ getVideoTypeLabel(previewVideoData.video_type) }}</span>
            <span v-if="previewVideoData.duration">
              时长: {{ formatDuration(previewVideoData.duration) }}
            </span>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { Add as AddIcon, Videocam as VideoIcon, Play as PlayIcon } from '@vicons/ionicons5'
import api from '@/api'
import { request } from '@/utils'
import { formatDateTime } from '@/utils'

const message = useMessage()

// 响应式数据
const videoList = ref([])
const showAddModal = ref(false)
const showPreviewModal = ref(false)
const editingIndex = ref(-1)
const previewVideoData = ref(null)
const videoFormRef = ref(null)
const categoryOptions = ref([])
const locations = ref([])

// 视频表单
const videoForm = reactive({
  video_url: '',
  video_type: 'direct',
  cover_url: '',
  title: '',
  desc: '',
  video_id: '',
  duration: null,
  order: 0,
  time: null,
  location: '',
  is_hidden: false,
  category_ids: []
})

// 视频类型选项
const videoTypeOptions = [
  { label: '直链视频', value: 'direct' },
  { label: 'Bilibili', value: 'bilibili' },
  { label: 'YouTube', value: 'youtube' }
]

// 表单验证规则
const videoFormRules = {
  video_url: {
    required: true,
    message: '请输入视频链接'
  },
  video_type: {
    required: true,
    message: '请选择视频类型'
  },
  title: {
    required: true,
    message: '请输入视频标题'
  }
}

// 处理封面图片URL，使用代理解决跨域问题
const getProxiedImageUrl = (url) => {
  if (!url) return ''
  // 检查是否是B站或YouTube图片
  if (url.includes('hdslb.com') || url.includes('img.youtube.com')) {
    return `/api/v1/blog/proxy-image?url=${encodeURIComponent(url)}`
  }
  return url
}

// 输入事件调试
const onVideoUrlInput = (value) => {
  console.log('视频链接输入事件触发:', value)
}

// 解析视频链接
const parseVideoUrl = async () => {
  console.log('=== parseVideoUrl 函数被调用 ===')
  console.log('当前 video_url:', videoForm.video_url)
  console.log('video_url 类型:', typeof videoForm.video_url)
  console.log('video_url 长度:', videoForm.video_url?.length)
  
  if (!videoForm.video_url || !videoForm.video_url.trim()) {
    console.log('视频链接为空，跳过解析')
    return
  }
  
  const trimmedUrl = videoForm.video_url.trim()
  console.log('处理后的链接:', trimmedUrl)
  console.log('开始调用API解析视频链接...')
  
  try {
    console.log('准备发送API请求，参数:', { video_url: trimmedUrl })
    const response = await api.parseVideoUrl({
      video_url: trimmedUrl
    })
    
    console.log('API响应完整数据:', response)
    console.log('响应状态码:', response?.code)
    console.log('响应数据:', response?.data)
    
    if (response.code === 200 && response.data) {
      const data = response.data
      console.log('解析到的视频数据:', data)
      
      videoForm.video_type = data.video_type
      videoForm.video_id = data.video_id
      if (data.title) videoForm.title = data.title
      if (data.cover_url) videoForm.cover_url = data.cover_url
      if (data.desc) videoForm.desc = data.desc
      if (data.duration) videoForm.duration = data.duration
      
      console.log('表单数据更新完成:', {
        video_type: videoForm.video_type,
        video_id: videoForm.video_id,
        title: videoForm.title,
        cover_url: videoForm.cover_url
      })
      
      message.success('视频信息解析成功')
      
      // 清除可能的验证错误
      setTimeout(() => {
        videoFormRef.value?.restoreValidation()
      }, 100)
    } else {
      console.error('API返回错误:', response)
      message.error('解析视频链接失败: ' + (response.message || '未知错误'))
    }
  } catch (error) {
    console.error('=== API请求失败 ===')
    console.error('错误对象:', error)
    console.error('错误消息:', error.message)
    console.error('响应状态:', error.response?.status)
    console.error('响应数据:', error.response?.data)
    console.error('请求配置:', error.config)
    message.error('解析视频链接失败: ' + (error.response?.data?.message || error.message || '网络错误'))
  }
}

// 保存视频
const saveVideo = async () => {
  try {
    // 表单验证
    await videoFormRef.value?.validate()
    
    const videoData = { 
      ...videoForm,
      time: new Date().toISOString()
    }
    
    if (editingIndex.value !== -1) {
      // 编辑模式
      const video = videoList.value[editingIndex.value]
      if (!video || !video.id) {
        message.error('视频数据异常，无法更新')
        return
      }
      videoData.id = video.id
      const response = await api.updateVideo(videoData)
      if (response.code === 200) {
        videoList.value[editingIndex.value] = { ...videoData, id: video.id }
        message.success('视频更新成功')
      } else {
        message.error('更新视频失败: ' + (response.message || '未知错误'))
        return
      }
    } else {
      // 添加模式
      const response = await api.createVideo(videoData)
      if (response.code === 200) {
        videoList.value.push({ ...videoData, id: response.data.id })
        message.success('视频添加成功')
      } else {
        message.error('添加视频失败: ' + (response.message || '未知错误'))
        return
      }
    }
    
    resetForm()
    showAddModal.value = false
  } catch (error) {
    console.error('保存视频失败:', error)
    
    // 处理表单验证错误
    if (Array.isArray(error) && error.length > 0) {
      const firstError = error[0]
      if (firstError && firstError.message) {
        message.error('表单验证失败: ' + firstError.message)
      } else {
        message.error('请检查表单输入是否正确')
      }
      return
    }
    
    // 处理API请求错误
    if (error.response?.data?.message) {
      message.error('保存视频失败: ' + error.response.data.message)
    } else if (error.message) {
      message.error('保存视频失败: ' + error.message)
    } else {
      message.error('保存视频失败: 网络错误')
    }
  }
}

// 编辑视频
const editVideo = (video, index) => {
  console.log('编辑视频 - 传入参数:', { video, index })
  console.log('视频对象详情:', video)
  editingIndex.value = index
  
  // 复制视频数据到表单，处理时间字段格式
  const videoData = { ...video }
  if (videoData.time && typeof videoData.time === 'string') {
    // 如果时间是ISO字符串，转换为日期选择器需要的格式
    const date = new Date(videoData.time)
    if (!isNaN(date.getTime())) {
      videoData.time = date.toISOString().slice(0, 19).replace('T', ' ')
    }
  }
  
  Object.assign(videoForm, videoData)
  showAddModal.value = true
}

// 删除视频
const deleteVideo = async (index) => {
  const video = videoList.value[index]
  if (!video.id) {
    videoList.value.splice(index, 1)
    message.success('视频删除成功')
    return
  }
  
  try {
    const response = await api.deleteVideo({
      video_id: video.id
    })
    if (response.code === 200) {
      videoList.value.splice(index, 1)
      message.success('视频删除成功')
    } else {
      message.error('删除视频失败: ' + (response.message || '未知错误'))
    }
  } catch (error) {
    console.error('删除视频失败:', error)
    message.error('删除视频失败: ' + (error.response?.data?.message || error.message || '网络错误'))
  }
}

// 预览视频
const previewVideo = (video) => {
  previewVideoData.value = video
  showPreviewModal.value = true
}

// 重置表单
const resetForm = () => {
  editingIndex.value = -1
  Object.assign(videoForm, {
    video_url: '',
    video_type: 'direct',
    cover_url: '',
    title: '',
    desc: '',
    video_id: '',
    duration: null,
    order: 0,
    time: null,
    location: '',
    is_hidden: false,
    category_ids: []
  })
}

// 获取分类树形选择数据
const getTreeSelect = async () => {
  try {
    const response = await api.getCategories()
    if (response.code === 200) {
      categoryOptions.value = response.data.map(item => ({
        key: item.id,
        label: item.name,
        value: item.id
      }))
    }
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

// 获取地点选项
const getLocations = async () => {
  try {
    const response = await api.getBlogLocations()
    if (response.code === 200) {
      const sortedLocations = response.data
      locations.value = sortedLocations.map((e) => {
        return { label: e[0], value: e[0] }
      })
    }
  } catch (error) {
    console.error('获取地点失败:', error)
  }
}

// 禁用未来日期
const disablePreviousDate = (ts) => {
  return ts > Date.now()
}

// 格式化视频时间显示
const formatVideoTime = (timeStr) => {
  if (!timeStr) return ''
  try {
    const date = new Date(timeStr)
    if (isNaN(date.getTime())) return ''
    return formatDateTime(date, 'YYYY-MM-DD HH:mm')
  } catch (error) {
    console.error('时间格式化失败:', error)
    return ''
  }
}

// 获取视频类型标签
const getVideoTypeLabel = (type) => {
  const option = videoTypeOptions.find(opt => opt.value === type)
  return option ? option.label : type
}

// 格式化时长
const formatDuration = (seconds) => {
  if (!seconds) return ''
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// 获取Bilibili嵌入链接
const getBilibiliEmbedUrl = (videoId) => {
  return `https://player.bilibili.com/player.html?bvid=${videoId}&autoplay=0`
}

// 获取YouTube嵌入链接
const getYouTubeEmbedUrl = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}`
}

// 获取视频列表
const getVideoList = async () => {
  try {
    const response = await api.getVideos({
      page: 1,
      page_size: 100
    })
    console.log('视频列表API响应:', response)
    if (response.code === 200) {
      const videoData = response.data?.list || []
      console.log('视频数据:', videoData)
      videoList.value = videoData
    } else {
      message.error('获取视频列表失败: ' + (response.message || '未知错误'))
    }
  } catch (error) {
    console.error('获取视频列表失败:', error)
    message.error('获取视频列表失败: ' + (error.response?.data?.message || error.message || '网络错误'))
  }
}

// 组件挂载时获取视频列表和分类
onMounted(() => {
  getVideoList()
  getTreeSelect()
  getLocations()
})
</script>

<style scoped>
.video-management {
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 自定义滚动条样式 */
.video-management::-webkit-scrollbar {
  width: 8px;
}

.video-management::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.video-management::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.video-management::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.video-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.video-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.video-preview {
  position: relative;
  width: 100%;
  height: 180px;
  cursor: pointer;
  overflow: hidden;
}

.video-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.video-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-preview:hover .video-overlay {
  opacity: 1;
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.video-info {
  padding: 12px;
}

.video-title {
  font-weight: bold;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-desc {
  color: #666;
  font-size: 12px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.video-type {
  color: #999;
  font-size: 11px;
}

.video-time {
  color: #666;
  font-size: 11px;
}

.video-location {
  color: #666;
  font-size: 11px;
}

.video-actions {
  padding: 8px 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;
}

.video-preview-container {
  max-height: 80vh;
  overflow-y: auto;
}

.video-player {
  margin-bottom: 20px;
}

.video-details h3 {
  margin: 0 0 10px 0;
}

.video-details p {
  margin: 0 0 15px 0;
  color: #666;
}

.video-meta {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 14px;
}
</style>