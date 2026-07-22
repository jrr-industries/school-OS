import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@schoolos/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from('School')
      .update({ ...body, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase
      .from('School')
      .update({ status: 'inactive', deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
