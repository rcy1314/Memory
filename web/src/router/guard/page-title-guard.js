import { useSettingStore } from '@/store'
import { isValueNotEmpty } from '@/utils'
export function createPageTitleGuard(router) {
  router.afterEach(async (to) => {
    const settingStore = useSettingStore()
    // 确保设置数据已加载
    if (!settingStore.metaSetting || Object.keys(settingStore.metaSetting).length === 0) {
      await settingStore.getMetaSetting()
    }
    const baseTitle = isValueNotEmpty(settingStore.metaSetting?.site_name)
      ? settingStore.metaSetting?.site_name
      : import.meta.env.VITE_TITLE
    const splitter = isValueNotEmpty(settingStore.metaSetting?.site_splitter)
      ? settingStore.metaSetting?.site_splitter
      : import.meta.env.VITE_TITLE_SPLITTER
    const pageTitle = to.meta?.title
    if (pageTitle) {
      document.title = `${pageTitle} ${splitter} ${baseTitle}`
    } else {
      document.title = baseTitle
    }
  })
}
