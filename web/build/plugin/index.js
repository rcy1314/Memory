import vue from '@vitejs/plugin-vue'

/**
 * * unocss插件，原子css
 * https://github.com/antfu/unocss
 */
import Unocss from 'unocss/vite'

// rollup打包分析插件
import { visualizer } from 'rollup-plugin-visualizer'
// 压缩
import viteCompression from 'vite-plugin-compression'
// 图片压缩
import viteImagemin from 'vite-plugin-imagemin'

import { configHtmlPlugin } from './html'
import unplugin from './unplugin'

export function createVitePlugins(viteEnv, isBuild) {
  const plugins = [vue(), ...unplugin, configHtmlPlugin(viteEnv, isBuild), Unocss()]

  if (viteEnv.VITE_USE_COMPRESS) {
    plugins.push(viteCompression({ algorithm: viteEnv.VITE_COMPRESS_TYPE || 'gzip' }))
  }

  if (isBuild) {
    plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
      // 图片压缩插件
      viteImagemin({
        gifsicle: { optimizationLevel: 7, interlaced: false },
        mozjpeg: { quality: 80 },
        pngquant: { quality: [0.65, 0.8], speed: 4 },
        webp: { quality: 75 },
      })
    )
  }

  return plugins
}
