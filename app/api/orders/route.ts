import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { OrderStatus } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id query param is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          size,
          price,
          products ( id, name, slug, images )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const body = await request.json();

    const { user_id, items } = body as {
      user_id: string;
      items: { product_id: string; quantity: number; size: string; price: number }[];
    };

    if (!user_id || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, items' },
        { status: 400 }
      );
    }

    const total_amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id, total_amount, status: 'PENDING' as OrderStatus })
      .select('id, user_id, total_amount, status, created_at')
      .single();

    if (orderError || !orderData) {
      return NextResponse.json({ error: orderError?.message ?? 'Failed to create order' }, { status: 500 });
    }

    const order = orderData as { id: string; user_id: string; total_amount: number; status: string; created_at: string };
    const orderItems = items.map((item) => ({ ...item, order_id: order.id }));
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
