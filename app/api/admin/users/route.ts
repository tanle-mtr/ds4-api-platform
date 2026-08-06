import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/adminKeyStore';
import { ServiceUserStore, CreateServiceUserInput } from '@/lib/serviceUserStore';

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: { message: 'Unauthorized', code: 'unauthorized' } }, { status: 401 });
    }
    const users = await ServiceUserStore.list();
    return NextResponse.json({ users });
  } catch (err) {
    console.error('List service users error:', err);
    return NextResponse.json({ error: { message: 'Failed to list users', code: 'internal_error' } }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: { message: 'Unauthorized', code: 'unauthorized' } }, { status: 401 });
    }
    const body = (await request.json()) as Partial<CreateServiceUserInput>;
    const name = body?.name?.trim();
    if (!name) {
      return NextResponse.json({ error: { message: '用户名不能为空', code: 'invalid_name' } }, { status: 400 });
    }
    const plan = body?.plan || 'free';
    if (!['free', 'professional', 'team'].includes(plan)) {
      return NextResponse.json({ error: { message: '无效的套餐类型', code: 'invalid_plan' } }, { status: 400 });
    }
    const user = await ServiceUserStore.create({
      name,
      email: body?.email?.trim() || '',
      plan: plan as CreateServiceUserInput['plan'],
      quotaTotal: body?.quotaTotal,
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error('Create service user error:', err);
    return NextResponse.json({ error: { message: 'Failed to create user', code: 'internal_error' } }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
