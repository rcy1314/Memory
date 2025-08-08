<template>
  <div
    bg="#fafafc"
    min-h-60
    flex
    items-start
    justify-between
    b-1
    rounded-8
    p-15
    bc-ccc
    dark:bg-black
    class="query-bar-container"
  >
    <div class="query-bar-content">
      <slot />
      <div class="query-bar-actions">
        <n-button secondary type="primary" @click="emit('reset')">重置</n-button>
        <n-button type="primary" @click="emit('search')">搜索</n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['search', 'reset'])
</script>

<style scoped>
/* 桌面端查询栏优化 - 自适应屏幕尺寸 */
.query-bar-container {
  overflow: visible;
  position: relative;
}

.query-bar-content {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  width: 100%;
}

.query-bar-actions {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-shrink: 0;
  margin-left: auto;
}

.query-bar-actions .n-button {
  min-width: 80px;
}

/* 大屏幕优化 (>1200px) */
@media (min-width: 1201px) {
  .query-bar-content {
    gap: 20px;
  }
  
  .query-bar-actions {
    gap: 16px;
  }
  
  .query-bar-actions .n-button {
    min-width: 90px;
  }
}

/* 中等屏幕优化 (平板横屏) */
@media (max-width: 1200px) and (min-width: 1025px) {
  .query-bar-content {
    gap: 14px;
  }
  
  .query-bar-actions {
    gap: 10px;
  }
}

/* 平板竖屏优化 */
@media (max-width: 1024px) and (min-width: 769px) {
  .query-bar-container {
    padding: 14px !important;
  }
  
  .query-bar-content {
    gap: 12px;
  }
  
  .query-bar-actions {
    gap: 8px;
    width: 100%;
    margin-left: 0;
    margin-top: 8px;
  }
  
  .query-bar-actions .n-button {
    flex: 1;
    min-width: 70px;
  }
}

/* 移动端查询栏优化 */
@media (max-width: 768px) {
  .query-bar-container {
    padding: 12px !important;
    min-height: auto !important;
  }
  
  .query-bar-content {
    flex-direction: column !important;
    gap: 12px !important;
    align-items: stretch;
  }
  
  .query-bar-actions {
    width: 100%;
    gap: 8px;
    margin-left: 0;
    margin-top: 8px;
  }
  
  .query-bar-actions .n-button {
    flex: 1;
    min-width: auto;
  }
}
</style>
