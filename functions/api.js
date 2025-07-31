// Cloudflare Pages Functions处理器
// 由于Cloudflare Pages不直接支持Python，这里提供一个代理方案

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 如果是API请求，代理到后端服务
  if (url.pathname.startsWith('/api/')) {
    // 这里需要配置你的后端服务地址
    const backendUrl = env.BACKEND_URL || 'https://your-backend-service.com';
    const targetUrl = new URL(url.pathname + url.search, backendUrl);
    
    // 创建新的请求
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    
    // 转发请求到后端
    const response = await fetch(newRequest);
    
    // 添加CORS头
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...response.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
    return newResponse;
  }
  
  // 对于非API请求，返回静态文件
  return context.next();
}

// 处理OPTIONS请求（CORS预检）
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}