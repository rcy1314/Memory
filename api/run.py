from app import app
from mangum import Mangum

# 使用 Mangum 适配器将 FastAPI 应用转换为 ASGI 兼容的处理器
handler = Mangum(app, lifespan="off")

# Vercel 函数入口点
def handler_func(request, context=None):
    return handler(request, context)

# 导出处理器
app = handler