import { defineStore } from 'pinia'
import api from '@/api'

export const useSettingStore = defineStore('setting', {
  state() {
    return {
      _generalSetting: {},
      _metaSetting: {},
      _contentSetting: {},
      _storageSetting: {},
    }
  },
  getters: {
    generalSetting() {
      return this._generalSetting
    },
    metaSetting() {
      return this._metaSetting
    },
    contentSetting() {
      return this._contentSetting
    },
    storageSetting() {
      return this._storageSetting
    },
    totalSetting() {
      return {
        general: this._generalSetting,
        meta: this._metaSetting,
        content: this._contentSetting,
        storage: this._storageSetting,
      }
    },
  },
  actions: {
    async getGeneralSetting() {
      try {
        const res = await api.getGeneralSetting()
        if (res.code === 401) {
          this.logout()
          return
        }
        const { custom_css, custom_js, workbench_desc, workbench_title } = res.data
        this._generalSetting = { custom_css, custom_js, workbench_desc, workbench_title }
        return res.data
      } catch (error) {
        return error
      }
    },
    setGeneralSetting(generalSetting = {}) {
      this._generalSetting = { ...this._generalSetting, ...generalSetting }
    },
    async getMetaSetting() {
      try {
        const res = await api.getMetaSetting()
        if (res.code === 401) {
          this.logout()
          return
        }
        // 使用setMetaSetting方法来确保响应式更新
        if (res.data && typeof res.data === 'object') {
          this.setMetaSetting(res.data)
        }
        return res.data
      } catch (error) {
        return error
      }
    },
    setMetaSetting(metaSetting = {}) {
      this._metaSetting = metaSetting
    },
    async getContentSetting() {
      try {
        const res = await api.getContentSetting()
        console.log('API getContentSetting 响应:', res)
        if (res.code === 401) {
          this.logout()
          return
        }
        // 直接使用整个 res.data 对象，避免遗漏字段
        if (res.data && typeof res.data === 'object') {
          this._contentSetting = { ...res.data }
          console.log('设置 _contentSetting:', this._contentSetting)
        }
        return res.data
      } catch (error) {
        console.error('获取内容设置失败:', error)
        return error
      }
    },
    setContentSetting(contentSetting = {}) {
      this._contentSetting = { ...this._contentSetting, ...contentSetting }
    },
    async getStorageSetting() {
      try {
        const res = await api.getStorageSetting()
        if (res.code === 401) {
          this.logout()
          return
        }
        const {
          endpoint,
          max_size,
          timeout_time,
          region,
          enable_storage,
          access_id,
          secret_key,
          bucket,
          path,
          prefix,
        } = res.data
        this._storageSetting = {
          endpoint,
          max_size,
          enable_storage,
          region,
          timeout_time,
          access_id,
          secret_key,
          bucket,
          path,
          prefix,
        }
        return res.data
      } catch (error) {
        return error
      }
    },
    setStorageSetting(storageSetting = {}) {
      this._storageSetting = { ...this._storageSetting, ...storageSetting }
    },
  },
})
