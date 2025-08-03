import { getToken } from '@/utils'
import { resolveResError } from './helpers'
import { useUserStore } from '@/store'

export function reqResolve(config) {
  // 处理不需要token的请求
  if (config.noNeedToken) {
    return config
  }

  const token = getToken()
  if (token) {
    config.headers.Authorization = config.headers.Authorization || `Bearer ${token}`
  }

  return config
}

export function reqReject(error) {
  return Promise.reject(error)
}

export function resResolve(response) {
  const { data, status, statusText, config } = response

  // 对于blob类型的响应，直接返回response对象
  if (config.responseType === 'blob') {
    return Promise.resolve(response)
  }

  if (data?.code !== 200) {
    const code = data?.code ?? status
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, data?.msg ?? statusText)
    window.$message?.error(message, { keepAliveOnHover: true })
    return Promise.reject({ code, message, error: data || response })
  }
  return Promise.resolve(data)
}

export async function resReject(error) {
  if (!error || !error.response) {
    const code = error?.code
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, error.message)

    // 检查是否为静默请求（图片加载和数据库迁移相关）
    const isSilentRequest =
      error.config?.silentError ||
      error.config?.url?.includes('/visitor/blog/list') ||
      error.config?.url?.includes('/admin/database/migrate') ||
      error.code === 'ECONNABORTED'

    if (!isSilentRequest) {
      window.$message?.error(message)
    }

    return Promise.reject({ code, message, error })
  }
  const { data, status } = error.response

  if (data?.code === 401) {
    try {
      const userStore = useUserStore()
      userStore.logout()
    } catch (error) {
      return
    }
  }
  // 后端返回的response数据
  const code = data?.code ?? status
  const message = resolveResError(code, data?.msg ?? error.message)
  
  // 检查是否为静默请求（图片加载相关）
  const isSilentRequest =
    error.config?.silentError ||
    error.config?.url?.includes('/visitor/blog/list')

  if (!isSilentRequest) {
    window.$message?.error(message, { keepAliveOnHover: true })
  }

  // 只返回有用的错误信息，避免包含HTML内容
  const errorInfo = typeof data === 'object' && data !== null ? data : { message: error.message }
  return Promise.reject({ code, message, error: errorInfo })
}
