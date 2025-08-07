<script setup>
import { h, onMounted, ref, resolveDirective, withDirectives } from 'vue'
import {
  NButton,
  NDatePicker,
  NForm,
  NFormItem,
  NImage,
  NInput,
  NPopconfirm,
  NPopover,
  NSwitch,
  NModal,
  NTag,
  NTreeSelect,
  NTabs,
  NTabPane,
  NSelect,
  NInputNumber,
  c,
} from 'naive-ui'
import * as exifr from 'exifr'
import draggable from 'vuedraggable'
import CommonPage from '@/components/page/CommonPage.vue'
import CrudModal from '@/components/table/CrudModal.vue'
import CrudTable from '@/components/table/CrudTable.vue'
import TheIcon from '@/components/icon/TheIcon.vue'
import { useI18n } from 'vue-i18n'
import { formatDate, renderIcon, isValueNotEmpty } from '@/utils'
import { useCRUD } from '@/composables'
import api from '@/api'
import { request } from '@/utils'
import { useSettingStore } from '@/store'
import { formatDateTime } from '@/utils'
const options = ref([])
const { t } = useI18n()
defineOptions({ name: '图片管理' })
const settingStore = useSettingStore()
var timeout_time = isValueNotEmpty(settingStore.storageSetting?.timeout_time)
  ? settingStore.storageSetting?.timeout_time
  : import.meta.env.VITE_TIMEOUT_TIME
const $table = ref(null)
const queryItems = ref({ order_option: 'meta_time_desc', categories: [] })
const vPermission = resolveDirective('permission')
const blogDisabled = ref(false)
var locations = ref([])

//图片列表
const showAddImageModal = ref(false)
const hoverIndex = ref(-1)
const editIndex = ref(null)
const parsingEXIF = ref(false)

const imageForm = ref({
  image_url: '',
  location: null,
  title: null,
  desc: null,
  is_hidden: false,
  metadata: null,
})

const activeTab = ref('images')

// 编辑按钮点击
const editImage = (index) => {
  if (!modalForm.value.images || !modalForm.value.images[index]) return
  editIndex.value = index
  Object.assign(imageForm.value, modalForm.value.images[index])
  showAddImageModal.value = true
}

// 删除按钮点击
const removeImage = (index) => {
  if (!modalForm.value.images) return
  modalForm.value.images.splice(index, 1)
}

const onDragChange = (evt) => {
  updateOrder()
}
const updateOrder = () => {
  if (!modalForm.value.images) {
    modalForm.value.images = []
    return
  }
  const images = [...modalForm.value.images]
  images.forEach((image, index) => {
    image.order = index
  })
  modalForm.value.images = images
}
// 添加或保存图片
const handleSaveImage = () => {
  if (!imageForm.value.image_url) return
  if (!modalForm.value.images) {
    modalForm.value.images = []
  }
  if (editIndex.value !== null) {
    modalForm.value.images[editIndex.value] = { ...imageForm.value }
  } else {
    modalForm.value.images.push({ ...imageForm.value })
    updateOrder()
  }
  editIndex.value = null
  imageForm.value = {
    image_url: '',
    location: null,
    title: null,
    desc: null,
    is_hidden: false,
  }
  showAddImageModal.value = false
}



const initForm = {
  order: 1,
  images: [],
  location: '',
}

function disablePreviousDate(ts) {
  return ts > Date.now()
}

const {
  modalVisible,
  modalTitle,
  modalLoading,
  handleAdd,
  handleDelete,
  handleEdit,
  handleView,
  handleSave,
  modalForm,
  modalFormRef,
} = useCRUD({
  name: '图片',
  initForm,
  doCreate: api.createBlog,
  doDelete: api.deleteBlog,
  doUpdate: api.updateBlog,
  refresh: () => $table.value?.handleSearch(),
})

onMounted(async () => {
  $table.value?.handleSearch()
  getTreeSelect()
  await getLocations()
})

const categoryTreeOptions = ref([])

var thumbnail_suffix = isValueNotEmpty(settingStore.contentSetting?.thumbnail_suffix)
  ? settingStore.contentSetting?.thumbnail_suffix
  : ''
var detail_suffix = isValueNotEmpty(settingStore.contentSetting?.detail_suffix)
  ? settingStore.contentSetting?.detail_suffix
  : ''

const columns = [
  { title: 'ID', key: 'id', width: 50, ellipsis: { tooltip: true } },
  { title: '标题', key: 'title', width: 120, ellipsis: { tooltip: true } },
  {
    title: '图片',
    key: 'images',
    width: 80,
    render(row) {
      return h(
        NPopover,
        {
          trigger: 'hover',
          'keep-alive-on-hover': false,
        },
        {
          default: () =>
            h(NImage, {
              width: 200,
              class: 'table-image',
              lazy: true,
              src: (row.images && row.images[0] && row.images[0].image_url) ? row.images[0].image_url + thumbnail_suffix : '/assets/error.svg',
              previewSrc: (row.images && row.images[0] && row.images[0].image_url) ? row.images[0].image_url + detail_suffix : '/assets/error.svg',
              'show-toolbar-tooltip': true,
              style: 'border-radius:8px',
            }),
          trigger: () =>
            h(NImage, {
              width: 80,
              height: 60,
              class: 'table-image',
              lazy: true,
              src: (row.images && row.images[0] && row.images[0].image_url) ? row.images[0].image_url + thumbnail_suffix : '/assets/error.svg',
              previewSrc: (row.images && row.images[0] && row.images[0].image_url) ? row.images[0].image_url + detail_suffix : '/assets/error.svg',
              'show-toolbar-tooltip': true,
              style: 'border-radius:8px',
            }),
        }
      )
    },
  },
  { title: '地点', key: 'location', width: 80, ellipsis: { tooltip: true } },
  { title: '时间', key: 'time', width: 100, ellipsis: { tooltip: true } },
  {
    title: '分类',
    key: 'categories',
    width: 120,
    render(row) {
      return row.categories.map((e) =>
        h(
          NButton,
          {
            type: 'info',
            strong: true,
            secondary: true,
            round: true,
            style: 'margin-left:5px;',
            onClick: (_) => appendCategories(e.id),
          },
          () => e.name
        )
      )
    },
  },
  {
    title: '隐藏',
    key: 'is_hidden',
    width: 40,
    render(row) {
      return h(NSwitch, {
        size: 'small',
        rubberBand: false,
        value: row.is_hidden,
        onUpdateValue: () => handleUpdateHidden(row),
      })
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 140,
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        withDirectives(
          h(
            NButton,
            {
              size: 'tiny',
              type: 'primary',
              style: 'margin-left:5px;',
              onClick: () => {
                handleEdit(row)
              },
            },
            {
              default: () => '编辑',
              icon: renderIcon('material-symbols:edit-outline', { size: 16 }),
            }
          ),
          [[vPermission, 'post/api/v1/blog/update']]
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => handleDelete({ id: row.id }, false),
          },
          {
            trigger: () =>
              withDirectives(
                h(
                  NButton,
                  {
                    size: 'tiny',
                    type: 'error',
                    style: 'margin-left:5px;',
                  },
                  {
                    default: () => '删除',
                    icon: renderIcon('material-symbols:delete-outline', { size: 16 }),
                  }
                ),
                [[vPermission, 'delete/api/v1/blog/delete']]
              ),
            default: () => h('div', {}, '确定删除该图片吗?'),
          }
        ),
      ]
    },
  },
]

function handleClickAdd() {
  initForm.time = formatDateTime(Date.now())
  handleAdd()
}

function appendCategories(id) {
  if (!queryItems.value.categories.includes(id)) {
    queryItems.value.categories.push(id)
    $table.value?.handleSearch()
  }
}

function resetQuery() {
  queryItems.value.categories = []
}

async function getLocations() {
  const res = await api.getBlogLocations()
  if (res.code === 200) {
    var sorted_locations = res.data
    locations.value = sorted_locations.map((e) => {
      return { label: e[0], value: e[0] }
    })
  }
}

async function handleUpdateHidden(row) {
  if (!row.id) return
  row.publishing = true
  row.is_hidden = row.is_hidden === false ? true : false
  await api.updateBlog(row)
  row.publishing = false
  $message?.success(row.is_hidden ? '已隐藏' : '已公开')
}

function fetchMetadata() {
  var url = imageForm.value.image_url + thumbnail_suffix
  extractExifFromUrl(url).then((exif) => {
    if (exif) {
      const make = exif.Make || ''
      const model = exif.Model || ''
      const iso = exif.ISO ? `ISO${exif.ISO}` : ''
      const focal = exif.FocalLength ? `${exif.FocalLength}mm` : ''
      const fNumber = exif.FNumber ? `f/${exif.FNumber}` : ''
      let camera = model || `${make} ${model}`.trim()
      let result = [camera, focal, fNumber, iso].filter(Boolean).join(' ')
      console.log('EXIF信息：', exif)
      imageForm.value.metadata = result
      if (result) {
        $message.success('成功获取到EXIF信息')
      } else {
        $message.warning('获取到的EXIF信息不包含拍摄参数')
      }
    } else {
      $message.warning('未获取到EXIF信息')
    }
  })
}

function fetchPictureTime() {
  var url = imageForm.value.image_url + thumbnail_suffix
  extractExifFromUrl(url).then((exif) => {
    parsingEXIF.value = false
    if (exif) {
      const time = exif.DateTimeOriginal || exif.DateTime || null
      if (time) {
        $message.success('成功获取到拍摄时间')
        imageForm.value.time = formatDateTime(new Date(time))
        return time
      } else {
        $message.warning('获取到的EXIF信息中不包含拍摄时间信息')
        return null
      }
    } else {
      $message.warning('未获取到EXIF信息')
    }
  })
}

async function extractExifFromUrl(imageUrl) {
  try {
    parsingEXIF.value = true
    $message.loading('下载图片中...')
    const blob = await fetch(imageUrl).then((res) => res.blob())
    $message.loading('解析中...')
    const exif = await exifr.parse(blob)
    parsingEXIF.value = false
    return exif
  } catch (err) {
    parsingEXIF.value = false
    $message.error('解析失败：' + err.message)
    throw err
  }
}

async function getTreeSelect() {
  const { data } = await api.getCategories()
  categoryTreeOptions.value = data
}

async function beforeUploadImage(data) {
  var types = [
    'image/avif',
    'image/vnd.microsoft.icon',
    'image/jpeg',
    'image/tiff',
    'image/bmp',
    'image/svg+xml',
    'image/webp',
    'image/png',
  ]
  if (types.indexOf(data.file.file?.type) == -1) {
    $message.error('只能上传图片文件，请重新上传')
    return false
  }
  return true
}

const customRequest = ({
  file,
  data,
  headers,
  withCredentials,
  action,
  onFinish,
  onError,
  onProgress,
}) => {
  const formData = new FormData()
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })
  }
  formData.append('file', file.file)
  api
    .uploadImage(
      formData,
      headers,
      (progressEvent) => {
        var percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress({ percent: Math.ceil(percent) })
        $message.loading(t('views.content.label_uploading') + ` ${Math.ceil(percent)}%`)
      },
      timeout_time
    )
    .then((response) => {
      $message.success(response.msg)
      imageForm.value.image_url = response.data
      onFinish()
    })
    .catch((error) => {
      onError()
    })
}
api.getOrderOptionVisitor().then((res) => {
  if (res.code == 200) {
    options.value = res.data.map((e) => JSON.parse(e))
  }
})
</script>

<template>
  <!-- 业务页面 -->
  <CommonPage show-footer :title="$t('views.content.label_blog_list')">
    <template #action>
      <NButton v-permission="'post/api/v1/blog/create'" type="primary" @click="handleClickAdd">
        <TheIcon icon="material-symbols:add" :size="18" class="mr-5" />{{
          $t('views.content.label_new_blog')
        }}
      </NButton>
    </template>

    <!-- 表格 -->
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :is-pagination="true"
      :columns="columns"
      :get-data="api.getBlogs"
      @update:query-items="resetQuery"
      class="mobile-table"
    >
      <template #queryBar>
        <div class="query-bar mobile-query-bar">
          <QueryBarItem label="标题" :label-width="40" class="query-bar-item">
            <NInput
              v-model:value="queryItems.title"
              clearable
              type="text"
              placeholder="请输入图片标题"
              @keypress.enter="$table?.handleSearch()"
            />
          </QueryBarItem>
          <QueryBarItem label="描述" :label-width="40" class="query-bar-item">
            <NInput
              v-model:value="queryItems.desc"
              clearable
              type="text"
              placeholder="请输入图片描述"
              @keypress.enter="$table?.handleSearch()"
            />
          </QueryBarItem>
          <QueryBarItem label="地点" :label-width="40" class="query-bar-item">
            <n-auto-complete
              v-model:value="queryItems.location"
              :input-props="{
                autocomplete: 'enabled',
              }"
              :options="locations"
              placeholder="请输入图片地点"
              clearable
              filterable
              @search="getLocations"
              @keypress.enter="$table?.handleSearch()"
            />
          </QueryBarItem>
          <QueryBarItem label="排序" :label-width="40" class="query-bar-item mobile-full-width">
            <n-select
              v-model:value="queryItems.order_option"
              :options="options"
              class="mobile-full-width"
              @keypress.enter="$table?.handleSearch()"
              @update:value="$table?.handleSearch()"
            />
          </QueryBarItem>
          <QueryBarItem label="分类" :label-width="40" class="query-bar-item mobile-full-width">
            <NTreeSelect
              v-model:value="queryItems.categories"
              key-field="id"
              label-field="name"
              :options="categoryTreeOptions"
              checkable
              multiple
              default-expand-all
              class="mobile-full-width"
              @click="getTreeSelect"
              @update:value="$table?.handleSearch()"
            />
          </QueryBarItem>
          <div class="query-actions mobile-full-width">
            <NButton type="primary" @click="$table?.handleSearch()" class="mobile-full-width">
              搜索
            </NButton>
            <NButton @click="$table?.handleReset()" class="mobile-full-width">
              重置
            </NButton>
          </div>
        </div>
      </template>
    </CrudTable>

    <!-- 新增/编辑/查看 弹窗 -->
    <CrudModal
      v-model:visible="modalVisible"
      :title="modalTitle"
      :loading="modalLoading"
      @save="handleSave(getTreeSelect, getLocations)"
      @on-save="null"
    >
      <!-- 表单 -->
      <NForm
        ref="modalFormRef"
        label-placement="top"
        label-align="left"
        :label-width="80"
        :model="modalForm"
      >
        <NFormItem
          label="标题"
          path="title"
          :rule="{
            required: true,
            message: '请输入标题',
            trigger: ['input', 'blur'],
          }"
        >
          <NInput
            v-model:value="modalForm.title"
            placeholder="请输入标题"
            maxlength="50"
            clearable
            show-count
          />
        </NFormItem>
        <NTabs v-model:value="activeTab" type="line">
          <NTabPane name="images" tab="图片管理">
            <NFormItem
              label="图片列表"
              path="media"
              :rule="{
                required: true,
                trigger: ['change', 'blur'],
                validator: (rule, value) => {
                  const hasImages = modalForm.images && modalForm.images.length > 0
                  if (!hasImages) {
                    return new Error('请至少添加一张图片')
                  }
                  return true
                },
              }"
            >
          <div class="image-grid">
            <draggable
              class="image-draggable"
              :list="modalForm.images || []"
              item-key="image_url"
              animation="300"
              @end="onDragChange"
            >
              <template #item="{ element, index }">
                <div
                  class="image-card"
                  @mouseenter="hoverIndex = index"
                  @mouseleave="hoverIndex = -1"
                >
                  <n-image
                    style="width: 100%; height: 100%"
                    object-fit="cover"
                    width="100%"
                    height="100%"
                    :src="element.image_url + thumbnail_suffix"
                    fallback-src="/assets/error.svg"
                    show-toolbar-tooltip
                  />
                  <div v-if="hoverIndex === index" class="image-actions">
                    <n-button size="tiny" text class="image-action" @click="editImage(index)">
                      <TheIcon
                        icon="material-symbols:edit-outline"
                        :size="18"
                        class="mr-5"
                        color="white"
                      />
                    </n-button>
                    <n-button size="tiny" text class="image-action" @click="removeImage(index)">
                      <TheIcon
                        icon="material-symbols:delete-outline"
                        :size="18"
                        class="mr-5"
                        color="white"
                      />
                    </n-button>
                  </div>
                </div>
              </template>
            </draggable>
            <div slot="footer" class="image-card add-card" @click="showAddImageModal = true">
              <TheIcon icon="material-symbols:add" :size="28" class="mr-5" />
            </div>
          </div>
          <!-- 弹出框：新增或编辑图片 -->
          <NModal
            v-model:show="showAddImageModal"
            :title="editIndex == null ? '添加图片' : '编辑图片'"
            preset="dialog"
            :show-icon="false"
          >
            <n-form :model="imageForm" label-width="60px" style="margin-top: 24px">
              <n-form-item
                label="图片地址"
                path="image_url"
                :rule="{
                  required: true,
                  message: '请输入图片地址',
                  trigger: ['input', 'blur'],
                }"
              >
                <div
                  flex
                  style="width: 100%; flex-wrap: nowrap; flex-direction: row; column-gap: 10px"
                >
                  <n-popover
                    trigger="hover"
                    placement="bottom"
                    :keep-alive-on-hover="false"
                    :disabled="imageForm.image_url == undefined || imageForm.image_url == ''"
                  >
                    <template #trigger>
                      <NInput
                    v-model:value="imageForm.image_url"
                    type="text"
                    placeholder="请输入图片地址"
                    clearable
                  />
                    </template>
                    <NImage
                      v-if="imageForm.image_url != undefined && imageForm.image_url != ''"
                      width="200"
                      :src="imageForm.image_url + thumbnail_suffix"
                      style="border-radius: 8px"
                      show-toolbar-tooltip
                      fallback-src="/assets/error.svg"
                    >
                    </NImage>
                    <template #footer> </template>
                  </n-popover>
                  <n-upload
                    v-if="settingStore.storageSetting.enable_storage"
                    style="flex: 1"
                    :action="api.uploadApi"
                    :custom-request="customRequest"
                    accept=".tif,.jpg,.jpeg,.ico,.tiff,.gif,.svg,.jfif,.webp,.png,.bmp,.jpeg,.avif"
                    :show-file-list="false"
                    @before-upload="beforeUploadImage"
                  >
                    <n-button>上传图片</n-button>
                  </n-upload>
                </div>
              </n-form-item>
              <NFormItem label="标题" path="title">
                <NInput
                  v-model:value="imageForm.title"
                  placeholder="可选，留空则使用帖子标题"
                  maxlength="50"
                  show-count
                  clearable
                />
              </NFormItem>
              <NFormItem label="描述" path="desc">
                <NInput
                  v-model:value="imageForm.desc"
                  type="textarea"
                  placeholder="可选，留空则使用帖子描述"
                />
              </NFormItem>
              <div
                flex
                style="width: 100%; flex-wrap: nowrap; flex-direction: row; column-gap: 10px"
              >
                <NFormItem label="时间" path="time" style="flex: 1">
                  <NDatePicker
                    v-model:formatted-value="imageForm.time"
                    type="datetime"
                    placeholder="可选，留空则使用帖子时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :is-date-disabled="disablePreviousDate"
                  />
                </NFormItem>
                <NFormItem label="地点" path="location" style="flex: 1">
                  <n-auto-complete
                    v-model:value="imageForm.location"
                    :input-props="{
                      autocomplete: 'enabled',
                    }"
                    :options="locations"
                    placeholder="可选，留空则使用帖子地点"
                    clearable
                    filterable
                    @search="getLocations"
                  />
                </NFormItem>
              </div>
              <NFormItem label="EXIF" path="location" style="flex: 1">
                <div
                  flex
                  style="width: 100%; flex-wrap: nowrap; flex-direction: row; column-gap: 10px"
                >
                  <NInput
                    v-model:value="imageForm.metadata"
                    type="textarea"
                    placeholder="图片附带的EXIF信息"
                    style="flex: 3"
                  />
                  <div
                    flex
                    style="
                      width: 100%;
                      flex-wrap: nowrap;
                      flex-direction: column;
                      row-gap: 10px;
                      flex: 1;
                    "
                  >
                    <n-button :disabled="parsingEXIF" @click="fetchMetadata">获取信息</n-button>
                    <n-button :disabled="parsingEXIF" @click="fetchPictureTime">获取时间</n-button>
                  </div>
                </div>
              </NFormItem>
              <NFormItem label="隐藏图片" path="is_hidden">
                <NSwitch v-model:value="imageForm.is_hidden" />
              </NFormItem>
            </n-form>
            <template #action>
                <n-button @click="handleSaveImage">保存</n-button>
              </template>
            </NModal>
            </NFormItem>
          </NTabPane>
          

        </NTabs>
        <NFormItem label="描述" path="desc">
          <NInput
            v-model:value="modalForm.desc"
            type="textarea"
            placeholder="请输入描述（将会展示在图片详情页面）"
          />
        </NFormItem>
        <div flex style="width: 100%; flex-wrap: nowrap; flex-direction: row; column-gap: 10px">
          <NFormItem label="时间" path="time" style="flex: 1">
            <NDatePicker
              v-model:formatted-value="modalForm.time"
              type="datetime"
              placeholder="请输入时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              :is-date-disabled="disablePreviousDate"
            />
          </NFormItem>
          <NFormItem label="地点" path="location" style="flex: 1">
            <n-auto-complete
              v-model:value="modalForm.location"
              :input-props="{
                autocomplete: 'enabled',
              }"
              :options="locations"
              placeholder="请输入地点"
              clearable
              filterable
              @search="getLocations"
            />
          </NFormItem>
        </div>
        <NFormItem label="分类" path="categories">
          <NTreeSelect
            v-model:value="modalForm.category_ids"
            multiple
            checkable
            key-field="id"
            label-field="name"
            :options="categoryTreeOptions"
            default-expand-all
            :disabled="blogDisabled"
            @click="getTreeSelect"
          />
        </NFormItem>
        <NFormItem label="隐藏图片" path="is_hidden">
          <NSwitch v-model:value="modalForm.is_hidden" />
        </NFormItem>
      </NForm>
    </CrudModal>
    
    <!-- 视频预览模态框 -->

  </CommonPage>
</template>
<style>
.n-button.n-button--info-type.n-button--medium-type.n-button--secondary {
  margin-top: 3px;
  margin-bottom: 3px;
}

.table-image img {
  object-fit: cover !important;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-draggable {
  display: contents;
  /* 让 draggable 元素不破坏 grid 布局 */
}

.image-card {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background-color: #f8f8f8;
}

.image-card .image-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 4px;
}

.image-card .image-action {
  height: 28px;
  width: 28px;
  transition: opacity 0.3s ease-in-out;
}

.image-card .image-action .mr-5 {
  margin: 0px;
}

.image-card .image-action:hover {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
}

.add-card {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
  cursor: pointer;
  color: #999;
  transition: all 0.3s ease;
}

.add-card:hover {
  background-color: #f1f1f1;
}

/* 移动端查询栏优化 */
@media (max-width: 768px) {
  .mobile-query-bar {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .query-bar-item {
    width: 100% !important;
    margin-bottom: 0 !important;
  }
  
  .query-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  
  .query-actions .n-button {
    flex: 1;
  }
}

/* 移动端表格优化 */
@media (max-width: 768px) {
  .mobile-table {
    overflow-x: auto;
  }
  
  .mobile-table .n-data-table-wrapper {
    min-width: 600px;
  }
}

/* 移动端图片网格优化 */
@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;
    gap: 8px !important;
  }
  
  .image-card {
    width: 100px !important;
    height: 100px !important;
  }
  
  .image-card .image-actions {
    top: 2px !important;
    right: 2px !important;
  }
  
  .image-card .image-action {
    width: 24px !important;
    height: 24px !important;
  }
}

@media (max-width: 480px) {
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)) !important;
  }
  
  .image-card {
    width: 80px !important;
    height: 80px !important;
  }
}


</style>
