<script setup>
import { ref, onMounted, nextTick, h } from 'vue'
import {
  NButton,
  NCard,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NSwitch,
  NDatePicker,
  NSpace,
  NTag,
  NPopconfirm,
  NTooltip,
  useMessage,
  useDialog,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import CommonPage from '@/components/page/CommonPage.vue'
import api from '@/api'
import { formatDateTime } from '@/utils'

const { t } = useI18n()
const message = useMessage()
const dialog = useDialog()

// 数据状态
const tokens = ref([])
const loading = ref(false)
const showModal = ref(false)
const modalType = ref('create') // 'create' | 'edit'
const currentToken = ref(null)

// 表单数据
const formRef = ref(null)
const formData = ref({
  name: '',
  is_permanent: true,
  expires_at: null,
  remark: '',
})

// 表单验证规则
const formRules = {
  name: {
    required: true,
    message: '请输入Token名称',
    trigger: ['input', 'blur'],
  },
}

// 表格列定义
const columns = [
  {
    title: 'Token名称',
    key: 'name',
    width: 150,
  },
  {
    title: 'Token值',
    key: 'token',
    width: 200,
    render(row) {
      const maskedToken =
        row.token.substring(0, 8) + '...' + row.token.substring(row.token.length - 8)
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'font-mono overflow-x-auto whitespace-nowrap max-w-full' }, maskedToken),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            ghost: true,
            onClick: () => copyToClipboard(row.token),
          },
          { default: () => '复制' }
        ),
      ])
    },
  },
  {
    title: '类型',
    key: 'is_permanent',
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: row.is_permanent ? 'success' : 'warning',
          size: 'small',
        },
        {
          default: () => (row.is_permanent ? '永久' : '临时'),
        }
      )
    },
  },
  {
    title: '过期时间',
    key: 'expires_at',
    width: 180,
    render(row) {
      if (row.is_permanent) {
        return '永不过期'
      }
      return row.expires_at ? formatDateTime(row.expires_at) : '-'
    },
  },
  {
    title: '状态',
    key: 'is_active',
    width: 100,
    render(row) {
      return h(NSwitch, {
        value: row.is_active,
        onUpdateValue: () => toggleTokenStatus(row),
      })
    },
  },
  {
    title: '最后使用',
    key: 'last_used',
    width: 180,
    render(row) {
      return row.last_used ? formatDateTime(row.last_used) : '从未使用'
    },
  },
  {
    title: '创建时间',
    key: 'created_at',
    width: 180,
    render(row) {
      return formatDateTime(row.created_at)
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    render(row) {
      return h('div', { class: 'flex gap-2' }, [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            ghost: true,
            onClick: () => editToken(row),
          },
          { default: () => '编辑' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'warning',
            ghost: true,
            onClick: () => regenerateToken(row),
          },
          { default: () => '重新生成' }
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => deleteToken(row),
          },
          {
            default: () => '确定删除这个Token吗？',
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  ghost: true,
                },
                { default: () => '删除' }
              ),
          }
        ),
      ])
    },
  },
]

// 获取Token列表
async function fetchTokens() {
  try {
    loading.value = true
    const res = await api.getApiTokens()
    if (res.code === 200) {
      tokens.value = res.data || []
    }
  } catch (error) {
    message.error('获取Token列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 打开创建模态框
function openCreateModal() {
  modalType.value = 'create'
  formData.value = {
    name: '',
    is_permanent: true,
    expires_at: null,
    remark: '',
  }
  showModal.value = true
}

// 编辑Token
function editToken(token) {
  modalType.value = 'edit'
  currentToken.value = token
  formData.value = {
    name: token.name,
    is_permanent: token.is_permanent,
    expires_at: token.expires_at ? new Date(token.expires_at).getTime() : null,
    remark: token.remark || '',
  }
  showModal.value = true
}

// 提交表单
async function handleSubmit() {
  try {
    await formRef.value?.validate()

    const submitData = {
      ...formData.value,
      expires_at: formData.value.expires_at
        ? new Date(formData.value.expires_at).toISOString()
        : null,
    }

    if (modalType.value === 'create') {
      const res = await api.createApiToken(submitData)
      if (res.code === 200) {
        message.success('Token创建成功')
        showModal.value = false
        await fetchTokens()
      }
    } else {
      const res = await api.updateApiToken(currentToken.value.id, submitData)
      if (res.code === 200) {
        message.success('Token更新成功')
        showModal.value = false
        await fetchTokens()
      }
    }
  } catch (error) {
    console.error(error)
  }
}

// 重新生成Token
async function regenerateToken(token) {
  dialog.warning({
    title: '重新生成Token',
    content: '重新生成后，旧的Token将失效，确定继续吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const res = await api.regenerateApiToken(token.id)
        if (res.code === 200) {
          message.success('Token重新生成成功')
          await fetchTokens()
        }
      } catch (error) {
        message.error('Token重新生成失败')
        console.error(error)
      }
    },
  })
}

// 切换Token状态
async function toggleTokenStatus(token) {
  try {
    const res = await api.toggleApiToken(token.id)
    if (res.code === 200) {
      message.success(res.msg || 'Token状态更新成功')
      await fetchTokens()
    }
  } catch (error) {
    message.error('Token状态更新失败')
    console.error(error)
  }
}

// 删除Token
async function deleteToken(token) {
  try {
    const res = await api.deleteApiToken(token.id)
    if (res.code === 200) {
      message.success('Token删除成功')
      await fetchTokens()
    }
  } catch (error) {
    message.error('Token删除失败')
    console.error(error)
  }
}

// 创建默认Token
async function createDefaultToken() {
  try {
    const res = await api.createDefaultApiToken()
    if (res.code === 200) {
      message.success('默认Token创建成功')
      await fetchTokens()
    }
  } catch (error) {
    message.error('默认Token创建失败')
    console.error(error)
  }
}

// 复制到剪贴板
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      message.success('Token已复制到剪贴板')
    })
    .catch(() => {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      message.success('Token已复制到剪贴板')
    })
}

// 页面挂载时获取数据
onMounted(() => {
  fetchTokens()
})
</script>

<template>
  <CommonPage title="Token设置">
    <div class="m-30">
      <!-- 操作按钮 -->
      <div class="mb-4 flex gap-3">
        <NButton type="primary" @click="openCreateModal">
          <template #icon>
            <i class="i-mdi:plus" />
          </template>
          新建Token
        </NButton>
        <NButton type="info" @click="createDefaultToken">
          <template #icon>
            <i class="i-mdi:key-plus" />
          </template>
          创建默认Token
        </NButton>
      </div>

      <!-- Token列表 -->
      <NCard>
        <NDataTable
          :columns="columns"
          :data="tokens"
          :loading="loading"
          :pagination="false"
          :bordered="false"
          size="small"
        />
      </NCard>

      <!-- 创建/编辑模态框 -->
      <NModal
        v-model:show="showModal"
        preset="dialog"
        :title="modalType === 'create' ? '新建Token' : '编辑Token'"
      >
        <NForm ref="formRef" :model="formData" :rules="formRules" label-placement="top">
          <NFormItem label="Token名称" path="name">
            <NInput v-model:value="formData.name" placeholder="请输入Token名称" />
          </NFormItem>

          <NFormItem label="Token类型">
            <NSwitch v-model:value="formData.is_permanent">
              <template #checked>永久有效</template>
              <template #unchecked>临时Token</template>
            </NSwitch>
          </NFormItem>

          <NFormItem v-if="!formData.is_permanent" label="过期时间" path="expires_at">
            <NDatePicker
              v-model:value="formData.expires_at"
              type="datetime"
              placeholder="请选择过期时间"
              style="width: 100%"
            />
          </NFormItem>

          <NFormItem label="备注">
            <NInput
              v-model:value="formData.remark"
              type="textarea"
              placeholder="请输入备注信息（可选）"
              :rows="3"
            />
          </NFormItem>
        </NForm>

        <template #action>
          <NSpace>
            <NButton @click="showModal = false">取消</NButton>
            <NButton type="primary" @click="handleSubmit">
              {{ modalType === 'create' ? '创建' : '更新' }}
            </NButton>
          </NSpace>
        </template>
      </NModal>
    </div>
  </CommonPage>
</template>

<style scoped>
.font-mono {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
