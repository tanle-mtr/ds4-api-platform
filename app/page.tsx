'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Model } from '@/types';

const models: Model[] = [
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta',
    license: 'Apache-2.0',
    description: "Meta's Llama 3 70B parameter model",
    maxTokens: 8192,
    pricing: { free: 0.01, professional: 0.002, team: 0.001 },
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'qwen-72b',
    name: 'Qwen 72B',
    provider: 'Alibaba',
    license: 'Apache-2.0',
    description: "Alibaba's Qwen 72B parameter model",
    maxTokens: 8192,
    pricing: { free: 0.01, professional: 0.002, team: 0.001 },
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'DeepSeek',
    license: 'MIT',
    description: 'DeepSeek Coder model optimized for coding tasks',
    maxTokens: 8192,
    pricing: { free: 0.005, professional: 0.001, team: 0.0005 },
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">DS4</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">DS4 API Platform</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/docs">
              <Button variant="ghost">文档</Button>
            </Link>
            <Link href="/console">
              <Button variant="ghost">控制台</Button>
            </Link>
            <Link href="/admin">
              <Button>管理后台</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            基于 DS4 的 API 开放平台
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            支持多模型、配额管理和 OpenAI 兼容接口，提供企业级的 AI 服务
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/docs">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                开始使用
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="lg" variant="outline">
                管理后台
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          核心功能
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>多模型支持</CardTitle>
              <CardDescription>
                支持多种开源大模型，包括 Llama、Qwen、DeepSeek 等
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {models.map((model) => (
                  <li key={model.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{model.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>OpenAI 兼容</CardTitle>
              <CardDescription>
                提供完全兼容 OpenAI 的 API 接口，支持流式和非流式响应
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">/v1/chat/completions</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">流式响应支持</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">标准 OpenAI 格式</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>配额管理</CardTitle>
              <CardDescription>
                基于 Upstash Redis 的配额管理系统，支持按月重置
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">API Key 鉴权</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">实时用量统计</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">灵活套餐定价</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* API Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          快速开始
        </h2>
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>使用示例</CardTitle>
              <CardDescription>
                使用您的 API Key 调用 OpenAI 兼容的接口
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
{`curl -X POST https://api.your-domain.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-ds4-your-api-key" \\
  -d '{
    "model": "llama-3-70b",
    "messages": [
      {"role": "user", "content": "你好，请介绍一下自己"}
    ]
  }'`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 DS4 API Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}