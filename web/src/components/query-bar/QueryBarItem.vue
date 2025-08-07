<template>
  <div flex items-center class="query-bar-item-container">
    <label
      v-if="!isNullOrWhitespace(label)"
      w-80
      flex-shrink-0
      :style="{ width: labelWidth + 'px' }"
      class="query-bar-label"
    >
      {{ label }}
    </label>
    <div class="query-bar-input">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { isNullOrWhitespace } from '@/utils'

defineProps({
  label: {
    type: String,
    default: '',
  },
  labelWidth: {
    type: Number,
    default: 80,
  },
  contentWidth: {
    type: Number,
    default: 220,
  },
})
</script>

<style scoped>
/* 移动端查询项优化 */
@media (max-width: 768px) {
  .query-bar-item-container {
    flex-direction: column !important;
    align-items: flex-start !important;
    width: 100%;
    gap: 4px;
  }
  
  .query-bar-label {
    width: auto !important;
    font-size: 13px;
    margin-bottom: 4px;
  }
  
  .query-bar-input {
    width: 100%;
  }
  
  .query-bar-input :deep(.n-input),
  .query-bar-input :deep(.n-select),
  .query-bar-input :deep(.n-tree-select),
  .query-bar-input :deep(.n-auto-complete) {
    width: 100% !important;
  }
}
</style>
