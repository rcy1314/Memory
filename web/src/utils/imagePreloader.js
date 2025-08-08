// 图片预加载优化工具

// 网络状况检测
function getNetworkType() {
  if (!navigator.connection) {
    return 'unknown'
  }
  
  const connection = navigator.connection
  const effectiveType = connection.effectiveType
  
  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return 'slow'
  } else if (effectiveType === '3g') {
    return 'medium'
  } else {
    return 'fast'
  }
}

// 设备类型检测
function getDeviceType() {
  const width = window.innerWidth
  
  if (width <= 768) {
    return 'mobile'
  } else if (width <= 1200) {
    return 'desktop'
  } else {
    return 'large'
  }
}

// 根据网络和设备生成优化的图片URL
function generateOptimizedUrl(imageUrl, purpose = 'thumbnail') {
  if (!imageUrl || (!imageUrl.includes('http') && !imageUrl.includes('/api/'))) {
    return imageUrl
  }
  
  const networkType = getNetworkType()
  const deviceType = getDeviceType()
  const separator = imageUrl.includes('?') ? '&' : '?'
  
  let quality, width, height
  
  // 根据用途和设备类型调整参数
  if (purpose === 'thumbnail') {
    switch (deviceType) {
      case 'mobile':
        quality = networkType === 'slow' ? 20 : networkType === 'medium' ? 30 : 40
        width = networkType === 'slow' ? 120 : 160
        height = networkType === 'slow' ? 160 : 220
        break
      case 'tablet':
        quality = networkType === 'slow' ? 25 : networkType === 'medium' ? 35 : 45
        width = networkType === 'slow' ? 180 : 240
        height = networkType === 'slow' ? 240 : 320
        break
      case 'desktop':
        quality = networkType === 'slow' ? 30 : networkType === 'medium' ? 40 : 55
        width = networkType === 'slow' ? 200 : 260
        height = networkType === 'slow' ? 280 : 360
        break
      case 'large':
        quality = networkType === 'slow' ? 35 : networkType === 'medium' ? 45 : 65
        width = networkType === 'slow' ? 240 : 300
        height = networkType === 'slow' ? 320 : 420
        break
    }
  } else if (purpose === 'preview') {
    // 预览图片使用更高质量
    switch (deviceType) {
      case 'mobile':
        quality = networkType === 'slow' ? 40 : networkType === 'medium' ? 60 : 75
        width = networkType === 'slow' ? 300 : 400
        height = networkType === 'slow' ? 400 : 600
        break
      case 'tablet':
        quality = networkType === 'slow' ? 45 : networkType === 'medium' ? 65 : 80
        width = networkType === 'slow' ? 500 : 700
        height = networkType === 'slow' ? 700 : 900
        break
      default:
        quality = networkType === 'slow' ? 50 : networkType === 'medium' ? 70 : 85
        width = networkType === 'slow' ? 800 : 1200
        height = networkType === 'slow' ? 1000 : 1600
        break
    }
  }
  
  return `${imageUrl}${separator}w=${width}&h=${height}&fit=cover&q=${quality}&auto=compress,format&dpr=1`
}

// 图片缓存管理
const imageCache = new Map()
const loadingPromises = new Map()
const MAX_CACHE_SIZE = 200

// 预加载单张图片
function preloadImage(imageUrl, purpose = 'thumbnail') {
  const optimizedUrl = generateOptimizedUrl(imageUrl, purpose)
  const cacheKey = `${optimizedUrl}_${purpose}`
  
  // 检查缓存
  if (imageCache.has(cacheKey)) {
    return Promise.resolve(optimizedUrl)
  }
  
  // 检查是否正在加载
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey)
  }
  
  // 创建加载Promise
  const loadPromise = new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      // 添加到缓存
      if (imageCache.size >= MAX_CACHE_SIZE) {
        const firstKey = imageCache.keys().next().value
        imageCache.delete(firstKey)
      }
      imageCache.set(cacheKey, optimizedUrl)
      loadingPromises.delete(cacheKey)
      resolve(optimizedUrl)
    }
    img.onerror = () => {
      loadingPromises.delete(cacheKey)
      resolve(imageUrl) // 失败时返回原始URL
    }
    img.src = optimizedUrl
  })
  
  loadingPromises.set(cacheKey, loadPromise)
  return loadPromise
}

// 批量预加载图片
function preloadImages(imageUrls, options = {}) {
  const { 
    maxConcurrent = 3, 
    purpose = 'thumbnail',
    delay = 100 
  } = options
  
  return new Promise((resolve) => {
    const results = []
    let completed = 0
    let index = 0
    
    function loadNext() {
      if (index >= imageUrls.length) {
        if (completed === imageUrls.length) {
          resolve(results)
        }
        return
      }
      
      const currentIndex = index++
      const imageUrl = imageUrls[currentIndex]
      
      setTimeout(() => {
        preloadImage(imageUrl, purpose)
          .then((url) => {
            results[currentIndex] = url
            completed++
            if (completed === imageUrls.length) {
              resolve(results)
            }
            loadNext()
          })
          .catch((error) => {
            console.warn('预加载图片失败:', imageUrl, error)
            results[currentIndex] = imageUrl
            completed++
            if (completed === imageUrls.length) {
              resolve(results)
            }
            loadNext()
          })
      }, currentIndex * delay)
    }
    
    // 启动并发加载
    for (let i = 0; i < Math.min(maxConcurrent, imageUrls.length); i++) {
      loadNext()
    }
  })
}

// 智能预加载策略
function smartPreload(blogData, options = {}) {
  const { 
    maxImages = 6
  } = options
  
  const networkType = getNetworkType()
  
  // 根据网络状况调整预加载数量
  let actualMaxImages = maxImages
  if (networkType === 'slow') {
    actualMaxImages = Math.min(3, maxImages)
  } else if (networkType === 'medium') {
    actualMaxImages = Math.min(4, maxImages)
  }
  
  // 提取图片URL
  const imageUrls = []
  
  for (let i = 0; i < Math.min(actualMaxImages, blogData.length); i++) {
    const blog = blogData[i]
    if (blog.images && blog.images.length > 0) {
      imageUrls.push(blog.images[0].image_url)
    }
  }
  
  // 批量预加载
  return preloadImages(imageUrls, {
    maxConcurrent: networkType === 'slow' ? 2 : 3,
    purpose: 'thumbnail',
    delay: networkType === 'slow' ? 200 : 100
  })
}

// 清除缓存
function clearImageCache() {
  imageCache.clear()
  loadingPromises.clear()
}

// 获取缓存统计
function getCacheStats() {
  return {
    cacheSize: imageCache.size,
    loadingCount: loadingPromises.size,
    maxCacheSize: MAX_CACHE_SIZE
  }
}

export {
  generateOptimizedUrl,
  preloadImage,
  preloadImages,
  smartPreload,
  clearImageCache,
  getCacheStats
}