module.exports = {
  extends: ['@zclzone', '@unocss', './.eslint-global-variables.json'],
  rules: {
    // 在 Vue 3 中，允许 v-model:value 语法
    'vue/no-v-model-argument': 'off',
    // 禁用 vue/valid-v-model 规则，因为它不支持 Vue 3 的 v-model:value 语法
    'vue/valid-v-model': 'off',
  },
}