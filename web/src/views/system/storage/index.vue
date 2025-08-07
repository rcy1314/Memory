<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NTabPane,
  NTabs,
  NImage,
  NSwitch,
  NInputNumber,
  NRadioGroup,
  NRadio,
  NSpace,
  NDivider,
  NAlert,
  NProgress,
  useMessage,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import CommonPage from '@/components/page/CommonPage.vue'
import { useSettingStore } from '@/store'
import api from '@/api'
import { is } from '~/src/utils'

const { t } = useI18n()
const message = useMessage()
const settingStore = useSettingStore()
const isLoading = ref(false)
const isBackupLoading = ref(false)
const isDbBackupLoading = ref(false)

// 备份进度条状态
const backupProgress = ref({
  show: false,
  percentage: 0,
  status: 'default',
  text: ''
})

const dbBackupProgress = ref({
  show: false,
  percentage: 0,
  status: 'default',
  text: ''
})

// 用户信息的表单
const infoFormRef = ref(null)
const infoForm = ref({
  storage_type: 'local', // 'local' 或 'cloud'
  // 云端存储配置
  enable_storage: false,
  max_size: 0,
  timeout_time: 0,
  endpoint: '',
  region: '',
  access_id: '',
  secret_key: '',
  bucket: '',
  path: '',
  prefix: '',
  suffix: '',
  // 本地存储配置
  local_path: 'images',
  local_prefix: '',
})

// 初始化表单数据
function initFormData() {
  // 使用Object.assign保持响应式
  Object.assign(infoForm.value, {
    storage_type: settingStore.storageSetting.storage_type || 'local',
    enable_storage: settingStore.storageSetting.enable_storage || false,
    max_size: settingStore.storageSetting.max_size || 0,
    timeout_time: settingStore.storageSetting.timeout_time || 0,
    endpoint: settingStore.storageSetting.endpoint || '',
    region: settingStore.storageSetting.region || '',
    access_id: settingStore.storageSetting.access_id || '',
    secret_key: settingStore.storageSetting.secret_key || '',
    bucket: settingStore.storageSetting.bucket || '',
    path: settingStore.storageSetting.path || '',
    prefix: settingStore.storageSetting.prefix || '',
    suffix: settingStore.storageSetting.suffix || '',
    local_path: settingStore.storageSetting.local_path || 'images',
    local_prefix: settingStore.storageSetting.local_prefix || '',
  })
}

// 计算属性：是否为本地存储
const isLocalStorage = computed(() => infoForm.value.storage_type === 'local')

// 备份相册功能
async function backupPhotos() {
  isBackupLoading.value = true
  backupProgress.value = {
    show: true,
    percentage: 0,
    status: 'default',
    text: '正在准备备份...'
  }
  
  try {
    // 模拟进度更新
    const progressInterval = setInterval(() => {
      if (backupProgress.value.percentage < 90) {
        backupProgress.value.percentage += 10
        if (backupProgress.value.percentage <= 30) {
          backupProgress.value.text = '正在扫描图片文件...'
        } else if (backupProgress.value.percentage <= 60) {
          backupProgress.value.text = '正在压缩文件...'
        } else {
          backupProgress.value.text = '正在生成下载包...'
        }
      }
    }, 200)
    
    const response = await api.backupPhotos()
    
    clearInterval(progressInterval)
    backupProgress.value.percentage = 100
    backupProgress.value.text = '备份完成，正在下载...'
    backupProgress.value.status = 'success'
    
    // 创建blob URL并下载
    const blob = new Blob([response.data], { type: 'application/zip' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `photos_backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    message.success('相册备份下载成功')
    
    // 延迟隐藏进度条
    setTimeout(() => {
      backupProgress.value.show = false
    }, 2000)
  } catch (error) {
    backupProgress.value.status = 'error'
    backupProgress.value.text = '备份失败'
    message.error('备份失败：' + (error.response?.data?.detail || error.message || '未知错误'))
    setTimeout(() => {
      backupProgress.value.show = false
    }, 3000)
  } finally {
    isBackupLoading.value = false
  }
}

// 备份数据库功能
async function backupDatabase() {
  isDbBackupLoading.value = true
  dbBackupProgress.value = {
    show: true,
    percentage: 0,
    status: 'default',
    text: '正在准备数据库备份...'
  }
  
  try {
    // 模拟进度更新
    const progressInterval = setInterval(() => {
      if (dbBackupProgress.value.percentage < 90) {
        dbBackupProgress.value.percentage += 15
        if (dbBackupProgress.value.percentage <= 30) {
          dbBackupProgress.value.text = '正在读取数据库...'
        } else if (dbBackupProgress.value.percentage <= 60) {
          dbBackupProgress.value.text = '正在创建备份文件...'
        } else {
          dbBackupProgress.value.text = '正在准备下载...'
        }
      }
    }, 150)
    
    const response = await api.backupDatabase()
    
    clearInterval(progressInterval)
    dbBackupProgress.value.percentage = 100
    dbBackupProgress.value.text = '备份完成，正在下载...'
    dbBackupProgress.value.status = 'success'
    
    // 创建blob URL并下载
    const blob = new Blob([response.data], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `database_backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.db`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    message.success('数据库备份下载成功')
    
    // 延迟隐藏进度条
    setTimeout(() => {
      dbBackupProgress.value.show = false
    }, 2000)
  } catch (error) {
    dbBackupProgress.value.status = 'error'
    dbBackupProgress.value.text = '备份失败'
    message.error('数据库备份失败：' + (error.response?.data?.detail || error.message || '未知错误'))
    setTimeout(() => {
      dbBackupProgress.value.show = false
    }, 3000)
  } finally {
    isDbBackupLoading.value = false
  }
}

// 页面挂载时加载数据
onMounted(async () => {
  // 确保获取最新的设置数据
  await settingStore.getStorageSetting()
  console.log('Storage setting loaded:', settingStore.storageSetting)
  // 初始化表单数据
  initFormData()
  console.log('Storage form data initialized:', infoForm.value)
})

async function updateSetting(verbose) {
  isLoading.value = true
  infoFormRef.value?.validate(async (err) => {
    if (err) {
      isLoading.value = false
      return
    }
    // 使用专用的存储设置更新API
    await api
      .updateStorageSetting(infoForm.value)
      .then(() => {
        settingStore.setStorageSetting(infoForm.value)
        isLoading.value = false
        if (verbose) message.success(t('common.text.save_success'))
      })
      .catch(() => {
        isLoading.value = false
      })
  })
}
const infoFormRules = {}

function handleStorageTypeChange(value) {
  message.success(
    value === 'local' ? '已切换到本地存储' : '已切换到云端存储'
  )
  // 立即更新store状态
  settingStore.setStorageSetting({ storage_type: value })
  updateSetting(false)
}

function handleChange(value) {
  message.success(
    value ? t('views.setting.label_enable_storage') : t('views.setting.label_disable_storage')
  )
  // 立即更新store状态
  settingStore.setStorageSetting({ enable_storage: value })
  updateSetting(false)
}
</script>

<template>
  <CommonPage :title="$t('views.setting.label_storage_setting')">
    <div class="m-30 flex items-center">
      <NForm
        ref="infoFormRef"
        label-placement="top"
        label-align="left"
        label-width="100"
        :model="infoForm"
        :rules="infoFormRules"
        class="w-500"
      >
        <!-- 允许上传图片 -->
        <NFormItem :label="$t('views.setting.label_enable_storage')" path="enable_storage">
          <NSwitch v-model:value="infoForm.enable_storage" clearable @update:value="handleChange" />
        </NFormItem>
        
        <!-- 存储类型选择 -->
        <NFormItem label="存储类型" path="storage_type">
          <NRadioGroup v-model:value="infoForm.storage_type" @update:value="handleStorageTypeChange">
            <NSpace>
              <NRadio value="local">本地存储</NRadio>
              <NRadio value="cloud">云端存储</NRadio>
            </NSpace>
          </NRadioGroup>
        </NFormItem>
        
        <NDivider />
        
        <!-- 本地存储配置 -->
        <template v-if="isLocalStorage">
          <NFormItem label="本地存储路径" path="local_path">
            <NInput
              v-model:value="infoForm.local_path"
              type="text"
              placeholder="图片存储的相对路径，默认为 images"
              clearable
            />
          </NFormItem>
          
          <NFormItem label="URL前缀" path="local_prefix">
            <NInput
              v-model:value="infoForm.local_prefix"
              type="text"
              placeholder="图片访问的URL前缀，默认为程序运行地址"
              clearable
            />
          </NFormItem>
          
          <NAlert type="info" style="margin-bottom: 16px;">
            本地存储模式下，图片将保存到项目根目录下的指定文件夹中，并按时间自动组织URL结构。URL前缀用于组成完整的图片访问链接。
          </NAlert>
          
          <!-- 本地存储备份功能 -->
          <NDivider>备份功能</NDivider>
          
          <NSpace vertical>
            <NFormItem label="备份相册">
              <NSpace vertical style="width: 100%;">
                <NSpace>
                  <NButton 
                    type="primary" 
                    :loading="isBackupLoading" 
                    @click="backupPhotos"
                  >
                    备份相册
                  </NButton>
                  <span class="text-gray-500">检测并打包下载本地上传的所有图片</span>
                </NSpace>
                <NProgress 
                  v-if="backupProgress.show"
                  type="line"
                  :percentage="backupProgress.percentage"
                  :status="backupProgress.status"
                  :show-indicator="true"
                >
                  <template #default="{ percentage }">
                    {{ backupProgress.text || `${percentage}%` }}
                  </template>
                </NProgress>
              </NSpace>
            </NFormItem>
            
            <NFormItem label="备份数据库">
              <NSpace vertical style="width: 100%;">
                <NSpace>
                  <NButton 
                    type="primary" 
                    :loading="isDbBackupLoading" 
                    @click="backupDatabase"
                  >
                    备份数据库
                  </NButton>
                  <span class="text-gray-500">下载本地数据库文件（仅限本地存储模式）</span>
                </NSpace>
                <NProgress 
                  v-if="dbBackupProgress.show"
                  type="line"
                  :percentage="dbBackupProgress.percentage"
                  :status="dbBackupProgress.status"
                  :show-indicator="true"
                >
                  <template #default="{ percentage }">
                    {{ dbBackupProgress.text || `${percentage}%` }}
                  </template>
                </NProgress>
              </NSpace>
            </NFormItem>
          </NSpace>
          
          <NAlert type="warning" style="margin-top: 16px;">
            <strong>备份说明：</strong><br/>
            • 备份相册：将检测设置的默认上传路径下的图片，提供打包下载<br/>
            • 备份数据库：下载的是本地数据库文件，包含所有相册数据和设置信息<br/>
            • 建议定期备份以防数据丢失
          </NAlert>
        </template>
        
        <!-- 云端存储配置 -->
        <template v-else>
          <NFormItem :label="$t('views.setting.label_max_size')" path="max_size">
            <NInputNumber
              v-model:value="infoForm.max_size"
              :precision="2"
              :disabled="!infoForm.enable_storage"
              :placeholder="$t('views.setting.placeholder_max_size')"
              w-500
            >
              <template #suffix> MB </template>
            </NInputNumber>
          </NFormItem>
          <NFormItem :label="$t('views.setting.label_timeout_time')" path="timeout_time">
            <NInputNumber
              v-model:value="infoForm.timeout_time"
              :precision="0"
              :disabled="!infoForm.enable_storage"
              :placeholder="$t('views.setting.placeholder_timeout_time')"
              w-500
            >
              <template #suffix> 秒 </template>
            </NInputNumber>
          </NFormItem>
          <NFormItem :label="$t('views.setting.label_endpoint')" path="endpoint">
            <NInput
              v-model:value="infoForm.endpoint"
              type="text"
              :placeholder="$t('views.setting.placeholder_endpoint')"
              :disabled="!infoForm.enable_storage"
              clearable
            />
          </NFormItem>
          <NFormItem :label="$t('views.setting.label_region')" path="region">
            <NInput
              v-model:value="infoForm.region"
              type="text"
              :placeholder="$t('views.setting.placeholder_region')"
              :disabled="!infoForm.enable_storage"
              clearable
            />
          </NFormItem>
          <NFormItem :label="$t('views.setting.label_access_id')" path="access_id">
            <NInput
              v-model:value="infoForm.access_id"
              type="text"
              :placeholder="$t('views.setting.placeholder_access_id')"
              :disabled="!infoForm.enable_storage"
              clearable
            />
          </NFormItem>
          <NFormItem :label="$t('views.setting.label_secret_key')" path="secret_key">
            <NInput
              v-model:value="infoForm.secret_key"
              type="text"
              :placeholder="$t('views.setting.placeholder_secret_key')"
              :disabled="!infoForm.enable_storage"
              clearable
            />
          </NFormItem>
          <NFormItem :label="$t('views.setting.label_bucket')" path="bucket">
            <NInput
              v-model:value="infoForm.bucket"
              type="text"
              :placeholder="$t('views.setting.placeholder_bucket')"
              :disabled="!infoForm.enable_storage"
              clearable
            />
          </NFormItem>
          <NFormItem :label="$t('views.setting.label_path')" path="path">
            <NInput
              v-model:value="infoForm.path"
              type="text"
              :placeholder="
                $t('views.setting.placeholder_path', {
                  path: '{year}/{month}/{timestamp}_{filename}',
                })
              "
              :disabled="!infoForm.enable_storage"
              clearable
            />
          </NFormItem>
          <NFormItem :label="$t('views.setting.label_prefix')" path="prefix">
            <NInput
              v-model:value="infoForm.prefix"
              type="text"
              :placeholder="$t('views.setting.placeholder_prefix')"
              :disabled="!infoForm.enable_storage"
              clearable
            />
          </NFormItem>
          <NFormItem :label="$t('views.setting.label_suffix')" path="suffix">
            <NInput
              v-model:value="infoForm.suffix"
              type="text"
              :placeholder="$t('views.setting.placeholder_suffix')"
              :disabled="!infoForm.enable_storage"
              clearable
            />
          </NFormItem>
        </template>
        
        <!-- 保存按钮 -->
        <NDivider />
        <NButton type="primary" :loading="isLoading" @click="updateSetting(true)">
          {{ $t('common.buttons.save') }}
        </NButton>
      </NForm>
    </div>
  </CommonPage>
</template>
