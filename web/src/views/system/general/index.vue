<script setup>
import { ref, onMounted } from 'vue'
import { NButton, NForm, NFormItem, NInput, NTabPane, NTabs, NImage, useMessage } from 'naive-ui'
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
  workbench_title: '',
  workbench_desc: '',
  custom_css: '',
  custom_js: '',
})

// 初始化表单数据
function initFormData() {
  infoForm.value = {
    workbench_title: settingStore.generalSetting.workbench_title || '',
    workbench_desc: settingStore.generalSetting.workbench_desc || '',
    custom_css: settingStore.generalSetting.custom_css || '',
    custom_js: settingStore.generalSetting.custom_js || '',
  }
}

// 页面挂载时加载数据
onMounted(async () => {
  // 确保获取最新的设置数据
  await settingStore.getGeneralSetting()
  // 初始化表单数据
  initFormData()
})

async function updateSetting() {
  isLoading.value = true
  infoFormRef.value?.validate(async (err) => {
    if (err) {
      isLoading.value = false
      return
    }
    var setting = settingStore.totalSetting
    setting['general'] = infoForm.value
    await api
      .updateSetting(setting)
      .then(() => {
        settingStore.setGeneralSetting(infoForm.value)
        isLoading.value = false
        message.success(t('common.text.save_success'))
      })
      .catch(() => {
          isLoading.value = false
        })
    })
}
const infoFormRules = {

}
</script>

<template>
  <CommonPage :title="$t('views.setting.label_general_setting')">
    <div class="m-30 flex items-center">
      <NForm ref="infoFormRef" label-placement="top" label-align="left" label-width="100" :model="infoForm"
        :rules="infoFormRules" class="w-500">
        <NFormItem :label="$t('views.setting.label_workbench_title')" path="workbench_title">
          <NInput v-model="infoForm.workbench_title" type="text"
            :placeholder="$t('views.setting.placeholder_workbench_title', { username: '{username}' })" />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_workbench_desc')" path="workbench_desc">
          <NInput v-model="infoForm.workbench_desc" type="text"
            :placeholder="$t('views.setting.placeholder_workbench_desc', { username: '{username}' })" />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_custom_css')" path="custom_css">
          <NInput v-model="infoForm.custom_css" type="textarea"
            :placeholder="$t('views.setting.placeholder_custom_css')" />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_custom_js')" path="custom_js">
          <NInput v-model="infoForm.custom_js" type="textarea"
            :placeholder="$t('views.setting.placeholder_custom_js')" />
        </NFormItem>
        <NButton type="primary" :loading="isLoading" @click="updateSetting">
          {{ $t('common.buttons.save') }}
        </NButton>
      </NForm>
    </div>
  </CommonPage>
</template>