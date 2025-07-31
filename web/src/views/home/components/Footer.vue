<template>
    <footer id="footer" class="footer-static">
        <div class="footer-content">
            <div class="footer-row" :class="{ 'center-only': entries.length > 0 && !isValueNotEmpty(icp) }">
                <section v-if="entries.length > 0" class="footer-nav">
                    <ul class="footer-shortcuts">
                        <li v-for="entry in entries" :key="entry.id || entry.name" class="footer-shortcut">
                            <a :href="entry.url" target="_blank" rel="noopener nofollow">
                                <TheIcon :icon="entry.icon" :size="16" />
                                <span class="footer-shortcut-label">{{ entry.name }}</span>
                            </a>
                        </li>
                    </ul>
                </section>
                <div class="footer-info" v-if="isValueNotEmpty(icp)">
                    <p class="footer-icp">
                        ICP备案号:
                        <a href="http://beian.miit.gov.cn/" target="_blank" rel="noopener nofollow">{{ icp }}</a>
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>
<script setup>
import { computed } from 'vue'
import { useSettingStore } from '@/store'
import { isValueNotEmpty, createStyle } from '@/utils'
import TheIcon from '@/components/icon/TheIcon.vue'
const settingStore = useSettingStore()
const site_name = computed(() => isValueNotEmpty(settingStore.metaSetting?.site_name) ? settingStore.metaSetting?.site_name : import.meta.env.VITE_TITLE)
const site_desc = computed(() => isValueNotEmpty(settingStore.metaSetting?.site_desc) ? settingStore.metaSetting?.site_desc : import.meta.env.VITE_DESC)
const primary_color = computed(() => isValueNotEmpty(settingStore.metaSetting?.primary_color) ? settingStore.metaSetting?.primary_color : import.meta.env.VITE_PRIMARY_COLOR)
// 过滤掉空的导航条目
const entries = computed(() => {
  const rawEntries = isValueNotEmpty(settingStore.metaSetting?.entries) ? settingStore.metaSetting?.entries : []
  return rawEntries.filter(entry => entry && entry.name && entry.name.trim() !== '' && entry.url && entry.url.trim() !== '')
})
const bottom_icon = computed(() => isValueNotEmpty(settingStore.metaSetting?.bottom_icon) ? settingStore.metaSetting?.bottom_icon : import.meta.env.VITE_ICON)
const bottom_desc = computed(() => isValueNotEmpty(settingStore.metaSetting?.bottom_desc) ? settingStore.metaSetting?.bottom_desc : import.meta.env.VITE_DESC)
const icp = computed(() => isValueNotEmpty(settingStore.metaSetting?.icp) ? settingStore.metaSetting?.icp : "")

createStyle("custom_primary_color", `:root {--moment-theme:${primary_color} !important;}`)
</script>
<style>
.footer-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

.footer-nav {
    display: flex;
    align-items: center;
    gap: 12px;
}

.nav-label {
    color: #d0d0d0;
    font-size: 14px;
    white-space: nowrap;
}

ul.footer-shortcuts {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

ul.footer-shortcuts li.footer-shortcut {
    display: inline-block;
}

ul.footer-shortcuts li a {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    color: #d0d0d0;
    text-decoration: none;
    transition: all 0.3s ease;
    font-size: 12px;
}

ul.footer-shortcuts li a:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    color: white;
}

.footer-shortcut-label {
    white-space: nowrap;
}

.footer-static {
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 8px 20px;
    margin-top: 10px;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
}

.footer-row {
    min-height: auto;
}

.footer-row.center-only {
    justify-content: center;
}

.footer-row.center-only .footer-nav {
    margin: 0;
}

.footer-info {
    flex-shrink: 0;
}

@media screen and (max-width: 768px) {
    .footer-static {
        padding: 6px 10px;
        overflow-x: auto;
        margin-top: 8px;
    }
    
    .footer-row {
        flex-wrap: nowrap;
        min-width: max-content;
        gap: 12px;
    }
    
    .footer-row.center-only {
        justify-content: center;
        min-width: auto;
    }
    
    .footer-nav {
        flex-shrink: 0;
        gap: 6px;
    }
    
    ul.footer-shortcuts {
        gap: 4px;
        flex-wrap: nowrap;
    }
    
    ul.footer-shortcuts li a {
        padding: 3px 6px;
        font-size: 11px;
        white-space: nowrap;
    }
    
    .nav-label {
        font-size: 12px;
    }
    
    .footer-info {
        flex-shrink: 0;
        white-space: nowrap;
    }
    
    .footer-icp {
        font-size: 11px;
    }
}

.footer-icp {
    color: #b5b5b5;
    font-size: 14px;
    margin: 0;
}

.footer-icp a {
    color: #b5b5b5;
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-icp a:hover {
    color: #d0d0d0;
}
</style>