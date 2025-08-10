<template>
  <div class="header-container" w-full flex items-center justify-between>
    <div flex items-center>
      <MenuCollapse class="menu-collapse" />
      <BreadCrumb ml-15 class="breadcrumb mobile-hidden" />
    </div>
    <div ml-auto flex items-center class="header-actions">
      <Preview class="preview-btn" />
      <!-- <Languages /> -->
      <ThemeMode class="theme-mode" />
      <UserAvatar class="user-avatar" />
    </div>
  </div>
</template>

<script setup>
import BreadCrumb from './components/BreadCrumb.vue'
import MenuCollapse from './components/MenuCollapse.vue'
import Preview from './components/Preview.vue'
import UserAvatar from './components/UserAvatar.vue'
import ThemeMode from './components/ThemeMode.vue'
</script>
