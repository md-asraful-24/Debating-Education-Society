import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET() {
  const db = getDatabase();
  const now = new Date();

  // Helper date boundaries
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = startOfToday + 24 * 60 * 60 * 1000;
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

  const completed = db.debates
    .filter((d) => d.status === 'completed' && d.result)
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  let todayWinner = null;
  let yesterdayWinner = null;
  const archive = [];

  for (const debate of completed) {
    const debateTime = new Date(debate.scheduledAt).getTime();
    if (debateTime >= startOfToday && debateTime < endOfToday && !todayWinner) {
      todayWinner = debate;
    } else if (debateTime >= startOfYesterday && debateTime < startOfToday && !yesterdayWinner) {
      yesterdayWinner = debate;
    } else {
      archive.push(debate);
    }
  }

  // If today or yesterday haven't finished a debate yet, fallback gracefully to the latest available completed ones
  if (!todayWinner && completed.length > 0) {
    todayWinner = completed[0];
  }
  if (!yesterdayWinner && completed.length > 1) {
    yesterdayWinner = completed[1];
  }

  return NextResponse.json({
    todayWinner,
    yesterdayWinner,
    archive,
    allCompleted: completed,
  });
}
