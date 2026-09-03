import { NextResponse } from 'next/server';

const rsvpEndpoint = 'https://script.google.com/macros/s/AKfycbwsIn-KPhir3gSDn4G6gtot8RmlUGXHqf5rJVNi1lAePVoLrVGAkPT33ssK1kt3W9mQ/exec';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const response = await fetch(rsvpEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Google Sheets returned ${response.status}.`);
    }

    const result = await response.json().catch(() => null);
    if (!result?.ok) {
      throw new Error(result?.error || 'Google Sheets could not save the RSVP.');
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'We could not save your RSVP. Please try again.' },
      { status: 502 },
    );
  }
}
