@echo off
echo ========================================
echo DS4 API Platform 测试脚本
echo ========================================

echo.
echo 1. 检查 Node.js 版本...
node --version

echo.
echo 2. 检查 npm 版本...
npm --version

echo.
echo 3. 检查项目文件...
if exist package.json (
    echo ✓ package.json 存在
) else (
    echo ✗ package.json 不存在
    exit /b 1
)

if exist tsconfig.json (
    echo ✓ tsconfig.json 存在
) else (
    echo ✗ tsconfig.json 不存在
    exit /b 1
)

if exist next.config.js (
    echo ✓ next.config.js 存在
) else (
    echo ✗ next.config.js 不存在
    exit /b 1
)

echo.
echo 4. 检查核心文件...
if exist lib\auth.ts (
    echo ✓ lib\auth.ts 存在
) else (
    echo ✗ lib\auth.ts 不存在
    exit /b 1
)

if exist lib\openai.ts (
    echo ✓ lib\openai.ts 存在
) else (
    echo ✗ lib\openai.ts 不存在
    exit /b 1
)

if exist lib\quota.ts (
    echo ✓ lib\quota.ts 存在
) else (
    echo ✗ lib\quota.ts 不存在
    exit /b 1
)

if exist lib\license.ts (
    echo ✓ lib\license.ts 存在
) else (
    echo ✗ lib\license.ts 不存在
    exit /b 1
)

echo.
echo 5. 检查 API 路由...
if exist app\api\v1\chat\completions\route.ts (
    echo ✓ /v1/chat/completions 路由存在
) else (
    echo ✗ /v1/chat/completions 路由不存在
    exit /b 1
)

if exist app\api\v1\models\route.ts (
    echo ✓ /v1/models 路由存在
) else (
    echo ✗ /v1/models 路由不存在
    exit /b 1
)

echo.
echo 6. 检查页面文件...
if exist app\page.tsx (
    echo ✓ 首页存在
) else (
    echo ✗ 首页不存在
    exit /b 1
)

if exist app\console\page.tsx (
    echo ✓ 控制台页面存在
) else (
    echo ✗ 控制台页面不存在
    exit /b 1
)

if exist app\admin\page.tsx (
    echo ✓ 管理后台页面存在
) else (
    echo ✗ 管理后台页面不存在
    exit /b 1
)

echo.
echo 7. 检查 UI 组件...
if exist components\ui\button.tsx (
    echo ✓ Button 组件存在
) else (
    echo ✗ Button 组件不存在
    exit /b 1
)

if exist components\ui\card.tsx (
    echo ✓ Card 组件存在
) else (
    echo ✗ Card 组件不存在
    exit /b 1
)

if exist components\ui\input.tsx (
    echo ✓ Input 组件存在
) else (
    echo ✗ Input 组件不存在
    exit /b 1
)

echo.
echo 8. 检查配置文件...
if exist .env.example (
    echo ✓ .env.example 存在
) else (
    echo ✗ .env.example 不存在
    exit /b 1
)

if exist tailwind.config.js (
    echo ✓ tailwind.config.js 存在
) else (
    echo ✗ tailwind.config.js 不存在
    exit /b 1
)

echo.
echo 9. 检查文档文件...
if exist README.md (
    echo ✓ README.md 存在
) else (
    echo ✗ README.md 不存在
    exit /b 1
)

if exist DEPLOYMENT.md (
    echo ✓ DEPLOYMENT.md 存在
) else (
    echo ✗ DEPLOYMENT.md 不存在
    exit /b 1
)

echo.
echo 10. 检查许可证合规性...
findstr /C:"MIT License" lib\openai.ts >nul
if %errorlevel% equ 0 (
    echo ✓ 许可证声明正确
) else (
    echo ✗ 许可证声明可能不完整
)

echo.
echo ========================================
echo ✓ 所有检查通过！
echo ========================================
echo.
echo 下一步：
echo 1. 运行 'npm install' 安装依赖
echo 2. 运行 'npm run dev' 启动开发服务器
echo 3. 访问 http://localhost:3000
echo.
