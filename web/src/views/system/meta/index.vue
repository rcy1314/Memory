<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { NButton, NForm, NFormItem, NInput, NTabPane, NTabs, NImage, NSwitch, NInputNumber, NSpace, NDynamicInput } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import CommonPage from '@/components/page/CommonPage.vue'
import { useSettingStore } from '@/store'
import api from '@/api'
import { is } from '~/src/utils'

const { t } = useI18n()
const settingStore = useSettingStore()
const isLoading = ref(false)

// 用户信息的表单
const infoFormRef = ref(null)
const infoForm = ref({
  site_url: '',
  site_keywords: '',
  site_name: '',
  site_desc: '',
  primary_color: '',
  site_splitter: '',
  site_icon: '',
  site_apple_icon: '',
  bottom_icon: '',
  bottom_desc: '',
  icp: '',
  entries: [{ name: "", icon: "", url: "" }],
  hero_autoplay: true,
  hero_interval: 5000,
  hero_show_indicators: true,
  hero_show_controls: true,
  hero_images: [{ url: "", title: "", description: "" }],
})

// 初始化表单数据
function initFormData() {
  console.log('初始化meta表单数据，metaSetting:', settingStore.metaSetting)
  infoForm.value = {
    site_url: settingStore.metaSetting.site_url || '',
    site_keywords: settingStore.metaSetting.site_keywords || '',
    site_name: settingStore.metaSetting.site_name || '',
    site_desc: settingStore.metaSetting.site_desc || '',
    primary_color: settingStore.metaSetting.primary_color || '',
    site_splitter: settingStore.metaSetting.site_splitter || '',
    site_icon: settingStore.metaSetting.site_icon || '',
    site_apple_icon: settingStore.metaSetting.site_apple_icon || '',
    bottom_icon: settingStore.metaSetting.bottom_icon || '',
    bottom_desc: settingStore.metaSetting.bottom_desc || '',
    icp: settingStore.metaSetting.icp || '',
    entries: settingStore.metaSetting.entries ?? [{ name: "", icon: "", url: "" }],
    hero_autoplay: settingStore.metaSetting.hero_autoplay ?? true,
    hero_interval: settingStore.metaSetting.hero_interval ?? 5000,
    hero_show_indicators: settingStore.metaSetting.hero_show_indicators ?? true,
    hero_show_controls: settingStore.metaSetting.hero_show_controls ?? true,
    hero_images: settingStore.metaSetting.hero_images ?? [{ url: "", title: "", description: "" }],
  }
  console.log('初始化后的meta表单数据:', infoForm.value)
}
async function updateSetting() {
  isLoading.value = true
  infoFormRef.value?.validate(async (err) => {
    if (err) return
    // 使用专用的网站设置更新API
    const setting = {
      meta: infoForm.value
    }
    await api
      .updateMetaSetting(setting)
      .then(() => {
        settingStore.setMetaSetting(infoForm.value)
        isLoading.value = false
        $message.success(t('common.text.save_success'))
      })
      .catch(() => {
        isLoading.value = false
      })
  })
}
const infoFormRules = {

}
function onCreateEntry() {
  return { name: "", icon: "", url: "" };
}

function onCreateHeroImage() {
  return { url: "", title: "", description: "" };
}

const default_primary_color = import.meta.env.VITE_PRIMARY_COLOR

// 页面挂载时加载数据
onMounted(async () => {
  console.log('meta页面挂载，开始获取网站设置数据')
  // 确保获取最新的设置数据
  const result = await settingStore.getMetaSetting()
  console.log('获取网站设置结果:', result)
  console.log('store中的metaSetting:', settingStore.metaSetting)
  // 等待数据获取完成后再初始化表单数据
  await nextTick()
  initFormData()
})
</script>

<template>
  <CommonPage :title="$t('views.setting.label_meta_setting')">
    <div class="m-30 flex items-center">
      <NForm ref="infoFormRef" label-placement="top" label-align="left" label-width="100" :model="infoForm"
        :rules="infoFormRules" class="w-500">
        <NFormItem :label="$t('views.setting.label_site_url')" path="site_url">
          <NInput v-model:value="infoForm.site_url" type="text" :placeholder="$t('views.setting.placeholder_site_url')"
            clearable />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_site_name')" path="site_name">
          <NInput v-model:value="infoForm.site_name" type="text"
            :placeholder="$t('views.setting.placeholder_site_name')" clearable />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_site_splitter')" path="site_splitter">
          <NInput v-model:value="infoForm.site_splitter" type="text"
            :placeholder="$t('views.setting.placeholder_site_splitter')" clearable />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_site_desc')" path="site_desc">
          <NInput v-model:value="infoForm.site_desc" type="text"
            :placeholder="$t('views.setting.placeholder_site_desc')" clearable />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_site_keywords')" path="site_keywords">
          <NInput v-model:value="infoForm.site_keywords" type="text"
            :placeholder="$t('views.setting.placeholder_site_keywords')" clearable />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_site_icon')" path="site_icon">
          <NInput v-model:value="infoForm.site_icon" type="text"
            :placeholder="$t('views.setting.placeholder_site_icon')" clearable />
        </NFormItem>
        <NImage width="50" :src="infoForm.site_icon" v-if="infoForm.site_icon != undefined && infoForm.site_icon != ''"
          class="icon"></NImage>
        <NFormItem :label="$t('views.setting.label_site_apple_icon')" path="site_apple_icon">
          <NInput v-model:value="infoForm.site_apple_icon" type="text"
            :placeholder="$t('views.setting.placeholder_site_apple_icon')" clearable />
        </NFormItem>
        <NImage width="50" :src="infoForm.site_apple_icon"
          v-if="infoForm.site_apple_icon != undefined && infoForm.site_apple_icon != ''" class="icon"></NImage>
        <NFormItem :label="$t('views.setting.label_bottom_icon')" path="bottom_icon">
          <NInput v-model:value="infoForm.bottom_icon" type="text"
            :placeholder="$t('views.setting.placeholder_bottom_icon')" clearable />
        </NFormItem>
        <NImage width="50" :src="infoForm.bottom_icon"
          v-if="infoForm.bottom_icon != undefined && infoForm.bottom_icon != ''" class="icon"></NImage>
        <NFormItem :label="$t('views.setting.label_bottom_desc')" path="bottom_desc">
          <NInput v-model:value="infoForm.bottom_desc" type="text"
            :placeholder="$t('views.setting.placeholder_bottom_desc')" clearable />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_primary_color')" path="primary_color">
          <n-color-picker v-model:value="infoForm.primary_color" :show-alpha="false"
            :default-value="default_primary_color" class="w-200" />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_icp')" path="icp">
          <NInput v-model:value="infoForm.icp" type="text" :placeholder="$t('views.setting.placeholder_icp')"
            clearable />
        </NFormItem>
        <NFormItem :label="$t('views.setting.label_entries')" path="entries" class="w-800">
          <n-dynamic-input v-model:value="infoForm.entries" :on-create="onCreateEntry">
            <template #create-button-default>
              {{ t('views.setting.label_create_entries') }}
            </template>
            <template #default="{ value }">
              <div style="display: flex; align-items: center; width: 100%">
                <n-input v-model:value="value.name" :placeholder="$t('views.setting.placeholder_entry_name')"
                  type="text" style="margin-left: 5px;" />
                <IconPicker v-model:value="value.icon" style="margin-left: 5px;" />
                <n-input v-model:value="value.url" :placeholder="$t('views.setting.placeholder_entry_url')" type="text"
                  style="margin-left: 5px;" />
              </div>
            </template>
          </n-dynamic-input>
        </NFormItem>
        
        <!-- 封面设置 -->
        <NFormItem label="封面自动播放" path="hero_autoplay">
          <NSwitch v-model:value="infoForm.hero_autoplay" />
        </NFormItem>
        
        <NFormItem label="播放间隔(毫秒)" path="hero_interval">
          <NInputNumber v-model:value="infoForm.hero_interval" :min="1000" :max="10000" :step="1000" />
        </NFormItem>
        
        <NFormItem label="显示指示器" path="hero_show_indicators">
          <NSwitch v-model:value="infoForm.hero_show_indicators" />
        </NFormItem>
        
        <NFormItem label="显示控制按钮" path="hero_show_controls">
          <NSwitch v-model:value="infoForm.hero_show_controls" />
        </NFormItem>
        
        <NFormItem label="封面图片" path="hero_images" class="w-800">
          <n-dynamic-input v-model:value="infoForm.hero_images" :on-create="onCreateHeroImage">
            <template #create-button-default>
              添加封面图片
            </template>
            <template #default="{ value }">
              <div style="display: flex; flex-direction: column; width: 100%; gap: 10px;">
                <n-input v-model:value="value.url" placeholder="图片地址" type="text" />
                <n-input v-model:value="value.title" placeholder="图片标题" type="text" />
                <n-input v-model:value="value.description" placeholder="图片描述" type="text" />
                <NImage v-if="value.url" :src="value.url" width="200" class="icon" />
              </div>
            </template>
          </n-dynamic-input>
        </NFormItem>
        <NButton type="primary" :loading="isLoading" @click="updateSetting">
          {{ $t('common.buttons.save') }}
        </NButton>
      </NForm>
    </div>
  </CommonPage>
</template>
<style scoped>
.icon {
  border-radius: 8px;
  margin-bottom: 25px;
}
</style>