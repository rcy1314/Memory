/**
 * 高级图片优化工具 - 专门针对大文件和慢加载优化
 * 提供渐进式加载、智能压缩、文件大小检测等功能
 */

/**
 * 检测图片文件大小（通过HEAD请求）
 * @param {string} imageUrl - 图片URL
 * @returns {Promise<number>} 文件大小（字节）
 */
export const getImageFileSize = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' })
    const contentLength = response.headers.get('content-length')
    return contentLength ? parseInt(contentLength, 10) : 0
  } catch (error) {
    console.warn('无法获取图片文件大小:', error)
    return 0
  }
}

/**
 * 根据文件大小智能调整压缩参数
 * @param {number} fileSize - 文件大小（字节）
 * @param {string} deviceType - 设备类型
 * @param {string} connectionType - 网络类型
 * @returns {Object} 优化参数
 */
export const getSmartCompressionParams = (
  fileSize,
  deviceType = 'desktop',
  connectionType = 'fast'
) => {
  const fileSizeMB = fileSize / (1024 * 1024)

  // 基础参数
  let quality = 70
  let maxWidth = 1920
  let maxHeight = 1080
  let progressive = false

  // 根据文件大小调整
  if (fileSizeMB > 5) {
    // 超大文件（>5MB）
    quality = connectionType === 'slow' ? 35 : 45
    maxWidth = deviceType === 'mobile' ? 800 : 1200
    maxHeight = deviceType === 'mobile' ? 1200 : 1600
    progressive = true
  } else if (fileSizeMB > 2) {
    // 大文件（2-5MB）
    quality = connectionType === 'slow' ? 45 : 55
    maxWidth = deviceType === 'mobile' ? 1000 : 1400
    maxHeight = deviceType === 'mobile' ? 1400 : 1800
    progressive = true
  } else if (fileSizeMB > 1) {
    // 中等文件（1-2MB）
    quality = connectionType === 'slow' ? 55 : 65
    maxWidth = deviceType === 'mobile' ? 1200 : 1600
    maxHeight = deviceType === 'mobile' ? 1600 : 2000
    progressive = connectionType === 'slow'
  } else {
    // 小文件（<1MB）
    quality = connectionType === 'slow' ? 65 : 75
    maxWidth = deviceType === 'mobile' ? 1400 : 1800
    maxHeight = deviceType === 'mobile' ? 1800 : 2200
  }

  // 设备特定调整
  if (deviceType === 'mobile') {
    quality = Math.max(30, quality - 10) // 移动端降低质量
    maxWidth = Math.min(maxWidth, 1200) // 限制最大宽度
    maxHeight = Math.min(maxHeight, 1600) // 限制最大高度
  }

  return {
    quality,
    maxWidth,
    maxHeight,
    progressive,
    fileSizeMB,
  }
}

/**
 * 生成智能优化的图片URL
 * @param {string} originalUrl - 原始图片URL
 * @param {Object} options - 选项
 * @returns {Promise<string>} 优化后的URL
 */
export const generateSmartImageUrl = async (originalUrl, options = {}) => {
  if (!originalUrl || (!originalUrl.includes('http') && !originalUrl.includes('/api/'))) {
    return originalUrl
  }

  const { deviceType = 'desktop', connectionType = 'fast', forceCheck = false } = options

  try {
    // 检测文件大小（可选）
    let fileSize = 0
    if (forceCheck || connectionType === 'slow') {
      fileSize = await getImageFileSize(originalUrl)
    }

    // 获取智能压缩参数
    const params = getSmartCompressionParams(fileSize, deviceType, connectionType)

    const separator = originalUrl.includes('?') ? '&' : '?'
    const urlParams = [
      'auto=compress,format',
      `q=${params.quality}`,
      `w=${params.maxWidth}`,
      `h=${params.maxHeight}`,
      'fit=inside',
      'dpr=1',
    ]

    // 添加渐进式JPEG支持
    if (params.progressive) {
      urlParams.push('fm=pjpg') // Progressive JPEG
    }

    return `${originalUrl}${separator}${urlParams.join('&')}`
  } catch (error) {
    console.warn('智能图片URL生成失败，使用原始URL:', error)
    return originalUrl
  }
}

/**
 * 生成多级渐进式加载URL数组
 * @param {string} originalUrl - 原始图片URL
 * @param {Object} options - 选项
 * @returns {Promise<Array>} URL数组
 */
export const generateProgressiveUrls = async (originalUrl, options = {}) => {
  if (!originalUrl || (!originalUrl.includes('http') && !originalUrl.includes('/api/'))) {
    return [originalUrl]
  }

  const { deviceType = 'desktop', connectionType = 'fast', levels = 3 } = options

  try {
    // 检测文件大小
    const fileSize = await getImageFileSize(originalUrl)
    const fileSizeMB = fileSize / (1024 * 1024)

    const separator = originalUrl.includes('?') ? '&' : '?'
    const urls = []

    if (fileSizeMB > 1 || connectionType === 'slow') {
      // 大文件或慢网络：多级加载

      if (levels >= 3) {
        // 第一级：极低质量预览
        const preview = [
          'auto=compress,format',
          'q=25',
          `w=${deviceType === 'mobile' ? 300 : 400}`,
          `h=${deviceType === 'mobile' ? 450 : 600}`,
          'fit=inside',
          'dpr=1',
          'blur=2', // 轻微模糊，减少文件大小
        ]
        urls.push(`${originalUrl}${separator}${preview.join('&')}`)
      }

      if (levels >= 2) {
        // 第二级：中等质量
        const medium = [
          'auto=compress,format',
          `q=${connectionType === 'slow' ? 40 : 50}`,
          `w=${deviceType === 'mobile' ? 600 : 800}`,
          `h=${deviceType === 'mobile' ? 900 : 1200}`,
          'fit=inside',
          'dpr=1',
        ]
        urls.push(`${originalUrl}${separator}${medium.join('&')}`)
      }

      // 最终级：高质量
      const final = await generateSmartImageUrl(originalUrl, { deviceType, connectionType })
      urls.push(final)
    } else {
      // 小文件：直接使用优化版本
      const optimized = await generateSmartImageUrl(originalUrl, { deviceType, connectionType })
      urls.push(optimized)
    }

    return urls
  } catch (error) {
    console.warn('渐进式URL生成失败:', error)
    return [originalUrl]
  }
}

/**
 * 预加载图片并返回加载进度
 * @param {string|Array} urls - 单个URL或URL数组
 * @param {Function} onProgress - 进度回调
 * @returns {Promise<Object>} 图片数据
 */
export const preloadWithProgress = (urls, onProgress = () => {}) => {
  const urlArray = Array.isArray(urls) ? urls : [urls]

  return new Promise((resolve) => {
    let loadedCount = 0
    let bestImage = null
    let resolved = false

    const resolveOnce = (imageData) => {
      if (!resolved) {
        resolved = true
        resolve(imageData)
      }
    }

    urlArray.forEach((url, index) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        loadedCount++
        const progress = (loadedCount / urlArray.length) * 100

        const imageData = {
          src: img.src,
          width: img.width,
          height: img.height,
          level: index + 1,
          isProgressive: index < urlArray.length - 1,
          progress,
        }

        bestImage = imageData
        onProgress(imageData)

        // 第一张图片加载完成就可以显示
        if (index === 0) {
          resolveOnce(imageData)
        }

        // 最后一张图片加载完成
        if (index === urlArray.length - 1) {
          if (resolved) {
            // 如果已经显示了预览，通知更新到最终版本
            onProgress({ ...imageData, isFinal: true })
          } else {
            resolveOnce(imageData)
          }
        }
      }

      img.onerror = () => {
        console.warn(`渐进式加载第${index + 1}级失败:`, url)
        loadedCount++

        if (index === 0 && !bestImage) {
          // 第一级就失败，尝试原图
          const fallbackImg = new Image()
          fallbackImg.crossOrigin = 'anonymous'
          fallbackImg.onload = () => {
            const fallbackData = {
              src: fallbackImg.src,
              width: fallbackImg.width,
              height: fallbackImg.height,
              level: 0,
              isProgressive: false,
              progress: 100,
            }
            resolveOnce(fallbackData)
          }
          fallbackImg.onerror = () => resolveOnce(null)
          fallbackImg.src = urlArray[urlArray.length - 1].replace(/\?.*$/, '')
        } else if (bestImage) {
          // 使用之前成功的版本
          if (!resolved) resolveOnce(bestImage)
        }
      }

      // 超时处理 - 优化响应速度
      setTimeout(
        () => {
          if (!img.complete) {
            console.warn(`渐进式加载第${index + 1}级超时:`, url)
            if (bestImage && !resolved) {
              resolveOnce(bestImage)
            }
          }
        },
        index === 0 ? 2000 : 4000 // 减少超时时间，提升响应速度
      )

      img.src = url
    })
  })
}

/**
 * 图片缓存管理器 - 支持LRU和大小限制
 */
export class AdvancedImageCache {
  constructor(maxSize = 50, maxMemoryMB = 100) {
    this.maxSize = maxSize
    this.maxMemoryMB = maxMemoryMB
    this.cache = new Map()
    this.accessOrder = new Map() // 记录访问顺序
    this.memoryUsage = 0 // 估算内存使用量（MB）
  }

  set(key, value) {
    // 估算图片内存使用量
    const estimatedSize = this.estimateImageSize(value)

    // 检查是否需要清理缓存
    while (
      (this.cache.size >= this.maxSize || this.memoryUsage + estimatedSize > this.maxMemoryMB) &&
      this.cache.size > 0
    ) {
      this.removeLRU()
    }

    // 添加新项
    this.cache.set(key, value)
    this.accessOrder.set(key, Date.now())
    this.memoryUsage += estimatedSize
  }

  get(key) {
    if (this.cache.has(key)) {
      this.accessOrder.set(key, Date.now()) // 更新访问时间
      return this.cache.get(key)
    }
    return null
  }

  has(key) {
    return this.cache.has(key)
  }

  removeLRU() {
    // 找到最久未访问的项
    let oldestKey = null
    let oldestTime = Date.now()

    for (const [key, time] of this.accessOrder) {
      if (time < oldestTime) {
        oldestTime = time
        oldestKey = key
      }
    }

    if (oldestKey) {
      const value = this.cache.get(oldestKey)
      this.memoryUsage -= this.estimateImageSize(value)
      this.cache.delete(oldestKey)
      this.accessOrder.delete(oldestKey)
    }
  }

  estimateImageSize(imageData) {
    if (!imageData || !imageData.width || !imageData.height) return 0.1
    // 估算：宽度 × 高度 × 4字节（RGBA） / 1024 / 1024
    return (imageData.width * imageData.height * 4) / (1024 * 1024)
  }

  clear() {
    this.cache.clear()
    this.accessOrder.clear()
    this.memoryUsage = 0
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      memoryUsage: this.memoryUsage.toFixed(2),
      maxMemoryMB: this.maxMemoryMB,
    }
  }
}

// 全局高级缓存实例 - 优化内存使用
export const globalAdvancedCache = new AdvancedImageCache(50, 100) // 减少缓存大小，避免内存压力

export default {
  getImageFileSize,
  getSmartCompressionParams,
  generateSmartImageUrl,
  generateProgressiveUrls,
  preloadWithProgress,
  AdvancedImageCache,
  globalAdvancedCache,
}