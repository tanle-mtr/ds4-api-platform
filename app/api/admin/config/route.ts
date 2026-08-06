import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminKeyState,
  setAdminKey,
  isAdmin,
  isValidAdminKeyFormat,
} from '@/lib/adminKeyStore';

export async function GET() {
  try {
    const state = await getAdminKeyState();
    return NextResponse.json(state);
  } catch (err) {
    console.error('Get admin key state error:', err);
    return NextResponse.json({ error: { message: 'Failed to load config', code: 'internal_error' } }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as { adminKey?: string };

    const key = body?.adminKey;
    if (!key || !isValidAdminKeyFormat(key)) {
      return NextResponse.json(
        { error: { message: '管理密钥至少需要 8 个字符', code: 'invalid_key' } },
        { status: 400 }
      );
    }

    const state = await getAdminKeyState();

    if (state.initialized) {
      if (!(await isAdmin(request))) {
        return NextResponse.json({ error: { message: 'Unauthorized', code: 'unauthorized' } }, { status: 401 });
      }
    }

    await setAdminKey(key.trim());
    return NextResponse.json({ initialized: true, source: 'redis' });
  } catch (err) {
    console.error('Set admin key error:', err);
    return NextResponse.json({ error: { message: 'Failed to save config', code: 'internal_error' } }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
