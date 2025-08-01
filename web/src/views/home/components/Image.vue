<template>
  <article class="thumb img-area">
    <a class="thumb-a my-photo">
      <img
        class="thumb-image my-photo"
        onerror="this.src=`/assets/loading.gif`;this.onerror=null"
        :src="data.current_thumbnail"
        lazy
      />
    </a>
    <div class="thumb-overlay">
      <h2 class="thumb-title">{{ data.title }}</h2>
      <p v-if="data.desc" class="thumb-desc">{{ data.desc }}</p>
      <ul class="tags">
        <li class="tag-categories">
          <router-link
            v-if="thumbnail_show_location && data.location"
            class="tag-location thumbnail-tag"
            :to="'/location/' + data.location"
            >{{ data.location }}</router-link
          >
          <a v-if="thumbnail_show_time && data.time" class="tag-time thumbnail-tag">{{
            data.thumbnail_time
          }}</a>
          <router-link
            v-for="category in data.categories"
            :key="category.alias"
            :to="'/category/' + category.alias"
            >{{ category.name }}</router-link
          >
        </li>
      </ul>
    </div>
  </article>
</template>

<script setup>
import { useSettingStore } from '@/store'
import { isValueNotEmpty } from '@/utils'
const settingStore = useSettingStore()
var thumbnail_show_location = isValueNotEmpty(settingStore.contentSetting.thumbnail_show_location)
  ? settingStore.contentSetting.thumbnail_show_location
  : true
var thumbnail_show_time = isValueNotEmpty(settingStore.contentSetting.thumbnail_show_time)
  ? settingStore.contentSetting.thumbnail_show_time
  : false
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})
</script>
<style>
.thumb .detail-tag {
  display: none;
}

.thumb-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  padding: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 3;
}

.thumb:hover .thumb-overlay {
  opacity: 1;
}

.thumb-overlay .thumb-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.75em;
  margin: 4px 0;
  line-height: 1.2;
}

.thumb-overlay .tags {
  margin: 8px 0 0 0;
  padding: 0;
  list-style: none;
}

.thumb-overlay .tag-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.thumb-overlay .thumbnail-tag,
.thumb-overlay .tag-categories a {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7em;
  text-decoration: none;
  transition: background 0.2s ease;
}

.thumb-overlay .thumbnail-tag:hover,
.thumb-overlay .tag-categories a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-content .caption .thumb-desc {
  padding-top: 5px;
  display: block;
}

.lightbox-content .thumbnail-tag {
  display: none;
}

.lightbox-content .caption ul.tags {
  margin-bottom: 0.6em;
}

.lightbox-content .caption .breadcrumb-nav {
  margin-bottom: 0.6em;
}

.thumb-image {
  border: 0;
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  cursor: pointer;
  outline: 0px;
  border-radius: 0;
}

@media (max-width: 768px) {
  .thumb-image {
    background-image: url(/assets/20200212-6dafa53ecf4e3.gif);
    background-size: 100% 100%;
  }
}

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .thumb-image {
    background-image: url(/assets/20200212-38ce26bb0bd0d.gif);
    background-size: 100% 100%;
  }
}

@media only screen and (device-width: 375px) and (device-height: 667px) {
  .thumb-image {
    background-image: url(/assets/20200212-e056a5f2914d6.gif);
    background-size: 100% 100%;
  }
}

#blog-main .thumb:after {
  background-image: linear-gradient(to top, rgba(10, 17, 25, 0.35) 5%, rgba(10, 17, 25, 0) 35%);
  pointer-events: none;
  background-size: cover;
  content: '';
  display: block;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

#blog-main .thumb .thumb-title {
  pointer-events: none;
  font-size: 0.85em;
  color: white;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 4px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

#blog-main .thumb {
  transition: opacity 0.3s ease-in-out;
  opacity: 1;
  pointer-events: auto;
  overflow: hidden;
  position: relative;
  margin: 0 0 4px 0;
  box-sizing: border-box;
  display: block;
  width: 100%;
  border-radius: 8px;
  box-shadow: none;
  transition: transform 0.3s ease;
  break-inside: avoid;
  page-break-inside: avoid;
}

#blog-main .thumb:hover {
  /* transform: scale(1.02); */
}

body.is-preload #blog-main .thumb {
  pointer-events: none;
  opacity: 0;
}

/* 动画延迟效果 */
#blog-main .thumb:nth-child(1) {
  transition-delay: 0.1s;
}
#blog-main .thumb:nth-child(2) {
  transition-delay: 0.2s;
}
#blog-main .thumb:nth-child(3) {
  transition-delay: 0.3s;
}
#blog-main .thumb:nth-child(4) {
  transition-delay: 0.4s;
}
#blog-main .thumb:nth-child(5) {
  transition-delay: 0.5s;
}
#blog-main .thumb:nth-child(6) {
  transition-delay: 0.6s;
}
#blog-main .thumb:nth-child(7) {
  transition-delay: 0.7s;
}
#blog-main .thumb:nth-child(8) {
  transition-delay: 0.8s;
}
#blog-main .thumb:nth-child(9) {
  transition-delay: 0.9s;
}
#blog-main .thumb:nth-child(10) {
  transition-delay: 1s;
}
#blog-main .thumb:nth-child(11) {
  transition-delay: 1.1s;
}
#blog-main .thumb:nth-child(12) {
  transition-delay: 1.2s;
}
</style>
