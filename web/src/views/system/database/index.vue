<template>
  <CommonPage show-footer title="数据库设置">
    <template #action>
      <div class="flex gap-2">
        <NButton type="primary" :loading="testingConnection" @click="testConnection">
          <TheIcon icon="mdi:database-check" :size="18" class="mr-1" />
          测试连接
        </NButton>
        <NButton type="primary" :loading="saving" @click="saveSettings">
          <TheIcon icon="mdi:content-save" :size="18" class="mr-1" />
          保存设置
        </NButton>
      </div>
    </template>

    <div class="p-4">
      <NAlert type="info" class="mb-4">
        <template #header>使用说明</template>
        <ul class="info-list">
          <li>• <strong>测试连接</strong>：仅验证数据库连接是否正常，不会切换当前使用的数据库</li>
          <li>• <strong>保存设置</strong>：保存数据库配置并立即切换到新数据库（请谨慎操作）</li>
          <li>• <strong>迁移数据</strong>：将当前数据库的数据迁移到目标数据库，并自动切换配置</li>
        </ul>
      </NAlert>
      
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="120px"
      >
        <NFormItem label="数据库类型" path="database_type">
          <NSelect
            v-model:value="formData.database_type"
            :options="databaseTypeOptions"
            placeholder="请选择数据库类型"
            @update:value="onDatabaseTypeChange"
          />
        </NFormItem>

        <!-- SQLite 配置 -->
        <template v-if="formData.database_type === 'sqlite'">
          <NFormItem label="数据库文件路径" path="sqlite_path">
            <NInput v-model:value="formData.sqlite_path" placeholder="请输入SQLite数据库文件路径" />
          </NFormItem>
        </template>

        <!-- Neon 数据库配置 -->
        <template v-if="formData.database_type === 'neon'">
          <NFormItem label="主机地址" path="neon_host">
            <NInput v-model:value="formData.neon_host" placeholder="请输入Neon数据库主机地址" />
          </NFormItem>
          <NFormItem label="端口" path="neon_port">
            <NInputNumber
              v-model:value="formData.neon_port"
              placeholder="请输入端口号"
              :min="1"
              :max="65535"
            />
          </NFormItem>
          <NFormItem label="数据库名" path="neon_database">
            <NInput v-model:value="formData.neon_database" placeholder="请输入数据库名称" />
          </NFormItem>
          <NFormItem label="用户名" path="neon_username">
            <NInput v-model:value="formData.neon_username" placeholder="请输入用户名" />
          </NFormItem>
          <NFormItem label="密码" path="neon_password">
            <NInput
              v-model:value="formData.neon_password"
              type="password"
              placeholder="请输入密码"
              show-password-on="click"
            />
          </NFormItem>
          <NFormItem label="启用SSL" path="neon_ssl">
            <NSwitch v-model:value="formData.neon_ssl" />
          </NFormItem>
        </template>

        <!-- PostgreSQL 数据库配置 -->
        <template v-if="formData.database_type === 'postgresql'">
          <NFormItem label="主机地址" path="postgresql_host">
            <NInput v-model:value="formData.postgresql_host" placeholder="请输入PostgreSQL主机地址" />
          </NFormItem>
          <NFormItem label="端口" path="postgresql_port">
            <NInputNumber
              v-model:value="formData.postgresql_port"
              placeholder="请输入端口号"
              :min="1"
              :max="65535"
            />
          </NFormItem>
          <NFormItem label="数据库名" path="postgresql_database">
            <NInput v-model:value="formData.postgresql_database" placeholder="请输入数据库名称" />
          </NFormItem>
          <NFormItem label="用户名" path="postgresql_username">
            <NInput v-model:value="formData.postgresql_username" placeholder="请输入用户名" />
          </NFormItem>
          <NFormItem label="密码" path="postgresql_password">
            <NInput
              v-model:value="formData.postgresql_password"
              type="password"
              placeholder="请输入密码"
              show-password-on="click"
            />
          </NFormItem>
          <NFormItem label="启用SSL" path="postgresql_ssl">
            <NSwitch v-model:value="formData.postgresql_ssl" />
          </NFormItem>
        </template>

        <!-- MySQL 数据库配置 -->
        <template v-if="formData.database_type === 'mysql'">
          <NFormItem label="主机地址" path="mysql_host">
            <NInput v-model:value="formData.mysql_host" placeholder="请输入MySQL主机地址" />
          </NFormItem>
          <NFormItem label="端口" path="mysql_port">
            <NInputNumber
              v-model:value="formData.mysql_port"
              placeholder="请输入端口号"
              :min="1"
              :max="65535"
            />
          </NFormItem>
          <NFormItem label="数据库名" path="mysql_database">
            <NInput v-model:value="formData.mysql_database" placeholder="请输入数据库名称" />
          </NFormItem>
          <NFormItem label="用户名" path="mysql_username">
            <NInput v-model:value="formData.mysql_username" placeholder="请输入用户名" />
          </NFormItem>
          <NFormItem label="密码" path="mysql_password">
            <NInput
              v-model:value="formData.mysql_password"
              type="password"
              placeholder="请输入密码"
              show-password-on="click"
            />
          </NFormItem>
          <NFormItem label="启用SSL" path="mysql_ssl">
            <NSwitch v-model:value="formData.mysql_ssl" />
          </NFormItem>
        </template>

        <!-- 通用配置 -->
        <NDivider title-placement="left">连接池设置</NDivider>
        <NFormItem label="连接池大小" path="connection_pool_size">
          <NInputNumber
            v-model:value="formData.connection_pool_size"
            placeholder="请输入连接池大小"
            :min="1"
            :max="100"
          />
        </NFormItem>
        <NFormItem label="连接超时(秒)" path="connection_timeout">
          <NInputNumber
            v-model:value="formData.connection_timeout"
            placeholder="请输入连接超时时间"
            :min="1"
            :max="300"
          />
        </NFormItem>
      </NForm>

      <!-- 数据迁移区域 -->
      <NDivider title-placement="left">数据迁移</NDivider>
      <div class="migration-section">
        <NAlert type="warning" class="mb-4">
          <template #header>重要提醒</template>
          数据迁移功能将把当前数据库的数据迁移到上述配置的目标数据库中。请确保：
          <ul class="mt-2 ml-4">
            <li>• 目标数据库连接信息正确</li>
            <li>• 目标数据库为空或可以被覆盖</li>
            <li>• 迁移过程中请勿关闭浏览器</li>
            <li>• 迁移完成后系统将自动重启并切换到新数据库</li>
          </ul>
        </NAlert>
        <div class="flex justify-center">
          <NButton type="warning" :loading="migrating" @click="migrateData" size="large">
            <TheIcon icon="mdi:database-arrow-right" :size="18" class="mr-1" />
            开始迁移数据
          </NButton>
        </div>
      </div>
    </div>
  </CommonPage>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NSwitch,
  NDivider,
  NAlert,
  useMessage,
} from 'naive-ui'
import CommonPage from '@/components/page/CommonPage.vue'
import TheIcon from '@/components/icon/TheIcon.vue'
import api from '@/api'

const message = useMessage()
const formRef = ref(null)
const saving = ref(false)
const testingConnection = ref(false)
const migrating = ref(false)

// 数据库类型选项
const databaseTypeOptions = [
  { label: 'SQLite', value: 'sqlite' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'Neon PostgreSQL', value: 'neon' },
  { label: 'MySQL', value: 'mysql' },
]

// 表单数据
const formData = reactive({
  database_type: 'sqlite',
  // SQLite
  sqlite_path: './data/db.sqlite3',
  // Neon
  neon_host: '',
  neon_port: 5432,
  neon_database: '',
  neon_username: '',
  neon_password: '',
  neon_ssl: true,
  // MySQL
  mysql_host: '',
  mysql_port: 3306,
  mysql_database: '',
  mysql_username: '',
  mysql_password: '',
  mysql_ssl: false,
  // PostgreSQL
  postgresql_host: '',
  postgresql_port: 5432,
  postgresql_database: '',
  postgresql_username: '',
  postgresql_password: '',
  postgresql_ssl: false,
  // 通用
  connection_pool_size: 10,
  connection_timeout: 30,
})

// 表单验证规则
const rules = {
  database_type: {
    required: true,
    message: '请选择数据库类型',
    trigger: 'change',
  },
  sqlite_path: {
    required: true,
    message: '请输入SQLite数据库文件路径',
    trigger: 'blur',
  },
  neon_host: {
    required: true,
    message: '请输入Neon数据库主机地址',
    trigger: 'blur',
  },
  neon_port: {
    required: true,
    type: 'number',
    message: '请输入有效的端口号',
    trigger: 'blur',
  },
  neon_database: {
    required: true,
    message: '请输入数据库名称',
    trigger: 'blur',
  },
  neon_username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  },
  neon_password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
  mysql_host: {
    required: true,
    message: '请输入MySQL主机地址',
    trigger: 'blur',
  },
  mysql_port: {
    required: true,
    type: 'number',
    message: '请输入有效的端口号',
    trigger: 'blur',
  },
  mysql_database: {
    required: true,
    message: '请输入数据库名称',
    trigger: 'blur',
  },
  mysql_username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  },
  mysql_password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
  postgresql_host: {
    required: true,
    message: '请输入PostgreSQL主机地址',
    trigger: 'blur',
  },
  postgresql_port: {
    required: true,
    type: 'number',
    message: '请输入有效的端口号',
    trigger: 'blur',
  },
  postgresql_database: {
    required: true,
    message: '请输入数据库名称',
    trigger: 'blur',
  },
  postgresql_username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  },
  postgresql_password: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  },
  mysql_password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
  connection_pool_size: {
    required: true,
    type: 'number',
    message: '请输入连接池大小',
    trigger: 'blur',
  },
  connection_timeout: {
    required: true,
    type: 'number',
    message: '请输入连接超时时间',
    trigger: 'blur',
  },
}

// 数据库类型改变时的处理
const onDatabaseTypeChange = (value) => {
  // 重置相关字段的验证状态
  if (formRef.value) {
    formRef.value.restoreValidation()
  }
}

// 获取数据库设置
const getDatabaseSettings = async () => {
  try {
    const res = await api.getDatabaseSetting()
    if (res.data) {
      Object.assign(formData, res.data)
    }
  } catch (error) {
    console.error('获取数据库设置失败:', error)
    message.error('获取数据库设置失败')
  }
}

// 保存设置
const saveSettings = async () => {
  try {
    await formRef.value?.validate()
    saving.value = true

    await api.updateDatabaseSetting({ database: formData })
    message.success('数据库设置保存成功')
  } catch (error) {
    console.error('保存数据库设置失败:', error)
    if (error.message) {
      message.error(error.message)
    } else {
      message.error('保存数据库设置失败')
    }
  } finally {
    saving.value = false
  }
}

// 测试连接
const testConnection = async () => {
  try {
    await formRef.value?.validate()
    testingConnection.value = true

    // 将前端字段映射到后端期望的字段
    const testData = {
      db_type: formData.database_type === 'neon' ? 'postgresql' : formData.database_type,
      db_path: formData.database_type === 'sqlite' ? formData.sqlite_path : null,
      host:
        formData.database_type === 'neon'
          ? formData.neon_host
          : formData.database_type === 'postgresql'
          ? formData.postgresql_host
          : formData.database_type === 'mysql'
          ? formData.mysql_host
          : null,
      port:
        formData.database_type === 'neon'
          ? formData.neon_port
          : formData.database_type === 'postgresql'
          ? formData.postgresql_port
          : formData.database_type === 'mysql'
          ? formData.mysql_port
          : null,
      database:
        formData.database_type === 'neon'
          ? formData.neon_database
          : formData.database_type === 'postgresql'
          ? formData.postgresql_database
          : formData.database_type === 'mysql'
          ? formData.mysql_database
          : null,
      username:
        formData.database_type === 'neon'
          ? formData.neon_username
          : formData.database_type === 'postgresql'
          ? formData.postgresql_username
          : formData.database_type === 'mysql'
          ? formData.mysql_username
          : null,
      password:
        formData.database_type === 'neon'
          ? formData.neon_password
          : formData.database_type === 'postgresql'
          ? formData.postgresql_password
          : formData.database_type === 'mysql'
          ? formData.mysql_password
          : null,
      ssl: formData.database_type === 'neon' 
        ? formData.neon_ssl 
        : formData.database_type === 'postgresql'
        ? formData.postgresql_ssl
        : formData.database_type === 'mysql'
        ? formData.mysql_ssl
        : false,
    }

    await api.testDatabaseConnection(testData)
    message.success('数据库连接测试成功')
  } catch (error) {
    console.error('数据库连接测试失败:', error)
    if (error.message) {
      message.error(error.message)
    } else {
      message.error('数据库连接测试失败')
    }
  } finally {
    testingConnection.value = false
  }
}

// 迁移数据
const migrateData = async () => {
  try {
    await formRef.value?.validate()
    migrating.value = true

    // 将前端字段映射到后端期望的字段
    const migrationData = {
      target_db_type: formData.database_type === 'neon' ? 'postgresql' : formData.database_type,
      target_db_path: formData.database_type === 'sqlite' ? formData.sqlite_path : null,
      target_host:
        formData.database_type === 'neon'
          ? formData.neon_host
          : formData.database_type === 'postgresql'
          ? formData.postgresql_host
          : formData.database_type === 'mysql'
          ? formData.mysql_host
          : null,
      target_port:
        formData.database_type === 'neon'
          ? formData.neon_port
          : formData.database_type === 'postgresql'
          ? formData.postgresql_port
          : formData.database_type === 'mysql'
          ? formData.mysql_port
          : null,
      target_database:
        formData.database_type === 'neon'
          ? formData.neon_database
          : formData.database_type === 'postgresql'
          ? formData.postgresql_database
          : formData.database_type === 'mysql'
          ? formData.mysql_database
          : null,
      target_username:
        formData.database_type === 'neon'
          ? formData.neon_username
          : formData.database_type === 'postgresql'
          ? formData.postgresql_username
          : formData.database_type === 'mysql'
          ? formData.mysql_username
          : null,
      target_password:
        formData.database_type === 'neon'
          ? formData.neon_password
          : formData.database_type === 'postgresql'
          ? formData.postgresql_password
          : formData.database_type === 'mysql'
          ? formData.mysql_password
          : null,
      target_ssl: formData.database_type === 'neon' 
        ? formData.neon_ssl 
        : formData.database_type === 'mysql' 
        ? formData.mysql_ssl || false 
        : formData.database_type === 'postgresql' 
        ? formData.postgresql_ssl || false 
        : false,
    }

    await api.migrateDatabaseData(migrationData)
    message.success('数据迁移成功，数据库配置已自动更新')
    
    // 重新加载数据库设置以显示最新配置
    await getDatabaseSettings()
  } catch (error) {
    console.error('数据迁移失败:', error)
    if (error.message) {
      message.error(error.message)
    } else {
      message.error('数据迁移失败')
    }
  } finally {
    migrating.value = false
  }
}

// 页面挂载时加载数据
onMounted(async () => {
  await getDatabaseSettings()
})
</script>

<style scoped>
.p-4 {
  padding: 1rem;
}

.flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

.mr-1 {
  margin-right: 0.25rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.ml-4 {
  margin-left: 1rem;
}

.justify-center {
  justify-content: center;
}

.migration-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.migration-section ul {
  list-style: none;
  padding: 0;
}

.migration-section li {
  margin-bottom: 0.5rem;
  color: #666;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  margin-bottom: 0.5rem;
  color: #666;
}
</style>