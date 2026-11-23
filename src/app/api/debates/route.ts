import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { getCurrentUserFromRequest, hasAdminPrivileges } from '@/lib/auth';
import { Debate } from '@/lib/types';

export async function GET() {
  const db = getDatabase();
  const now = Date.now();

  // Map debates to safely sanitize meetLink unless unlocked
  const sanitized = db.debates.map((d) => {
    const scheduledTime = new Date(d.scheduledAt).getTime();
    const unlockTime = scheduledTime - (d.unlockMinutesBefore || 5) * 60 * 1000;
    const endTime = scheduledTime + (d.durationMinutes || 60) * 60 * 1000 + 30 * 60 * 1000;
    const isUnlocked = now >= unlockTime && now <= endTime;
    const secondsToUnlock = Math.max(0, Math.floor((unlockTime - now) / 1000));

    return {
      ...d,
      isUnlocked,
      secondsToUnlock,
      // Hide raw meet link in public list until server verification
      hasMeetLink: Boolean(d.meetLink),
    };
  });

  return NextResponse.json({ debates: sanitized });
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user || !hasAdminPrivileges(user)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const db = getDatabase();

    const newDebate: Debate = {
      id: `debate-${Date.now()}`,
      topic: body.topic,
      category: body.category || { bn: 'সাধারণ বিতর্ক', en: 'Open Debate' },
      scheduledAt: body.scheduledAt,
      durationMinutes: body.durationMinutes || 60,
      meetLink: body.meetLink || 'https://meet.google.com/new',
      unlockMinutesBefore: body.unlockMinutesBefore || 6,
      status: 'scheduled',
      teamA: body.teamA || { name: 'Team Alpha', members: [] },
      teamB: body.teamB || { name: 'Team Beta', members: [] },
      judges: body.judges || [],
      result: null,
      createdAt: new Date().toISOString(),
    };

    db.debates.unshift(newDebate);
    saveDatabase(db);

    return NextResponse.json({ success: true, debate: newDebate });
  } catch (error) {
    console.error('Create debate error:', error);
    return NextResponse.json({ error: 'Failed to create debate.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user || !hasAdminPrivileges(user)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, topic, scheduledAt, meetLink, unlockMinutesBefore, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Debate ID is required.' }, { status: 400 });
    }

    const db = getDatabase();
    const debate = db.debates.find((d) => d.id === id);

    if (!debate) {
      return NextResponse.json({ error: 'Debate not found.' }, { status: 404 });
    }

    if (topic) debate.topic = topic;
    if (scheduledAt) debate.scheduledAt = scheduledAt;
    if (meetLink) debate.meetLink = meetLink;
    if (unlockMinutesBefore !== undefined) debate.unlockMinutesBefore = Number(unlockMinutesBefore);
    if (status) debate.status = status;

    saveDatabase(db);
    return NextResponse.json({ success: true, debate });
  } catch (error) {
    console.error('Update debate error:', error);
    return NextResponse.json({ error: 'Failed to update debate.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user || !hasAdminPrivileges(user)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Debate ID is required.' }, { status: 400 });
    }

    const db = getDatabase();
    db.debates = db.debates.filter((d) => d.id !== id);
    saveDatabase(db);

    return NextResponse.json({ success: true, message: 'Debate session deleted successfully.' });
  } catch (error) {
    console.error('Delete debate error:', error);
    return NextResponse.json({ error: 'Failed to delete debate.' }, { status: 500 });
  }
}
