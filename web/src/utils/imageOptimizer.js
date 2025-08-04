/**
 * 图片优化工具类
 * 提供图片压缩、格式转换、尺寸调整等功能
 */
import imageCompression from 'browser-image-compression'

/**
 * 检测浏览器对WebP格式的支持
 */
export const supportsWebP = () => {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

/**
 * 检测网络连接类型
 */
export const getConnectionType = () => {
  if (!navigator.connection) return 'unknown'

  const connection = navigator.connection
  const effectiveType = connection.effectiveType

  if (['slow-2g', '2g'].includes(effectiveType)) {
    return 'slow'
  } else if (effectiveType === '3g') {
    return 'medium'
  } else if (['4g', '5g'].includes(effectiveType)) {
    return 'fast'
  }

  return 'unknown'
}

/**
 * 获取设备类型
 */
export const getDeviceType = () => {
  const width = window.innerWidth

  if (width <= 768) {
    return 'mobile'
  } else if (width <= 1024) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

/**
 * 根据设备和网络条件获取图片压缩配置
 */
export const getCompressionConfig = () => {
  const deviceType = getDeviceType()
  const connectionType = getConnectionType()

  const configs = {
    mobile: {
      slow: { maxSizeMB: 0.05, maxWidthOrHeight: 300, quality: 0.5 },
      medium: { maxSizeMB: 0.1, maxWidthOrHeight: 400, quality: 0.6 },
      fast: { maxSizeMB: 0.2, maxWidthOrHeight: 500, quality: 0.7 },
      unknown: { maxSizeMB: 0.1, maxWidthOrHeight: 400, quality: 0.6 }
    },
    tablet: {
      slow: { maxSizeMB: 0.1, maxWidthOrHeight: 500, quality: 0.6 },
      medium: { maxSizeMB: 0.2, maxWidthOrHeight: 600, quality: 0.7 },
      fast: { maxSizeMB: 0.3, maxWidthOrHeight: 800, quality: 0.8 },
      unknown: { maxSizeMB: 0.2, maxWidthOrHeight: 600, quality: 0.7 }
    },
    desktop: {
      slow: { maxSizeMB: 0.2, maxWidthOrHeight: 600, quality: 0.7 },
      medium: { maxSizeMB: 0.3, maxWidthOrHeight: 800, quality: 0.8 },
      fast: { maxSizeMB: 0.5, maxWidthOrHeight: 1200, quality: 0.85 },
      unknown: { maxSizeMB: 0.3, maxWidthOrHeight: 800, quality: 0.8 }
    }
  }

  return {
    ...configs[deviceType][connectionType],
    useWebWorker: true,
    fileType: 'image/webp'
  }
}

/**
 * 压缩图片
 * @param {File|Blob} file - 图片文件
 * @param {Object} options - 压缩选项
 * @returns {Promise<File>} 压缩后的图片文件
 */
export const compressImage = async (file, options = {}) => {
  try {
    const config = {
      ...getCompressionConfig(),
      ...options
    }

    // 如果文件已经很小，跳过压缩
    if (file.size < 50 * 1024) { // 小于50KB
      return file
    }

    const compressedFile = await imageCompression(file, config)
    return compressedFile
  } catch (error) {
    console.warn('图片压缩失败:', error)
    return file
  }
}

/**
 * 从URL获取图片并压缩
 * @param {string} imageUrl - 图片URL
 * @param {Object} options - 压缩选项
 * @returns {Promise<string>} 压缩后的图片URL
 */
export const compressImageFromUrl = async (imageUrl, options = {}) => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    const compressedFile = await compressImage(blob, options)
    return URL.createObjectURL(compressedFile)
  } catch (error) {
    console.warn('从URL压缩图片失败:', error)
    return imageUrl
  }
}

/**
 * 生成占位符图片
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {string} color - 背景色
 * @returns {string} 占位符图片的Data URL
 */
export const generatePlaceholder = (width = 20, height = 20, color = '#f0f0f0') => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // 创建渐变背景
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, color)
  gradient.addColorStop(1, adjustBrightness(color, -10))

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  return canvas.toDataURL('image/jpeg', 0.1)
}

/**
 * 调整颜色亮度
 * @param {string} color - 十六进制颜色值
 * @param {number} amount - 亮度调整量
 * @returns {string} 调整后的颜色值
 */
const adjustBrightness = (color, amount) => {
  const usePound = color[0] === '#'
  const col = usePound ? color.slice(1) : color

  const num = parseInt(col, 16)
  let r = (num >> 16) + amount
  let g = (num >> 8 & 0x00FF) + amount
  let b = (num & 0x0000FF) + amount

  r = r > 255 ? 255 : r < 0 ? 0 : r
  g = g > 255 ? 255 : g < 0 ? 0 : g
  b = b > 255 ? 255 : b < 0 ? 0 : b

  return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0')
}

/**
 * 预加载图片
 * @param {string} src - 图片URL
 * @returns {Promise<HTMLImageElement>} 加载完成的图片元素
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * 批量预加载图片
 * @param {string[]} urls - 图片URL数组
 * @param {number} concurrency - 并发数量
 * @returns {Promise<HTMLImageElement[]>} 加载完成的图片元素数组
 */
export const preloadImages = async (urls, concurrency = 3) => {
  const results = []
  const executing = []

  for (const url of urls) {
    const promise = preloadImage(url).then(img => {
      results.push(img)
      return img
    }).catch(error => {
      console.warn('预加载图片失败:', url, error)
      return null
    })

    executing.push(promise)

    if (executing.length >= concurrency) {
      await Promise.race(executing)
      executing.splice(executing.findIndex(p => p === promise), 1)
    }
  }

  await Promise.all(executing)
  return results.filter(Boolean)
}

/**
 * 图片懒加载观察器
 */
export class LazyImageObserver {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    }

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    )

    this.loadingImages = new Set()
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.loadingImages.has(entry.target)) {
        this.loadImage(entry.target)
        this.observer.unobserve(entry.target)
      }
    })
  }

  async loadImage(img) {
    this.loadingImages.add(img)

    try {
      const src = img.dataset.src
      if (!src) return

      // 如果需要压缩
      if (img.dataset.compress === 'true') {
        const compressedSrc = await compressImageFromUrl(src)
        img.src = compressedSrc
      } else {
        img.src = src
      }

      img.classList.add('loaded')
    } catch (error) {
      console.warn('懒加载图片失败:', error)
      img.classList.add('error')
    } finally {
      this.loadingImages.delete(img)
    }
  }

  observe(img) {
    this.observer.observe(img)
  }

  unobserve(img) {
    this.observer.unobserve(img)
  }

  disconnect() {
    this.observer.disconnect()
    this.loadingImages.clear()
  }
}

/**
 * 图片缓存管理器
 */
export class ImageCache {
  constructor(maxSize = 50) {
    this.cache = new Map()
    this.maxSize = maxSize
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }

  get(key) {
    const value = this.cache.get(key)
    if (value) {
      // 移动到最后（LRU策略）
      this.cache.delete(key)
      this.cache.set(key, value)
    }
    return value
  }

  has(key) {
    return this.cache.has(key)
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }
}

// 全局图片缓存实例
export const globalImageCache = new ImageCache()

/**
 * 智能图片加载器
 * 结合缓存、压缩、懒加载等功能
 */
export class SmartImageLoader {
  constructor(options = {}) {
    this.cache = options.cache || globalImageCache
    this.lazyObserver = new LazyImageObserver(options.lazyOptions)
    this.compressionEnabled = options.compression !== false
  }

  async loadImage(src, options = {}) {
    // 检查缓存
    if (this.cache.has(src)) {
      return this.cache.get(src)
    }

    try {
      let finalSrc = src

      // 如果启用压缩
      if (this.compressionEnabled && options.compress !== false) {
        finalSrc = await compressImageFromUrl(src, options.compressionOptions)
      }

      // 预加载图片
      const img = await preloadImage(finalSrc)

      // 缓存结果
      this.cache.set(src, finalSrc)

      return finalSrc
    } catch (error) {
      console.warn('智能图片加载失败:', error)
      return src
    }
  }

  setupLazyLoading(img, src, options = {}) {
    img.dataset.src = src
    if (options.compress !== false) {
      img.dataset.compress = 'true'
    }

    this.lazyObserver.observe(img)
  }

  destroy() {
    this.lazyObserver.disconnect()
    this.cache.clear()
  }
}

// 默认导出
export default {
  supportsWebP,
  getConnectionType,
  getDeviceType,
  getCompressionConfig,
  compressImage,
  compressImageFromUrl,
  generatePlaceholder,
  preloadImage,
  preloadImages,
  LazyImageObserver,
  ImageCache,
  globalImageCache,
  SmartImageLoader
}