#!/bin/bash

# 一键部署脚本
# 支持部署到 Vercel, Netlify, Cloudflare Pages, Fly.io

set -e

echo "🚀 Memory App 一键部署脚本"
echo "支持的平台: vercel, netlify, cloudflare, fly"
echo ""

# 检查参数
if [ $# -eq 0 ]; then
    echo "请指定部署平台:"
    echo "  ./deploy.sh vercel     - 部署到 Vercel"
    echo "  ./deploy.sh netlify    - 部署到 Netlify"
    echo "  ./deploy.sh cloudflare - 部署到 Cloudflare Pages"
    echo "  ./deploy.sh fly        - 部署到 Fly.io"
    exit 1
fi

PLATFORM=$1

# 检查必要的工具
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ 错误: $1 未安装"
        echo "请先安装 $1: $2"
        exit 1
    fi
}

# 构建前端
build_frontend() {
    echo "📦 构建前端..."
    cd web
    npm install
    npm run build
    cd ..
    echo "✅ 前端构建完成"
}

case $PLATFORM in
    "vercel")
        echo "🔵 部署到 Vercel"
        check_command "vercel" "npm i -g vercel"
        build_frontend
        echo "开始部署..."
        vercel --prod
        echo "✅ Vercel 部署完成!"
        ;;
    
    "netlify")
        echo "🟢 部署到 Netlify"
        check_command "netlify" "npm i -g netlify-cli"
        
        # 检查是否安装了mangum
        echo "📦 安装Python依赖..."
        pip install mangum
        
        build_frontend
        echo "开始部署..."
        netlify deploy --prod --dir=dist --functions=netlify/functions
        echo "✅ Netlify 部署完成!"
        ;;
    
    "cloudflare")
        echo "🟠 部署到 Cloudflare Pages"
        check_command "wrangler" "npm i -g wrangler"
        build_frontend
        echo "开始部署..."
        wrangler pages publish dist --project-name=memory-app
        echo "✅ Cloudflare Pages 部署完成!"
        echo "⚠️  注意: 后端API需要单独部署到Cloudflare Workers或其他服务"
        ;;
    
    "fly")
        echo "🟣 部署到 Fly.io"
        check_command "flyctl" "https://fly.io/docs/hands-on/install-flyctl/"
        
        # 检查是否已经初始化fly app
        if [ ! -f "fly.toml" ]; then
            echo "初始化 Fly.io 应用..."
            flyctl apps create memory-app
        fi
        
        echo "开始部署..."
        flyctl deploy --dockerfile Dockerfile.fly
        echo "✅ Fly.io 部署完成!"
        ;;
    
    *)
        echo "❌ 不支持的平台: $PLATFORM"
        echo "支持的平台: vercel, netlify, cloudflare, fly"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署完成! 请查看上方输出获取访问地址。"
echo "📚 更多部署说明请查看 DEPLOYMENT.md"