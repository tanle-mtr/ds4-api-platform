# DS4 API Platform

基于 DS4（无依赖）的 API 开放平台，支持多模型、配额管理和 OpenAI 兼容接口。

## 🚀 特性

- **多模型支持**: 支持 Llama、Qwen、DeepSeek 等多种开源大模型
- **OpenAI 兼容**: 提供完全兼容 OpenAI 的 API 接口
- **流式响应**: 支持流式和非流式响应
- **配额管理**: 基于 Upstash Redis 的配额管理系统
- **API Key 鉴权**: 安全的 API Key 认证机制
- **管理员后台**: 完整的后台管理功能
- **许可证合规**: 自动校验模型许可证，只允许商用友好的许可证

## 📋 前置要求

- Node.js 18+
- npm 或 pnpm
- Vercel 账户（用于部署）

## 🛠️ 安装

1. 克隆项目
```bash
git clone https://github.com/your-repo/ds4-api-platform.git
cd ds4-api-platform
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env.local
```

4. 编辑 `.env.local` 文件，填入您的配置信息

## 🚀 快速开始

### 本地开发

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 测试 API

```bash
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-ds4-test-key" \
  -d '{
    "model": "llama-3-70b",
    "messages": [
      {"role": "user", "content": "你好，请介绍一下自己"}
    ]
  }'
```

## 📖 API 文档

详细 API 文档请访问 [API 文档](/docs)

### 主要端点

- `POST /v1/chat/completions` - 创建聊天补全
- `GET /v1/models` - 获取可用模型列表
- `GET /v1/user/usage` - 获取用户用量统计

## 🏗️ 项目结构

```
ds4-api-platform/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── chat/
│   │       │   └── completions/
│   │       │       └── route.ts
│   │       ├── models/
│   │       │   └── route.ts
│   │       └── user/
│   │           └── usage/
│   │               └── route.ts
│   ├── admin/
│   │   └── page.tsx
│   ├── callback/
│   │   └── page.tsx
│   ├── console/
│   │   └── page.tsx
│   ├── docs/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── textarea.tsx
├── lib/
│   ├── apiKey.ts
│   ├── auth.ts
│   ├── license.ts
│   ├── openai.ts
│   ├── payment.ts
│   ├── quota.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── middleware.ts
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## 📦 许可证

本项目使用 MIT License，允许商业使用。

### 使用的外部组件

- **Next.js**: MIT License
- **React**: MIT License
- **Casdoor**: Apache-2.0 License
- **DaxPay**: LGPL-3.0 License
- **Upstash Redis**: MIT License
- **OpenAI SDK**: MIT License

所有使用的组件都允许商业使用。

## 🚢 部署

### Vercel 部署

1. 安装 Vercel CLI
```bash
npm install -g vercel
```

2. 登录 Vercel
```bash
vercel login
```

3. 部署项目
```bash
vercel
```

详细部署说明请参考 [DEPLOYMENT.md](DEPLOYMENT.md)

## 🔧 配置说明

### Casdoor 配置
```env
CASDOOR_ORG_NAME=ds4-org
CASDOOR_APP_NAME=ds4-platform
CASDOOR_CLIENT_ID=your-client-id
CASDOOR_CLIENT_SECRET=your-client-secret
CASDOOR_REDIRECT_URI=https://your-domain.com/callback
```

### Upstash Redis 配置
```env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### DaxPay 配置
```env
DAXPAY_API_URL=https://your-daxpay-domain.com
DAXPAY_APP_ID=your-app-id
DAXPAY_SECRET_KEY=your-secret-key
```

### 管理密钥（收款设置）
```env
# 管理后台「收款设置」页签保存收款方式时需要
ADMIN_API_KEY=your-long-random-admin-key
```

## 💰 管理员设置收款方式（到自己的钱包）

1. 在 Vercel 环境变量中设置 `ADMIN_API_KEY`（随机长字符串）
2. 打开管理后台 → 点击「收款设置」页签
3. 输入相同的 `ADMIN_API_KEY` 解锁（密钥仅保存在浏览器 localStorage，用于请求鉴权）
4. 配置各渠道收款信息：
   - **支付宝收款**：填写收款支付宝账号（打款到您自己的账户）
   - **微信收款**：填写微信商户号或收款账号
   - **云闪付收款**：填写云闪付商户号
   - **加密货币收款**：填写您的钱包地址（如 USDT 地址）
5. 可启用/停用渠道、填写收款二维码图片 URL、币种
6. 点击「保存收款配置」——配置持久化到 Upstash Redis（密钥单独加密键存储，不返回浏览器）

保存后，`DaxPayService.getPaymentMethods()` 会返回管理员配置的收款渠道列表，支付流程将引导用户打款到管理员配置的账户/钱包。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- Email: support@your-domain.com
- GitHub: https://github.com/your-repo

## 📄 许可证

[MIT License](LICENSE)

---

**注意**: 本项目仅供学习和参考使用，生产环境部署前请充分测试并配置安全措施。
