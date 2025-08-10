<template>
  <div v-if="isTauriApp" class="backend-control" flex items-center mr-20>
    <!-- 后端状态指示器 -->
    <div 
      class="status-indicator"
      :class="{
        'status-running': backendStatus === 'running',
        'status-stopped': backendStatus === 'stopped',
        'status-loading': backendStatus === 'loading'
      }"
      :title="getStatusText()"
    >
      <div class="status-dot"></div>
    </div>
    
    <!-- 控制按钮 -->
    <n-dropdown 
      :options="dropdownOptions" 
      @select="handleAction"
      placement="bottom-end"
    >
      <n-icon
        size="18"
        style="cursor: pointer"
        :title="'后端服务控制'"
        class="control-icon"
      >
        <icon-mdi:server-network />
      </n-icon>
    </n-dropdown>
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted, onUnmounted } from 'vue'
import { useMessage } from 'naive-ui'
import api from '@/api'

// 检查是否在Tauri环境中
const isTauriApp = ref(false)

// 检查Tauri环境
try {
  if (window.__TAURI__) {
    isTauriApp.value = true
  }
} catch (error) {
  // 非Tauri环境
  isTauriApp.value = false
}

const message = useMessage()
const backendStatus = ref('loading') // 'running', 'stopped', 'loading'
let statusCheckInterval = null

// 下拉菜单选项
const dropdownOptions = computed(() => [
  {
    label: '查看状态',
    key: 'status',
    icon: () => h('i', { class: 'icon-mdi:information-outline' })
  },
  {
    label: backendStatus.value === 'running' ? '重启后端' : '启动后端',
    key: 'restart',
    icon: () => h('i', { class: 'icon-mdi:restart' })
  }
])

// 获取状态文本
function getStatusText() {
  switch (backendStatus.value) {
    case 'running':
      return '后端服务运行中'
    case 'stopped':
      return '后端服务已停止'
    case 'loading':
      return '检查后端状态中...'
    default:
      return '未知状态'
  }
}

// 检查后端状态
async function checkBackendStatus() {
  try {
    const status = await api.getBackendStatus()
    backendStatus.value = status ? 'running' : 'stopped'
  } catch (error) {
    console.error('检查后端状态失败:', error)
    backendStatus.value = 'stopped'
  }
}

// 处理下拉菜单操作
async function handleAction(key) {
  switch (key) {
    case 'status':
      await checkBackendStatus()
      message.info(`后端状态: ${getStatusText()}`)
      break
    case 'restart':
      await handleRestart()
      break
  }
}

// 重启后端
async function handleRestart() {
  try {
    backendStatus.value = 'loading'
    message.loading('正在重启后端服务...', { duration: 0, key: 'restart' })
    
    await api.restartBackend()
    
    // 等待一段时间后检查状态
    setTimeout(async () => {
      await checkBackendStatus()
      message.destroyAll()
      
      if (backendStatus.value === 'running') {
        message.success('后端服务重启成功')
      } else {
        message.warning('后端服务重启完成，但状态检查失败')
      }
    }, 3000)
    
  } catch (error) {
    console.error('重启后端失败:', error)
    message.destroyAll()
    message.error('重启后端失败: ' + (error.message || '未知错误'))
    backendStatus.value = 'stopped'
  }
}

// 组件挂载时开始状态检查
onMounted(() => {
  if (isTauriApp.value) {
    checkBackendStatus()
    // 每30秒检查一次状态
    statusCheckInterval = setInterval(checkBackendStatus, 30000)
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval)
  }
})
</script>

<style scoped>
.backend-control {
  position: relative;
}

.status-indicator {
  position: relative;
  margin-right: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.status-running .status-dot {
  background-color: #52c41a;
  box-shadow: 0 0 6px rgba(82, 196, 26, 0.6);
}

.status-stopped .status-dot {
  background-color: #ff4d4f;
  box-shadow: 0 0 6px rgba(255, 77, 79, 0.6);
}

.status-loading .status-dot {
  background-color: #1890ff;
  box-shadow: 0 0 6px rgba(24, 144, 255, 0.6);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.control-icon {
  transition: all 0.3s ease;
}

.control-icon:hover {
  color: #1890ff;
  transform: scale(1.1);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .backend-control {
    margin-right: 12px;
  }
  
  .status-indicator {
    margin-right: 6px;
  }
  
  .status-dot {
    width: 6px;
    height: 6px;
  }
}
</style>