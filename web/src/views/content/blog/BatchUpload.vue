<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  NButton,
  NCard,
  NDatePicker,
  NForm,
  NFormItem,
  NInput,
  NSwitch,
  NTreeSelect,
  NUpload,
  NUploadDragger,
  NImage,
  NPopconfirm,
  NSpace,
  NGrid,
  NGridItem,
  NAutoComplete,
  NModal,
  NSelect,
  useMessage,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useSettingStore } from '@/store'
import { formatDateTime, isValueNotEmpty } from '@/utils'
import TheIcon from '@/components/icon/TheIcon.vue'
import api from '@/api'
import * as exifr from 'exifr'

const { t } = useI18n()
const message = useMessage()
const settingStore = useSettingStore()

// 存储设置
const isLocalStorage = computed(() => settingStore.storageSetting?.storage_type === 'local')
const enableStorage = computed(() => settingStore.storageSetting?.enable_storage)
const timeoutTime = computed(() => 
  isValueNotEmpty(settingStore.storageSetting?.timeout_time)
    ? settingStore.storageSetting?.timeout_time
    : import.meta.env.VITE_TIMEOUT_TIME
)

// 缩略图和详情图后缀
const thumbnailSuffix = computed(() => 
  isValueNotEmpty(settingStore.contentSetting?.thumbnail_suffix)
    ? settingStore.contentSetting?.thumbnail_suffix
    : ''
)
const detailSuffix = computed(() => 
  isValueNotEmpty(settingStore.contentSetting?.detail_suffix)
    ? settingStore.contentSetting?.detail_suffix
    : ''
)

// 上传的图片列表
const uploadedImages = ref([])
const uploading = ref(false)
const uploadProgress = ref({})
const hoverIndex = ref(-1)
const showDeleteConfirm = ref({})

// 编辑模态框
const showEditModal = ref(false)
const editingImage = ref(null)
const editingIndex = ref(-1)

// 批量编辑表单
const batchForm = ref({
  category_ids: [],
  is_hidden: false,
  title: '',
  desc: '',
  location: '',
  time: null
})

// 图片压缩选项
const compressionOptions = ref({
  compress_option: 'none', // "80", "60", "lossless", "none"
  output_format: 'original' // "webp", "original"
})

// 批量压缩状态
const batchCompressing = ref(false)
const compressProgress = ref(0)

// 分类选项
const categoryTreeOptions = ref([])
// 地点选项
const locations = ref([])

// 获取分类树
async function getTreeSelect() {
  try {
    const res = await api.getCategories()
    if (res.code === 200) {
      categoryTreeOptions.value = res.data
    }
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

// 获取地点列表
async function getLocations() {
  try {
    const res = await api.getBlogLocations()
    if (res.code === 200) {
      locations.value = res.data.map(e => ({ label: e[0], value: e[0] }))
    }
  } catch (error) {
    console.error('获取地点失败:', error)
  }
}

// 自定义上传请求
const customRequest = async ({ file, data, headers, action, onFinish, onError, onProgress }) => {
  const fileId = file.id
  uploadProgress.value[fileId] = 0
  
  try {
    const formData = new FormData()
    if (data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key])
      })
    }
    formData.append('file', file.file)
    
    // 使用用户设置的压缩选项
    formData.append('compress_option', compressionOptions.value.compress_option)
    formData.append('output_format', compressionOptions.value.output_format)
    
    // 显示压缩状态信息
    if (compressionOptions.value.compress_option !== 'none' || compressionOptions.value.output_format !== 'original') {
      message.loading(`正在压缩上传 ${file.name}...`)
    } else {
      message.loading(`正在上传 ${file.name}...`)
    }
    
    const response = await api.uploadImage(
      formData,
      headers,
      (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        uploadProgress.value[fileId] = percent
        if (onProgress && typeof onProgress === 'function') {
          onProgress({ percent })
        }
      },
      timeoutTime.value
    )
    
    console.log('Upload response:', response)
    
    if (response.code === 200) {
      // 添加到已上传图片列表
      // 自动使用文件名（去掉扩展名）作为标题
      const fileName = file.name
      const titleFromFileName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName
      
      const newImage = {
        id: Date.now() + Math.random(),
        image_url: response.data || response.image_url,
        title: titleFromFileName,
        desc: '',
        time: null,
        location: '',
        is_hidden: false,
        metadata: '',
        file_name: file.name,
        file_size: file.file.size,
        is_local: isLocalStorage.value
      }
      
      console.log('Adding image to list:', newImage)
      uploadedImages.value.push(newImage)
      // 初始化删除确认框状态
      showDeleteConfirm.value[uploadedImages.value.length - 1] = false
      console.log('Current uploadedImages:', uploadedImages.value)
      
      // 显示成功消息
      if (compressionOptions.value.compress_option !== 'none' || compressionOptions.value.output_format !== 'original') {
        message.success(`${file.name} 压缩上传成功`)
      } else {
        message.success(`${file.name} 上传成功`)
      }
      
      delete uploadProgress.value[fileId]
      onFinish()
    } else {
      throw new Error(response.msg || '上传失败')
    }
  } catch (error) {
    console.error('Upload error:', error)
    message.error(`${file.name} 上传失败: ` + error.message)
    delete uploadProgress.value[fileId]
    if (onError && typeof onError === 'function') {
      onError()
    }
  }
}

// 删除已上传的图片
const removeUploadedImage = async (index) => {
  const image = uploadedImages.value[index]
  
  // 如果是本地存储，需要删除源文件
  if (image.is_local) {
    try {
      await api.deleteLocalImage({ image_url: image.image_url })
      message.success('本地文件删除成功')
    } catch (error) {
      message.error('删除本地文件失败')
      return
    }
  }
  
  uploadedImages.value.splice(index, 1)
  message.success('图片删除成功')
}

// 获取图片EXIF信息
const fetchImageMetadata = async (image) => {
  try {
    // 对于跨域图片，尝试通过代理或直接访问
    let imageUrl = image.image_url
    
    // 如果是相对路径，转换为绝对路径
    if (!imageUrl.startsWith('http')) {
      imageUrl = new URL(imageUrl, window.location.origin).href
    }
    
    const exifData = await exifr.parse(imageUrl, {
      // 添加跨域处理选项
      httpHeaders: {
        'Access-Control-Allow-Origin': '*'
      },
      // 如果跨域失败，尝试使用fetch
      fetch: async (url) => {
        try {
          const response = await fetch(url, {
            mode: 'cors',
            credentials: 'omit'
          })
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          return response
        } catch (fetchError) {
          // 如果fetch失败，尝试使用代理
          console.warn('直接访问失败，尝试其他方式:', fetchError)
          throw fetchError
        }
      }
    })
    
    if (exifData) {
      image.metadata = JSON.stringify(exifData, null, 2)
      
      // 如果有GPS信息，尝试获取地理位置
      if (exifData.latitude && exifData.longitude) {
        console.log('GPS坐标:', exifData.latitude, exifData.longitude)
      }
      
      // 如果有拍摄时间，自动填充
      if (exifData.DateTimeOriginal) {
        image.time = formatDateTime(new Date(exifData.DateTimeOriginal))
      }
      
      message.success('EXIF信息获取成功')
    } else {
      message.warning('该图片没有EXIF信息')
    }
  } catch (error) {
    console.error('EXIF解析错误:', error)
    
    // 根据错误类型提供更具体的错误信息
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
      message.warning('无法获取EXIF信息：图片跨域访问受限')
    } else if (error.message.includes('HTTP')) {
      message.warning('无法获取EXIF信息：图片访问失败')
    } else {
      message.warning('该图片可能没有EXIF信息或格式不支持')
    }
  }
}

// 批量应用设置到所有图片
const applyBatchSettings = () => {
  uploadedImages.value.forEach(image => {
    if (batchForm.value.category_ids && batchForm.value.category_ids.length > 0) {
      image.category_ids = [...batchForm.value.category_ids]
    }
    if (batchForm.value.is_hidden !== undefined) {
      image.is_hidden = batchForm.value.is_hidden
    }
    if (batchForm.value.title && batchForm.value.title.trim()) {
      // 如果图片已有标题，则在前面添加前缀；否则直接使用前缀作为标题
      if (image.title && image.title.trim()) {
        image.title = batchForm.value.title + ' - ' + image.title
      } else {
        image.title = batchForm.value.title
      }
    }
    if (batchForm.value.desc && batchForm.value.desc.trim()) {
      image.desc = batchForm.value.desc
    }
    if (batchForm.value.location && batchForm.value.location.trim()) {
      image.location = batchForm.value.location
    }
    if (batchForm.value.time) {
      image.time = batchForm.value.time
    }
  })
  message.success('批量设置应用成功')
}

// 保存压缩设置到localStorage
const saveCompressionSettings = () => {
  try {
    localStorage.setItem('batchUploadCompressionSettings', JSON.stringify(compressionOptions.value))
    message.success('压缩设置已保存')
  } catch (error) {
    console.error('保存压缩设置失败:', error)
    message.error('保存压缩设置失败')
  }
}

// 从localStorage加载压缩设置
const loadCompressionSettings = () => {
  try {
    const saved = localStorage.getItem('batchUploadCompressionSettings')
    if (saved) {
      const settings = JSON.parse(saved)
      compressionOptions.value = { ...compressionOptions.value, ...settings }
    }
  } catch (error) {
    console.error('加载压缩设置失败:', error)
  }
}

// 批量压缩并保存图片
const batchCompressAndSave = async () => {
  if (uploadedImages.value.length === 0) {
    message.warning('没有可压缩的图片')
    return
  }

  batchCompressing.value = true
  compressProgress.value = 0
  
  try {
    for (let i = 0; i < uploadedImages.value.length; i++) {
      const image = uploadedImages.value[i]
      
      try {
        // 创建FormData
        const formData = new FormData()
        
        // 从图片URL获取文件
        const response = await fetch(image.image_url)
        const blob = await response.blob()
        const file = new File([blob], `image_${i}.jpg`, { type: blob.type })
        
        formData.append('file', file)
        formData.append('compress_option', compressionOptions.value.compress_option)
        formData.append('output_format', compressionOptions.value.output_format)
        
        // 调用压缩API
        const result = await api.uploadImage(formData)
        
        if (result.code === 200) {
          // 更新图片URL
          image.image_url = result.data.image_url
          compressProgress.value = i + 1
          message.success(`第 ${i + 1} 张图片压缩完成`)
        } else {
          message.error(`第 ${i + 1} 张图片压缩失败: ${result.message}`)
        }
      } catch (error) {
        console.error(`压缩第 ${i + 1} 张图片时出错:`, error)
        message.error(`第 ${i + 1} 张图片压缩失败`)
      }
    }
    
    message.success('批量压缩完成！')
  } catch (error) {
    console.error('批量压缩过程中出错:', error)
    message.error('批量压缩失败')
  } finally {
    batchCompressing.value = false
    compressProgress.value = 0
  }
}

// 保存所有图片为独立博客文章
const saveBatchImages = async () => {
  if (uploadedImages.value.length === 0) {
    message.error('请先上传图片')
    return
  }
  
  try {
    uploading.value = true
    let successCount = 0
    let failCount = 0
    
    // 为每张图片创建独立的博客文章
    for (const image of uploadedImages.value) {
      try {
        const blogData = {
          title: image.title || '未命名图片',
          desc: image.desc || '',
          time: image.time ? new Date(image.time).toISOString() : new Date().toISOString(),
          location: image.location || '',
          category_ids: image.category_ids || batchForm.value.category_ids || [],
          is_hidden: image.is_hidden !== undefined ? image.is_hidden : batchForm.value.is_hidden,
          images: [{
            image_url: image.image_url,
            title: image.title || '未命名图片',
            desc: image.desc || '',
            location: image.location || '',
            is_hidden: image.is_hidden !== undefined ? image.is_hidden : batchForm.value.is_hidden,
            metadata: image.metadata || '',
            order: 0,
            time: image.time ? new Date(image.time).toISOString() : new Date().toISOString()
          }]
        }
        
        const res = await api.createBlog(blogData)
        if (res.code === 200) {
          successCount++
        } else {
          failCount++
        }
      } catch (error) {
        console.error('保存图片失败:', error)
        failCount++
      }
    }
    
    if (successCount > 0) {
      message.success(`成功保存 ${successCount} 张图片${failCount > 0 ? `，失败 ${failCount} 张` : ''}`)
      
      // 清空图片列表
      uploadedImages.value = []
      
      // 重置批量表单
      batchForm.value = {
        category_ids: [],
        is_hidden: false,
        title: '',
        desc: '',
        location: '',
        time: null
      }
      
      // 触发父组件刷新
      emit('refresh')
    } else {
      message.error('所有图片保存失败')
    }
  } catch (error) {
    message.error('批量保存失败')
    console.error('批量保存错误:', error)
  } finally {
    uploading.value = false
  }
}

// 清空所有上传的图片
const clearAll = async () => {
  for (let i = uploadedImages.value.length - 1; i >= 0; i--) {
    await removeUploadedImage(i)
  }
}

// 禁用未来日期
function disablePreviousDate(ts) {
  return ts > Date.now()
}

// 编辑图片
const editImage = (image, index) => {
  editingImage.value = { ...image }
  editingIndex.value = index
  showEditModal.value = true
}

// 保存编辑
const saveEdit = () => {
  if (editingIndex.value >= 0 && editingImage.value) {
    uploadedImages.value[editingIndex.value] = { ...editingImage.value }
    showEditModal.value = false
    editingImage.value = null
    editingIndex.value = -1
    message.success('图片信息已更新')
  }
}

// 取消编辑
const cancelEdit = () => {
  showEditModal.value = false
  editingImage.value = null
  editingIndex.value = -1
}

// 触发上传
const uploadRef = ref(null)
const triggerUpload = () => {
  // 创建一个隐藏的文件输入元素来触发文件选择
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.accept = '.tif,.jpg,.jpeg,.ico,.tiff,.gif,.svg,.jfif,.webp,.png,.bmp,.jpeg,.avif'
  input.onchange = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      customRequest({ file })
    })
  }
  input.click()
}

const emit = defineEmits(['refresh', 'close'])

onMounted(() => {
  getTreeSelect()
  getLocations()
  loadCompressionSettings()
})
</script>

<template>
  <div class="batch-upload-container">
    <NCard title="批量上传" class="mt-4">
    <!-- 已上传图片卡片展示 -->
    <div v-if="uploadedImages.length > 0" class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-5xl font-semibold text-gray-800 dark:text-gray-200">图片列表 ({{ uploadedImages.length }})</h3>
        <NSpace>
          <NPopconfirm @positive-click="clearAll">
            <template #trigger>
              <NButton size="small" type="error">
                <TheIcon icon="material-symbols:delete" :size="16" class="mr-1" />
                清空所有
              </NButton>
            </template>
            确定要清空所有已上传的图片吗？本地存储的文件也会被删除。
          </NPopconfirm>
        </NSpace>
      </div>
      
      <!-- 图片网格 -->
      <div class="image-grid">
        <div
          v-for="(image, index) in uploadedImages"
          :key="image.id"
          class="image-card"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = -1"
        >
          <NImage
            style="width: 100%; height: 100%"
            object-fit="cover"
            width="100%"
            height="100%"
            :src="image.image_url + thumbnailSuffix"
            :preview-src="image.image_url + detailSuffix"
            fallback-src="/assets/error.svg"
            show-toolbar-tooltip
          />
          <div v-if="hoverIndex === index" class="image-actions">
             <NButton size="tiny" text class="image-action" @click="editImage(image, index)">
               <TheIcon
                 icon="material-symbols:edit-outline"
                 :size="18"
                 class="mr-5"
                 color="white"
               />
             </NButton>
             <NButton size="tiny" text class="image-action" @click="fetchImageMetadata(image)">
               <TheIcon
                 icon="material-symbols:info-outline"
                 :size="18"
                 class="mr-5"
                 color="white"
               />
             </NButton>
             <!-- 删除按钮逻辑 -->
             <NButton 
               v-if="!showDeleteConfirm[index]"
               size="tiny" 
               text 
               class="image-action" 
               @click="showDeleteConfirm[index] = true"
             >
               <TheIcon
                 icon="material-symbols:delete-outline"
                 :size="18"
                 class="mr-5"
                 color="white"
               />
             </NButton>
             
             <!-- 确认删除按钮组 -->
             <div v-else class="flex gap-1">
               <NButton 
                 size="tiny" 
                 type="error" 
                 @click="removeUploadedImage(index); showDeleteConfirm[index] = false"
               >
                 确认删除
               </NButton>
               <NButton 
                 size="tiny" 
                 @click="showDeleteConfirm[index] = false"
               >
                 取消
               </NButton>
             </div>
           </div>
          <!-- 隐藏标识 -->
          <div v-if="image.is_hidden" class="absolute top-1 left-1 bg-red-500 text-white text-sm px-1 py-0.5 rounded">
            隐藏
          </div>
        </div>
        <!-- 添加图片按钮 -->
        <div class="image-card add-card" @click="triggerUpload">
          <TheIcon icon="material-symbols:add" :size="28" class="mr-5" />
        </div>
      </div>
    </div>

    <!-- 拖拽上传区域 -->
    <NUpload
      v-if="enableStorage"
      multiple
      directory-dnd
      :custom-request="customRequest"
      accept=".tif,.jpg,.jpeg,.ico,.tiff,.gif,.svg,.jfif,.webp,.png,.bmp,.jpeg,.avif"
      :show-file-list="false"
      class="mb-4"
    >
      <NUploadDragger>
        <div style="margin-bottom: 12px">
          <TheIcon icon="material-symbols:cloud-upload" :size="48" color="#409eff" />
        </div>
        <div class="text-4xl font-medium mb-4">点击或拖拽文件到此区域上传</div>
        <div class="text-2xl text-gray-500">
          支持单个或批量上传，支持 JPG、PNG、GIF、WebP 等格式
          <br>
          当前存储方式：{{ isLocalStorage ? '本地存储' : '云端存储' }}
        </div>
        
        <!-- 上传提示信息 -->
        <div class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
          <div class="text-lg text-green-700 dark:text-green-300">
            💡 所有图片将使用上方设置的压缩选项进行处理
          </div>
        </div>
      </NUploadDragger>
    </NUpload>
    
    <div v-else class="text-center p-4 bg-gray-800 text-gray-200 rounded mb-4">
      <TheIcon icon="material-symbols:warning" :size="24" color="#f56c6c" class="mb-2" />
      <div class="text-2xl">图片上传功能未启用，请先在 <strong>系统管理 → 存储设置</strong> 中开启图片上传功能</div>
    </div>


    <!-- 图片压缩设置 -->
    <NCard title="图片压缩设置" size="small" class="mb-4">
      <div class="mb-4">
        <NGrid :cols="2" :x-gap="12">
          <NGridItem>
            <NFormItem label="压缩质量">
              <NSelect
                v-model:value="compressionOptions.compress_option"
                :options="[
                  { label: '不压缩', value: 'none' },
                  { label: '80% 质量', value: '80' },
                  { label: '60% 质量', value: '60' },
                  { label: '无损压缩', value: 'lossless' }
                ]"
                placeholder="选择压缩质量"
              />
            </NFormItem>
          </NGridItem>
          <NGridItem>
            <NFormItem label="输出格式">
              <NSelect
                v-model:value="compressionOptions.output_format"
                :options="[
                  { label: '保持原格式', value: 'original' },
                  { label: '转换为 WebP', value: 'webp' }
                ]"
                placeholder="选择输出格式"
              />
            </NFormItem>
          </NGridItem>
        </NGrid>
        
        <div class="mt-3 flex gap-2">
          <NButton @click="saveCompressionSettings" type="primary" size="small">
            保存压缩设置
          </NButton>
          <n-button 
            v-if="uploadedImages.length > 0"
            type="primary" 
            :loading="batchCompressing"
            @click="batchCompressAndSave"
            :disabled="uploadedImages.length === 0"
            size="small"
          >
            <template #icon>
              <TheIcon icon="material-symbols:compress" />
            </template>
            {{ batchCompressing ? `压缩中... (${compressProgress}/${uploadedImages.length})` : '重新压缩所有图片' }}
          </n-button>
        </div>
      </div>
    </NCard>

    <!-- 统一分类设置 -->
    <NCard title="统一参数设置" size="small" class="mb-4">


      <NForm :model="batchForm" label-placement="left" :label-width="80">
        <NGrid :cols="2" :x-gap="12">
          <NGridItem>
            <NFormItem label="分类">
              <NTreeSelect
                v-model:value="batchForm.category_ids"
                multiple
                checkable
                key-field="id"
                label-field="name"
                :options="categoryTreeOptions"
                default-expand-all
                placeholder="选择分类（可选）"
                @click="getTreeSelect"
              />
            </NFormItem>
          </NGridItem>
          <NGridItem>
             <NFormItem label="默认隐藏">
               <NSwitch v-model:value="batchForm.is_hidden" />

             </NFormItem>
           </NGridItem>
           <NGridItem>
             <NFormItem label="标题前缀">
               <NInput
                 v-model:value="batchForm.title"
                 placeholder="为所有图片添加统一标题前缀（可选）"
                 clearable
               />
             </NFormItem>
           </NGridItem>
           <NGridItem>
             <NFormItem label="描述">
               <NInput
                 v-model:value="batchForm.desc"
                 placeholder="为所有图片添加统一描述（可选）"
                 clearable
               />
             </NFormItem>
           </NGridItem>
           <NGridItem>
             <NFormItem label="拍摄地点">
               <NAutoComplete
                 v-model:value="batchForm.location"
                 :options="locations"
                 placeholder="为所有图片设置统一拍摄地点（可选）"
                 clearable
               />
             </NFormItem>
           </NGridItem>
           <NGridItem>
             <NFormItem label="拍摄时间">
               <NDatePicker
                 v-model:value="batchForm.time"
                 type="datetime"
                 placeholder="为所有图片设置统一拍摄时间（可选）"
                 value-format="yyyy-MM-dd HH:mm:ss"
                 clearable
                 class="w-full"
               />
             </NFormItem>
           </NGridItem>
         </NGrid>
         
         <!-- 应用设置按钮 -->
         <div class="flex justify-end mt-4">
           <NButton
             type="primary"
             ghost
             @click="applyBatchSettings"
             :disabled="uploadedImages.length === 0"
           >
             <TheIcon icon="material-symbols:settings-applications" :size="16" class="mr-1" />
             应用到所有图片
           </NButton>
         </div>
       </NForm>
     </NCard>
     
     <!-- 底部操作按钮 -->
     <div class="flex justify-end gap-3 mt-6 mb-6 p-4 sticky bottom-0 z-10">
       <NButton size="large" @click="$emit('close')">
         取消
       </NButton>
       <NButton
         type="primary"
         size="large"
         :loading="uploading"
         @click="saveBatchImages"
         :disabled="uploadedImages.length === 0"
       >
         <TheIcon icon="material-symbols:save" :size="18" class="mr-2" />
         保存 ({{ uploadedImages.length }})
        </NButton>
      </div>
    </NCard>

    <!-- 编辑图片模态框 -->
  <NModal v-model:show="showEditModal" preset="card" title="编辑图片信息" style="width: 600px;">
    <div v-if="editingImage" class="space-y-4">
      <!-- 图片预览 -->
      <div class="flex justify-center mb-4">
        <NImage
          :src="editingImage.image_url + thumbnailSuffix"
          :preview-src="editingImage.image_url + detailSuffix"
          class="w-48 h-48 object-cover rounded-lg"
          show-toolbar-tooltip
          fallback-src="/assets/error.svg"
        />
      </div>
      
      <!-- 编辑表单 -->
      <NForm label-placement="left" :label-width="80">
        <NFormItem label="图片标题">
          <NInput
            v-model:value="editingImage.title"
            placeholder="图片标题"
            maxlength="50"
            show-count
          />
        </NFormItem>
        
        <NFormItem label="图片描述">
          <NInput
            v-model:value="editingImage.desc"
            type="textarea"
            placeholder="图片描述"
            :rows="3"
          />
        </NFormItem>
        
        <NFormItem label="拍摄时间">
          <NDatePicker
            v-model:value="editingImage.time"
            type="datetime"
            placeholder="拍摄时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :is-date-disabled="disablePreviousDate"
            class="w-full"
          />
        </NFormItem>
        
        <NFormItem label="拍摄地点">
          <NAutoComplete
            v-model:value="editingImage.location"
            :options="locations"
            placeholder="拍摄地点"
            clearable
            filterable
            @search="getLocations"
          />
        </NFormItem>
        
        <NFormItem label="隐藏图片">
          <NSwitch v-model:value="editingImage.is_hidden" />
        </NFormItem>
      </NForm>
    </div>
    
    <template #footer>
      <div class="flex justify-end gap-3">
        <NButton @click="cancelEdit">取消</NButton>
        <NButton type="primary" @click="saveEdit">保存</NButton>
      </div>
    </template>
    </NModal>
  </div>
</template>

<style scoped>
.batch-upload-container {
  min-height: 100vh;
  padding-bottom: 80px;
  overflow-x: hidden;
  overflow-y: auto;
}

/* 自定义滚动条样式 */
.batch-upload-container::-webkit-scrollbar {
  width: 8px;
}

.batch-upload-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.batch-upload-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.batch-upload-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.image-item {
  transition: all 0.3s ease;
}

.image-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.n-upload-dragger {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 20px 15px;
  text-align: center;
  transition: border-color 0.3s ease;
}

.n-upload-dragger:hover {
  border-color: #409eff;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-card {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background-color: #f8f8f8;
}

.image-card .image-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 4px;
}

.image-card .image-action {
  height: 28px;
  width: 28px;
  transition: opacity 0.3s ease-in-out;
}

.image-card .image-action .mr-5 {
  margin: 0px;
}

.image-card .image-action:hover {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
}

.add-card {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
  cursor: pointer;
  color: #999;
  transition: all 0.3s ease;
}

.add-card:hover {
  background-color: #f1f1f1;
}
</style>