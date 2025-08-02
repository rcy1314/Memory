import axios from 'axios'
import { resReject, resResolve, reqReject, reqResolve } from './interceptors'

export function createAxios(options = {}) {
  const defaultOptions = {
    timeout: 30000, // 增加到30秒
  }
  const service = axios.create({
    ...defaultOptions,
    ...options,
  })
  service.interceptors.request.use(reqResolve, reqReject)
  service.interceptors.response.use(resResolve, resReject)
  return service
}

export const request = createAxios({
  baseURL: import.meta.env.VITE_BASE_API,
})

// 为图片加载创建专用的长超时实例
export const imageRequest = createAxios({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 60000, // 60秒超时，用于图片加载
})

// 为数据库迁移创建超长超时实例
export const migrationRequest = createAxios({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 300000, // 5分钟超时，用于数据库迁移
})
