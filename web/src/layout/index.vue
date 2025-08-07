<template>
  <n-layout has-sider wh-full>
    <!-- 移动端遮罩层 -->
    <div 
      v-if="isMobile && !appStore.collapsed" 
      class="fixed inset-0 bg-black bg-opacity-50 z-999"
      @click="appStore.setCollapsed(true)"
    ></div>
    
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="isMobile ? 0 : 64"
      :width="isMobile ? 280 : 220"
      :native-scrollbar="false"
      :collapsed="appStore.collapsed"
      :class="{ 'mobile-sidebar': isMobile }"
    >
      <SideBar />
    </n-layout-sider>

    <article flex-col flex-1 overflow-hidden :class="{ 'mobile-content': isMobile }">
      <header
        class="flex items-center border-b bg-white px-15 bc-eee header-container"
        dark="bg-dark border-0"
        :style="`height: ${isMobile ? 56 : header.height}px`"
      >
        <AppHeader />
      </header>
      <section v-if="tags.visible && !isMobile" hidden border-b bc-eee sm:block dark:border-0>
        <AppTags :style="{ height: `${tags.height}px` }" />
      </section>
      <section flex-1 overflow-hidden bg-hex-f5f6fb dark:bg-hex-101014 :class="{ 'mobile-main': isMobile }">
        <AppMain />
      </section>
    </article>
  </n-layout>
</template>

<script setup>
import AppHeader from './components/header/index.vue'
import SideBar from './components/sidebar/index.vue'
import AppMain from './components/AppMain.vue'
import AppTags from './components/tags/index.vue'
import { useAppStore } from '@/store'
import { header, tags } from '~/settings'

// 移动端适配
import { useBreakpoints } from '@vueuse/core'

const appStore = useAppStore()
const breakpointsEnum = {
  xl: 1600,
  lg: 1199,
  md: 991,
  sm: 768, // 调整移动端断点
  xs: 480,
}
const breakpoints = reactive(useBreakpoints(breakpointsEnum))
const isMobile = breakpoints.smaller('sm')
const isPad = breakpoints.between('sm', 'md')
const isPC = breakpoints.greater('md')

// 监听屏幕尺寸变化
watchEffect(() => {
  if (isMobile.value) {
    // Mobile - 默认收起侧边栏
    appStore.setCollapsed(true)
    appStore.setFullScreen(false)
  } else if (isPad.value) {
    // IPad - 收起侧边栏但保持部分功能
    appStore.setCollapsed(true)
    appStore.setFullScreen(false)
  } else if (isPC.value) {
    // PC - 展开侧边栏
    appStore.setCollapsed(false)
    appStore.setFullScreen(true)
  }
})

// 处理移动端点击外部区域关闭侧边栏
const handleClickOutside = () => {
  if (isMobile.value && !appStore.collapsed) {
    appStore.setCollapsed(true)
  }
}
</script>

<style scoped>
/* 移动端侧边栏样式 */
.mobile-sidebar {
  position: fixed !important;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.mobile-sidebar:not(.n-layout-sider--collapsed) {
  transform: translateX(0);
}

/* 移动端主内容区域 */
.mobile-content {
  margin-left: 0 !important;
}

.mobile-main {
  padding: 8px;
}

/* 移动端头部样式 */
@media (max-width: 768px) {
  .header-container {
    padding: 0 12px !important;
  }
}
</style>
