import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { getCurrentUserFromRequest, hasAdminPrivileges } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user || !hasAdminPrivileges(user)) {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const { debateId, result } = await request.json();

    if (!debateId || !result) {
      return NextResponse.json({ error: 'Debate ID and result payload are required.' }, { status: 400 });
    }

    const db = getDatabase();
    const debate = db.debates.find((d) => d.id === debateId);

    if (!debate) {
      return NextResponse.json({ error: 'Debate not found.' }, { status: 404 });
    }

    debate.status = 'completed';
    debate.result = {
      winnerTeam: result.winnerTeam,
      winningTeamName: result.winningTeamName?.trim() || '',
      winningMembers: Array.isArray(result.winningMembers)
        ? result.winningMembers.map((m: { name?: string; role?: string }) => ({
            name: m.name?.trim() || '',
            role: m.role?.trim() || '',
          }))
        : [],
      bestDebater: result.bestDebater?.trim() || '',
      scoreA: Number(result.scoreA) || 0,
      scoreB: Number(result.scoreB) || 0,
      publishedAt: new Date().toISOString(),
      judgeRemarks: result.judgeRemarks || { bn: '', en: '' },
    };

    saveDatabase(db);
    return NextResponse.json({ success: true, debate });
  } catch (error) {
    console.error('Publish result error:', error);
    return NextResponse.json({ error: 'Failed to publish results.' }, { status: 500 });
  }
}
