import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDatabase();
    const debate = db.debates.find((d) => d.id === id);

    if (!debate) {
      return NextResponse.json({ error: 'Debate session not found.' }, { status: 404 });
    }

    const user = getCurrentUserFromRequest(request);
    const now = Date.now();
    const scheduledTime = new Date(debate.scheduledAt).getTime();
    const unlockTime = scheduledTime - (debate.unlockMinutesBefore || 5) * 60 * 1000;
    const endTime = scheduledTime + (debate.durationMinutes || 60) * 60 * 1000 + 30 * 60 * 1000;

    const isUnlocked = now >= unlockTime && now <= endTime;
    const isAdmin = user?.role === 'admin';

    // Strict server-side time-window enforcement
    if (!isUnlocked && !isAdmin) {
      const remainingSecs = Math.max(0, Math.floor((unlockTime - now) / 1000));
      return NextResponse.json(
        {
          error: 'Google Meet link is currently time-locked. It unlocks 5 to 7 minutes before the scheduled start time.',
          isUnlocked: false,
          remainingSeconds: remainingSecs,
          unlocksAt: new Date(unlockTime).toISOString(),
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      meetLink: debate.meetLink,
      isUnlocked: true,
      topic: debate.topic,
    });
  } catch (error) {
    console.error('Time lock verification error:', error);
    return NextResponse.json({ error: 'Internal verification failed.' }, { status: 500 });
  }
}
