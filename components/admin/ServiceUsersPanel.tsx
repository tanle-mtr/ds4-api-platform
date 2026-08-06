'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceUser } from '@/types';

export function ServiceUsersPanel({ getAdminKey }: { getAdminKey: () => string }) {
  const [users, setUsers] = useState<ServiceUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', plan: 'free' as ServiceUser['plan'], quotaTotal: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuota, setEditQuota] = useState('');
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', { headers: { 'x-admin-key': getAdminKey() } });
      if (res.status === 401) {
        setStatus('未授权：请在系统设置中先设置管理密钥');
        setUsers([]);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.message || '加载失败');
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      setStatus(`加载失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    setStatus('');
    if (!newUser.name.trim()) {
      setStatus('请填写用户名');
      return;
    }
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': getAdminKey() },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          plan: newUser.plan,
          quotaTotal: newUser.quotaTotal ? parseInt(newUser.quotaTotal) : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.message || '创建失败');
      }
      const data = await res.json();
      setUsers((prev) => [...prev, data.user]);
      setRevealedKey(data.user.apiKey);
      setNewUser({ name: '', email: '', plan: 'free', quotaTotal: '' });
      setStatus(`创建成功！API Key: ${data.user.apiKey}`);
    } catch (error) {
      setStatus(`创建失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handlePatch = async (id: string, patch: Record<string, unknown>, successMsg: string) => {
    setStatus('');
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': getAdminKey() },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.message || '操作失败');
      }
      const data = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
      if (patch.regenerateKey) setRevealedKey(data.user.apiKey);
      setStatus(successMsg);
    } catch (error) {
      setStatus(`${successMsg}失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个服务用户吗？此操作不可恢复。')) return;
    setStatus('');
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': getAdminKey() },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.message || '删除失败');
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setStatus('已删除');
    } catch (error) {
      setStatus(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const planLabel = (plan: string) =>
    plan === 'free' ? '免费版' : plan === 'professional' ? '专业版' : '团队版';

  return (
    <Card>
      <CardHeader>
        <CardTitle>服务用户管理</CardTitle>
        <CardDescription>
          管理 API 服务账号：创建用户、分配 API Key、设置套餐与配额。
          API Key 使用 <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">sk-ds4-</code> 前缀，调用
          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">/api/v1/*</code> 接口时在
          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">Authorization: Bearer</code> 中携带。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-4">创建服务用户</h4>
            <div className="space-y-4">
              <div>
                <Label>用户名 *</Label>
                <Input
                  placeholder="例如：公司 A / 项目 X"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div>
                <Label>邮箱（可选）</Label>
                <Input
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label>套餐</Label>
                <Select
                  value={newUser.plan}
                  onValueChange={(v) => setNewUser({ ...newUser, plan: v as ServiceUser['plan'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择套餐" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">免费版 (1,000,000)</SelectItem>
                    <SelectItem value="professional">专业版 (5,000,000)</SelectItem>
                    <SelectItem value="team">团队版 (10,000,000)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>配额总量（Token，可选，默认按套餐）</Label>
                <Input
                  type="number"
                  placeholder="5000000"
                  value={newUser.quotaTotal}
                  onChange={(e) => setNewUser({ ...newUser, quotaTotal: e.target.value })}
                />
              </div>
              <Button onClick={handleCreate} className="w-full bg-blue-600 hover:bg-blue-700">
                创建用户
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">使用说明</h4>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm space-y-3">
              <div>
                <div className="font-medium mb-1">调用示例</div>
                <pre className="bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto text-xs">
{`curl -X POST https://ds4-api-platform.vercel.app/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-ds4-xxx" \\
  -d '{"model":"llama-3-70b","messages":[{"role":"user","content":"hi"}]}'`}
                </pre>
              </div>
              <div>
                <div className="font-medium mb-1">查询用量</div>
                <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">GET /v1/user/usage</code>
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                配额按 Token 计数，每月自动重置。停用后该用户的 Key 立即失效。
              </div>
            </div>
          </div>
        </div>

        {revealedKey && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm font-medium mb-1">请立即保存 API Key（仅显示一次）</p>
            <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded break-all">{revealedKey}</code>
          </div>
        )}

        {status && (
          <div className={`mb-4 text-sm ${status.includes('失败') || status.includes('未授权') ? 'text-red-600' : 'text-green-600'}`}>
            {status}
          </div>
        )}

        <h4 className="font-semibold mb-4">已创建的用户 ({users.length})</h4>
        {loading ? (
          <div className="text-center py-8 text-gray-500">加载中...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">暂无服务用户，请先创建</div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {user.name}
                        {!user.isActive && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">已停用</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{user.email || '无邮箱'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.plan === 'free' ? 'bg-gray-100 text-gray-800' :
                      user.plan === 'professional' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {planLabel(user.plan)}
                    </span>
                    <div className="text-sm">
                      <span className="font-medium">{user.quota.used.toLocaleString()}</span>
                      <span className="text-gray-500"> / {user.quota.total.toLocaleString()}</span>
                      <span className="text-gray-500"> tokens</span>
                      <span className={`ml-2 ${user.quota.total > 0 && user.quota.used / user.quota.total > 0.9 ? 'text-red-600' : 'text-gray-500'}`}>
                        ({user.quota.total > 0 ? Math.round((user.quota.used / user.quota.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded break-all">
                    {user.apiKey}
                  </code>
                </div>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {editingId === user.id ? (
                    <>
                      <Input
                        type="number"
                        placeholder="新配额总量"
                        value={editQuota}
                        onChange={(e) => setEditQuota(e.target.value)}
                        className="w-40"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const total = parseInt(editQuota);
                          if (!total || total <= 0) {
                            setStatus('配额必须是正整数');
                            return;
                          }
                          handlePatch(user.id, { quotaTotal: total }, '配额已更新');
                          setEditingId(null);
                          setEditQuota('');
                        }}
                      >
                        保存配额
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingId(null); setEditQuota(''); }}>
                        取消
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => { setEditingId(user.id); setEditQuota(String(user.quota.total)); }}>
                        改配额
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePatch(user.id, { resetUsage: true }, '用量已重置')}>
                        重置用量
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePatch(user.id, { regenerateKey: true }, '已生成新 Key')}>
                        重置 Key
                      </Button>
                      <Button
                        size="sm"
                        variant={user.isActive ? 'destructive' : 'default'}
                        onClick={() => handlePatch(user.id, { isActive: !user.isActive }, user.isActive ? '已停用' : '已启用')}
                      >
                        {user.isActive ? '停用' : '启用'}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>
                        删除
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
