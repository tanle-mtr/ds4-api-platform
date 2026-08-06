import { NextRequest, NextResponse } from 'next/server';
import { loadPublicPaymentConfig, savePaymentConfig, validatePaymentConfig } from '@/lib/paymentConfig';
import { isAdmin } from '@/lib/adminKeyStore';
import { PaymentConfig } from '@/types';

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: { message: 'Unauthorized', code: 'unauthorized' } }, { status: 401 });
    }
    const config = await loadPublicPaymentConfig();
    return NextResponse.json(config);
  } catch (err) {
    console.error('Get payment config error:', err);
    return NextResponse.json({ error: { message: 'Failed to load config', code: 'internal_error' } }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: { message: 'Unauthorized', code: 'unauthorized' } }, { status: 401 });
    }
    const body = (await request.json()) as PaymentConfig;
    const validation = validatePaymentConfig(body);
    if (!validation.ok) {
      return NextResponse.json({ error: { message: validation.error || 'Invalid config', code: 'invalid_config' } }, { status: 400 });
    }
    const saved = await savePaymentConfig(body);
    return NextResponse.json(saved);
  } catch (err) {
    console.error('Save payment config error:', err);
    return NextResponse.json({ error: { message: 'Failed to save config', code: 'internal_error' } }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';