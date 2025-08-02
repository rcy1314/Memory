export const OUTPUT_DIR = '../dist'

export const PROXY_CONFIG = {
  '/api/v1': {
    target: 'http://127.0.0.1:9573',
    changeOrigin: true,
  },
}
