<template>
  <div class="header-container" flex items-center justify-between w-full>
    <div flex items-center>
      <MenuCollapse />
      <BreadCrumb ml-15 hidden sm:block />
    </div>
    <div ml-auto flex items-center>
      <Preview />
      <!-- <Languages /> -->
      <ThemeMode />
      <UserAvatar />
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
