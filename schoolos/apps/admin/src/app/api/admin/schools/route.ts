import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@schoolos/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from('School')
      .insert({
        name: body.schoolName,
        slug: body.schoolCode || body.schoolName.toLowerCase().replace(/\s+/g, '-'),
        type: body.schoolType?.toLowerCase().replace(/\s+/g, '_') || 'private',
        status: 'trial',
        address: body.fullAddress,
        city: body.city,
        state: body.state,
        country: body.country,
        postalCode: body.postalCode,
        phone: body.phoneNumber,
        email: body.email,
        website: body.website,
        logo: body.schoolLogoUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
