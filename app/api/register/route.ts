import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { isAllowedAareonEmail, normalizeEmail } from '@/lib/aareonAccess';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Hardcoded role lists
const MANAGERS = [
  'niels.benjamins@aareon.nl',
  'roy.boelens@aareon.nl',
  'marcel.vrieling@aareon.nl',
  'arjen.lok@aareon.nl',
  'ria.feddema@aareon.nl',
  'sjoerd.meertens@aareon.nl',
  'daniel.hofman@aareon.nl',
];

const DIRECTORS = [
  // add director emails here
];

function getRole(email: string): 'manager' | 'director' | null {
  if (MANAGERS.includes(email)) return 'manager';
  if (DIRECTORS.includes(email)) return 'director';
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalized = normalizeEmail(email);

    // Check email is in the allowed list
    if (!isAllowedAareonEmail(normalized)) {
      return NextResponse.json(
        { error: 'This email is not authorised to register' },
        { status: 403 }
      );
    }

    // Check password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', normalized)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Determine role from email
    const role = getRole(normalized);
    if (!role) {
      return NextResponse.json(
        { error: 'This email is not authorised to register' },
        { status: 403 }
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Save to database
    const { error } = await supabaseAdmin
      .from('users')
      .insert({ email: normalized, password_hash, role });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, role });

  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
