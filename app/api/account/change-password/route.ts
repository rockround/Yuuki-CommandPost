import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const { currentPassword, newPassword } = await req.json();
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });

  let payload: any;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get user by id
  const { data: user, error } = await adminSupabase
    .from('users')
    .select('id, password_hash')
    .eq('id', payload.id)
    .single();

  if (error || !user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) {
    return NextResponse.json({ success: false, message: 'Current password incorrect' }, { status: 401 });
  }

  // Hash new password
  const newHash = await bcrypt.hash(newPassword, 10);
  const { error: updateError } = await adminSupabase
    .from('users')
    .update({ password_hash: newHash })
    .eq('id', payload.id);

  if (updateError) {
    return NextResponse.json({ success: false, message: 'Failed to update password' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 