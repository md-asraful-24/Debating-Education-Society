import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET() {
  const db = getDatabase();
  return NextResponse.json({
    settings: db.settings,
    sliders: db.sliders.filter((s) => s.isActive).sort((a, b) => a.order - b.order),
  });
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const updates = await request.json();
    const db = getDatabase();

    db.settings = {
      ...db.settings,
      ...updates,
    };

    saveDatabase(db);

    return NextResponse.json({ success: true, settings: db.settings });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}
