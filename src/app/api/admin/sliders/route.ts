import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { getCurrentUserFromRequest, hasAdminPrivileges } from '@/lib/auth';
import { SliderImage } from '@/lib/types';

export async function GET(request: Request) {
  const user = getCurrentUserFromRequest(request);
  if (!user || !hasAdminPrivileges(user)) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const db = getDatabase();
  return NextResponse.json({ sliders: db.sliders });
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user || !hasAdminPrivileges(user)) {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const { action, slider } = await request.json();
    const db = getDatabase();

    if (action === 'add') {
      const newSlider: SliderImage = {
        id: `slide-${Date.now()}`,
        url: slider.url,
        title: slider.title || { bn: '', en: '' },
        subtitle: slider.subtitle || { bn: '', en: '' },
        showOverlay: slider.showOverlay ?? true,
        order: db.sliders.length + 1,
        isActive: true,
      };
      db.sliders.push(newSlider);
    } else if (action === 'update') {
      const existing = db.sliders.find((s) => s.id === slider.id);
      if (existing) {
        if (slider.url !== undefined) existing.url = slider.url;
        if (slider.title !== undefined) existing.title = slider.title;
        if (slider.subtitle !== undefined) existing.subtitle = slider.subtitle;
        if (slider.showOverlay !== undefined) existing.showOverlay = slider.showOverlay;
        if (slider.order !== undefined) existing.order = slider.order;
        if (slider.isActive !== undefined) existing.isActive = slider.isActive;
      }
    } else if (action === 'delete') {
      db.sliders = db.sliders.filter((s) => s.id !== slider.id);
    }

    saveDatabase(db);
    return NextResponse.json({ success: true, sliders: db.sliders });
  } catch (error) {
    console.error('Slider manager error:', error);
    return NextResponse.json({ error: 'Failed to manage slider images.' }, { status: 500 });
  }
}
