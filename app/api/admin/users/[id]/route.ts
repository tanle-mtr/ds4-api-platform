import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/adminKeyStore';
import { ServiceUserStore } from '@/lib/serviceUserStore';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: { message: 'Unauthorized', code: 'unauthorized' } }, { status: 401 });
    }
    const id = (await params).id;
    const body = (await request.json()) as Record<string, unknown>;

    const patch: Record<string, unknown> = {};
    if (typeof body.name === 'string') patch.name = body.name.trim();
    if (typeof body.email === 'string') patch.email = body.email.trim();
    if (typeof body.plan === 'string' && ['free', 'professional', 'team'].includes(body.plan)) {
      patch.plan = body.plan;
    }
    if (typeof body.isActive === 'boolean') patch.isActive = body.isActive;
    if (typeof body.quotaTotal === 'number' && body.quotaTotal > 0) patch.quotaTotal = body.quotaTotal;
    if (body.resetUsage === true) patch.resetUsage = true;
    if (body.regenerateKey === true) patch.regenerateKey = true;

    const user = await ServiceUserStore.update(id, patch as never);
    if (!user) {
      return NextResponse.json({ error: { message: '用户不存在', code: 'not_found' } }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (err) {
    console.error('Update service user error:', err);
    return NextResponse.json({ error: { message: 'Failed to update user', code: 'internal_error' } }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: { message: 'Unauthorized', code: 'unauthorized' } }, { status: 401 });
    }
    const ok = await ServiceUserStore.remove((await params).id);
    if (!ok) {
      return NextResponse.json({ error: { message: '用户不存在', code: 'not_found' } }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Delete service user error:', err);
    return NextResponse.json({ error: { message: 'Failed to delete user', code: 'internal_error' } }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';