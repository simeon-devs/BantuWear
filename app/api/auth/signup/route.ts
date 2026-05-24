import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sanityClient, userByEmailQuery } from '@/lib/sanity';
import { sanityWriteClient } from '@/lib/sanity-write';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, name } = body as { email?: string; password?: string; name?: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const existing = await sanityClient.fetch(userByEmailQuery, { email });
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await sanityWriteClient.create({
    _type: 'user',
    email,
    name: name ?? '',
    passwordHash,
    role: 'CUSTOMER',
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
