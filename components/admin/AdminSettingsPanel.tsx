'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdminKeyState {
  initialized: boolean;
  source: 'redis' | 'env' | 'memory' | null;
}

export function AdminSettingsPanel({ getAdminKey, onKeySaved }: { getAdminKey: () => string; onKeySaved: () => void }) {
  const [state, setState] = useState<AdminKeyState | null>(null);
  const [newKey, setNewKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  const loadState = async () => {
    try {
      const res = await fetch('/api/admin/config');
      const data = await res.json();
      setState(data);
    } catch (error) {
      setStatus(`加载失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  const handleSave = async () => {
    setStatus('');
    if (newKey.trim().length < 8) {
      setStatus('管理密钥至少需要 8 个字符');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': getAdminKey() },
        body: JSON.stringify({ adminKey: newKey.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.message || '保存失败');
      }
      setStatus(state?.initialized ? '管理密钥已更新' : '管理密钥已设置');
      setNewKey('');
      await loadState();
      onKeySaved();
    } catch (error) {
      setStatus(`保存失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-gray-500">加载中...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>系统设置</CardTitle>
        <CardDescription>
          管理平台的管理密钥（ADMIN_API_KEY）。密钥保存在 Upstash Redis（优先）或服务端内存中，
          所有管理接口（收款设置、服务用户等）均使用此密钥鉴权。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <span className="font-medium">当前状态：</span>
            {state?.initialized ? (
              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                已初始化（来源：{state.source === 'redis' ? 'Redis 存储' : state.source === 'env' ? '环境变量' : '内存'}）
              </span>
            ) : (
              <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                未初始化 - 请设置管理密钥
              </span>
            )}
          </div>
          {state?.initialized && state.source !== 'redis' && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              当前密钥来自{state.source === 'env' ? ' Vercel 环境变量 ADMIN_API_KEY' : '服务端内存'}。
              在下方保存新密钥后，将写入 Redis 并优先使用（无需再修改环境变量）。
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label>{state?.initialized ? '新管理密钥' : '设置管理密钥'}</Label>
            <Input
              type="password"
              placeholder="输入新的管理密钥（至少 8 个字符）"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? '保存中...' : state?.initialized ? '更新管理密钥' : '设置管理密钥'}
            </Button>
            {status && (
              <span className={`text-sm ${status.includes('失败') ? 'text-red-600' : 'text-green-600'}`}>{status}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
