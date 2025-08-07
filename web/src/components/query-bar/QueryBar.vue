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
    <n-space wrap :size="[35, 15]" class="query-bar-content">
      <slot />
      <div class="query-bar-actions mobile-hidden">
        <n-button secondary type="primary" @click="emit('reset')">重置</n-button>
        <n-button ml-20 type="primary" @click="emit('search')">搜索</n-button>
      </div>
    </n-space>
  </div>
</template>

<script setup>
const emit = defineEmits(['search', 'reset'])
</script>

<style scoped>
/* 移动端查询栏优化 */
@media (max-width: 768px) {
  .query-bar-container {
    padding: 12px !important;
    min-height: auto !important;
  }
  
  .query-bar-content {
    width: 100%;
    flex-direction: column !important;
    gap: 12px !important;
  }
  
  .query-bar-actions {
    width: 100%;
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  
  .query-bar-actions .n-button {
    flex: 1;
    margin: 0 !important;
  }
}
</style>
