module.exports = {
  extends: [
    '@zclzone',
    '@unocss',
    './.eslint-global-variables.json'
  ],
  rules: {
    // 禁用 v-model 参数检查规则，允许使用 v-model:value
    'vue/no-v-model-argument': 'off'
  }
}