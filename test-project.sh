#!/bin/bash

echo "================================"
echo "DS4 API Platform 测试脚本"
echo "================================"

echo ""
echo "1. 检查 Node.js 版本..."
node --version

echo ""
echo "2. 检查 npm 版本..."
npm --version

echo ""
echo "3. 检查项目文件..."
if [ -f "package.json" ]; then
    echo "✓ package.json 存在"
else
    echo "✗ package.json 不存在"
    exit 1
fi

if [ -f "tsconfig.json" ]; then
    echo "✓ tsconfig.json 存在"
else
    echo "✗ tsconfig.json 不存在"
    exit 1
fi

if [ -f "next.config.js" ]; then
    echo "✓ next.config.js 存在"
else
    echo "✗ next.config.js 不存在"
    exit 1
fi

echo ""
echo "4. 检查核心文件..."
if [ -f "lib/auth.ts" ]; then
    echo "✓ lib/auth.ts 存在"
else
    echo "✗ lib/auth.ts 不存在"
    exit 1
fi

if [ -f "lib/openai.ts" ]; then
    echo "✓ lib/openai.ts 存在"
else
    echo "✗ lib/openai.ts 不存在"
    exit 1
fi

if [ -f "lib/quota.ts" ]; then
    echo "✓ lib/quota.ts 存在"
else
    echo "✗ lib/quota.ts 不存在"
    exit 1
fi

if [ -f "lib/license.ts" ]; then
    echo "✓ lib/license.ts 存在"
else
    echo "✗ lib/license.ts 不存在"
    exit 1
fi

echo ""
echo "5. 检查 API 路由..."
if [ -f "app/api/v1/chat/completions/route.ts" ]; then
    echo "✓ /v1/chat/completions 路由存在"
else
    echo "✗ /v1/chat/completions 路由不存在"
    exit 1
fi

if [ -f "app/api/v1/models/route.ts" ]; then
    echo "✓ /v1/models 路由存在"
else
    echo "✗ /v1/models 路由不存在"
    exit 1
fi

echo ""
echo "6. 检查页面文件..."
if [ -f "app/page.tsx" ]; then
    echo "✓ 首页存在"
else
    echo "✗ 首页不存在"
    exit 1
fi

if [ -f "app/console/page.tsx" ]; then
    echo "✓ 控制台页面存在"
else
    echo "✗ 控制台页面不存在"
    exit 1
fi

if [ -f "app/admin/page.tsx" ]; then
    echo "✓ 管理后台页面存在"
else
    echo "✗ 管理后台页面不存在"
    exit 1
fi

echo ""
echo "7. 检查 UI 组件..."
if [ -f "components/ui/button.tsx" ]; then
    echo "✓ Button 组件存在"
else
    echo "✗ Button 组件不存在"
    exit 1
fi

if [ -f "components/ui/card.tsx" ]; then
    echo "✓ Card 组件存在"
else
    echo "✗ Card 组件不存在"
    exit 1
fi

if [ -f "components/ui/input.tsx" ]; then
    echo "✓ Input 组件存在"
else
    echo "✗ Input 组件不存在"
    exit 1
fi

echo ""
echo "8. 检查配置文件..."
if [ -f ".env.example" ]; then
    echo "✓ .env.example 存在"
else
    echo "✗ .env.example 不存在"
    exit 1
fi

if [ -f "tailwind.config.js" ]; then
    echo "✓ tailwind.config.js 存在"
else
    echo "✗ tailwind.config.js 不存在"
    exit 1
fi

echo ""
echo "9. 检查文档文件..."
if [ -f "README.md" ]; then
    echo "✓ README.md 存在"
else
    echo "✗ README.md 不存在"
    exit 1
fi

if [ -f "DEPLOYMENT.md" ]; then
    echo "✓ DEPLOYMENT.md 存在"
else
    echo "✗ DEPLOYMENT.md 不存在"
    exit 1
fi

echo ""
echo "10. 检查许可证合规性..."
if grep -q "MIT License" lib/openai.ts && grep -q "Apache-2.0" lib/openai.ts; then
    echo "✓ 许可证声明正确"
else
    echo "✗ 许可证声明可能不完整"
fi

echo ""
echo "================================"
echo "✓ 所有检查通过！"
echo "================================"
echo ""
echo "下一步："
echo "1. 运行 'npm install' 安装依赖"
echo "2. 运行 'npm run dev' 启动开发服务器"
echo "3. 访问 http://localhost:3000"
echo ""
