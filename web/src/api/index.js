import { request, createAxios } from '@/utils'

// 为数据迁移创建专用的长超时axios实例
const longTimeoutRequest = createAxios({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 60000, // 60秒超时
})

export default {
  uploadApi: import.meta.env.VITE_BASE_API + '/admin/base/upload',
  login: (data) => request.post('/admin/base/access_token', data, { noNeedToken: true }),
  getUserInfo: () => request.get('/admin/base/user/info'),
  getPresignedUrl: (data = {}) => request.post('/admin/base/presign', data),
  uploadImage: (data, headers, onUploadProgress, timeout) =>
    request.post('/admin/base/upload', data, {
      headers: headers,
      onUploadProgress: onUploadProgress,
      timeout: timeout * 1000,
    }),
  // profile
  updatePassword: (data = {}) => request.post('/admin/base/user/update_password', data),
  // users
  updateUser: (data = {}) => request.post('/admin/base/user/update', data),
  // blogs
  getBlogs: (data = {}) => request.post('/admin/blog/list', data),
  getBlogAndCategoryCount: () => request.get('/admin/blog/count'),
  getBlogLocations: (params = {}) => request.get('/admin/blog/locations', { params }),
  createBlog: (data = {}) => request.post('/admin/blog/create', data),
  updateBlog: (data = {}) => request.post('/admin/blog/update', data),
  deleteBlog: (params = {}) => request.delete('/admin/blog/delete', { params }),
  // categories
  getCategories: (params = {}) => request.get('/admin/category/list', { params }),
  getCategoryById: (params = {}) => request.get('/admin/category/get/id', { params }),
  getCategoryByAlias: (params = {}) => request.get('/admin/category/get/alias', { params }),
  createCategory: (data = {}) => request.post('/admin/category/create', data),
  updateCategory: (data = {}) => request.post('/admin/category/update', data),
  deleteCategory: (params = {}) => request.delete('/admin/category/delete', { params }),
  // settings
  getGeneralSetting: () => request.get('/admin/setting/get/general'),
  getMetaSetting: () => request.get('/admin/setting/get/meta'),
  getContentSetting: () => request.get('/admin/setting/get/content'),
  getStorageSetting: () => request.get('/admin/setting/get/storage'),
  updateSetting: (data = {}) => request.post('/admin/setting/update', data),
  updateGeneralSetting: (data = {}) => request.post('/admin/setting/update/general', data),
  updateMetaSetting: (data = {}) => request.post('/admin/setting/update/meta', data),
  updateContentSetting: (data = {}) => request.post('/admin/setting/update/content', data),
  updateStorageSetting: (data = {}) => request.post('/admin/setting/update/storage', data),
  // api tokens
  getApiTokens: () => request.get('/admin/api-token/list'),
  createApiToken: (data = {}) => request.post('/admin/api-token/create', data),
  updateApiToken: (id, data = {}) => request.put(`/admin/api-token/update/${id}`, data),
  regenerateApiToken: (id) => request.post(`/admin/api-token/regenerate/${id}`),
  toggleApiToken: (id) => request.post(`/admin/api-token/toggle/${id}`),
  deleteApiToken: (id) => request.delete(`/admin/api-token/delete/${id}`),
  createDefaultApiToken: () => request.post('/admin/api-token/create-default'),
  // database settings
  getDatabaseSetting: () => request.get('/admin/setting/get/database'),
  updateDatabaseSetting: (data = {}) => request.post('/admin/setting/update/database', data),
  testDatabaseConnection: (data = {}) => request.post('/admin/database/test-connection', data),
  migrateDatabaseData: (data = {}) => longTimeoutRequest.post('/admin/database/migrate', data),
  // visitor
  getOrderOptionVisitor: () => request.get('/visitor/order/list'),
  getBlogsVisitor: (params = {}) => request.get('/visitor/blog/list', { params }),
  getCategoriesVisitor: (params = {}) => request.get('/visitor/category/list', { params }),
  getCategoryByAliasVisitor: (params = {}) =>
    request.get('/visitor/category/get/alias', { params }),
}
