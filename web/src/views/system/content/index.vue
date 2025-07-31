<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { NButton, NForm, NFormItem, NInput, NTabPane, NTabs, NImage, NGrid, NInputNumber, NSwitch, NSelect, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import CommonPage from '@/components/page/CommonPage.vue'
import { useSettingStore } from '@/store'
import api from '@/api'
import { is } from '~/src/utils'

const { t } = useI18n()
const message = useMessage()
const settingStore = useSettingStore()
const isLoading = ref(false)

// 用户信息的表单
const infoFormRef = ref(null)
const infoForm = ref({
  page_size: '',
  thumbnail_suffix: '',
  detail_suffix: '',
  thumbnail_show_location: false,
  detail_show_location: false,
  thumbnail_show_time: false,
  thumbnail_time_format: '',
  detail_show_time: false,
  detail_time_format: '',
})

// 初始化表单数据
function initFormData() {
  console.log('初始化表单数据，contentSetting:', settingStore.contentSetting)
  infoForm.value = {
    page_size: settingStore.contentSetting.page_size || '',
    thumbnail_suffix: settingStore.contentSetting.thumbnail_suffix || '',
    detail_suffix: settingStore.contentSetting.detail_suffix || '',
    thumbnail_show_location: settingStore.contentSetting.thumbnail_show_location || false,
    detail_show_location: settingStore.contentSetting.detail_show_location || false,
    thumbnail_show_time: settingStore.contentSetting.thumbnail_show_time || false,
    thumbnail_time_format: settingStore.contentSetting.thumbnail_time_format || '',
    detail_show_time: settingStore.contentSetting.detail_show_time || false,
    detail_time_format: settingStore.contentSetting.detail_time_format || '',
  }
  console.log('初始化后的表单数据:', infoForm.value)
}

// 页面挂载时加载数据
onMounted(async () => {
  console.log('页面挂载，开始获取内容设置数据')
  // 确保获取最新的设置数据
  const result = await settingStore.getContentSetting()
  console.log('获取内容设置结果:', result)
  console.log('store中的contentSetting:', settingStore.contentSetting)
  // 等待数据获取完成后再初始化表单数据
  await nextTick()
  initFormData()
})

async function updateSetting() {
  isLoading.value = true
  infoFormRef.value?.validate(async (err) => {
    if (err) {
      isLoading.value = false
      return
    }
    // 只发送内容设置数据
    const setting = {
      content: infoForm.value
    }
    
    console.log('准备发送的内容设置数据:', setting)
    console.log('表单数据:', infoForm.value)
    
    try {
      const response = await api.updateContentSetting(setting)
      console.log('保存成功响应:', response)
      settingStore.setContentSetting(infoForm.value)
      message.success(t('common.text.save_success'))
    } catch (error) {
      console.error('保存失败:', error)
      message.error('保存失败: ' + (error.message || '未知错误'))
    } finally {
      isLoading.value = false
    }
  })
}
const infoFormRules = {

}
</script>

<template>
  <CommonPage :title="$t('views.setting.label_content_setting')">
    <div class="m-30 flex items-center">
      <NForm ref="infoFormRef" label-placement="top" label-align="left" label-width="100" :model="infoForm"
        :rules="infoFormRules" class="w-500">
        <NFormItem :label="$t('views.setting.label_page_size')" path="page_size">
          <NInputNumber clearable :precision="0" :placeholder="$t('views.setting.placeholder_page_size')"
            v-model="infoForm.page_size" />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_thumbnail_suffix')" path="thumbnail_suffix">
          <NInput v-model:value="infoForm.thumbnail_suffix" type="text"
            :placeholder="$t('views.setting.placeholder_thumbnail_suffix')" clearable />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_detail_suffix')" path="detail_suffix">
          <NInput v-model:value="infoForm.detail_suffix" type="text"
            :placeholder="$t('views.setting.placeholder_detail_suffix')" clearable />
        </NFormItem>

        <NFormItem :label="$t('views.setting.label_thumbnail_show_location')" path="thumbnail_show_location">
          <NSwitch v-model:value="infoForm.thumbnail_show_location" />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_detail_show_location')" path="detail_show_location">
          <NSwitch v-model:value="infoForm.detail_show_location" />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_thumbnail_show_time')" path="thumbnail_show_time">
          <NSwitch v-model:value="infoForm.thumbnail_show_time" />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_thumbnail_time_format')" path="thumbnail_time_format">
          <NInput v-model:value="infoForm.thumbnail_time_format" type="text" :disabled="!infoForm.thumbnail_show_time"
            :placeholder="$t('views.setting.placeholder_thumbnail_time_format')" clearable />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_detail_show_time')" path="detail_show_time">
          <NSwitch v-model:value="infoForm.detail_show_time" />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_detail_time_format')" path="detail_time_format">
          <NInput v-model:value="infoForm.detail_time_format" type="text" :disabled="!infoForm.detail_show_time"
            :placeholder="$t('views.setting.placeholder_detail_time_format')" clearable />
        </NFormItem>
        <NButton type="primary" :loading="isLoading" @click="updateSetting">
          {{ $t('common.buttons.save') }}
        </NButton>
      </NForm>
    </div>
  </CommonPage>
</template>