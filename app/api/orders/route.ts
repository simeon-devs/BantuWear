import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sanityClient } from '@/lib/sanity';
import { sanityWriteClient } from '@/lib/sanity-write';

const ordersByUserQuery = `*[_type == "order" && userId == $userId] | order(_createdAt desc) {
  "_id": _id,
  status,
  totalAmount,
  items,
  shippingAddress,
  "_createdAt": _createdAt
}`;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = await sanityClient.fetch(ordersByUserQuery, { userId: session.user.id });
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { items, totalAmount, shippingAddress } = body;

  if (!items?.length || !totalAmount || !shippingAddress) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const order = await sanityWriteClient.create({
    _type: 'order',
    userId: session.user.id,
    userEmail: session.user.email,
    status: 'PENDING',
    totalAmount,
    shippingAddress,
    items,
  });

  return NextResponse.json({ order }, { status: 201 });
}
