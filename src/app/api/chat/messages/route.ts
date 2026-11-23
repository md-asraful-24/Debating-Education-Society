import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId') || 'general';

  const user = getCurrentUserFromRequest(request);

  // General chat requires verified logged in user
  if (!user) {
    return NextResponse.json({ error: 'Authentication required to access chat.' }, { status: 401 });
  }

  if (user.status === 'banned' || user.status === 'kicked') {
    return NextResponse.json({ error: 'Your account has been restricted from chatting.' }, { status: 403 });
  }

  // If private group chat, enforce membership
  if (channelId !== 'general') {
    const isAdmin = user.role === 'admin' || user.role === 'moderator';

    // Channel format: debateId_teamA or debateId_teamB or debateId_panel
    const isTeamAChannel = channelId.endsWith('_teamA');
    const isTeamBChannel = channelId.endsWith('_teamB');
    const isPanelChannel = channelId.endsWith('_panel');

    let authorized = isAdmin;

    if (isTeamAChannel && user.teamId === 'team-a') authorized = true;
    if (isTeamBChannel && user.teamId === 'team-b') authorized = true;
    if (isPanelChannel && (user.panelRole === 'chairperson' || user.panelRole === 'vice_chairperson' || user.panelRole === 'panel_member')) authorized = true;

    if (!authorized) {
      return NextResponse.json(
        {
          error: 'Access restricted: You are not assigned to this private debate group.',
          isRestricted: true,
        },
        { status: 403 }
      );
    }
  }

  const db = getDatabase();
  const messages = db.messages
    .filter((m) => m.channelId === channelId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-100);

  return NextResponse.json({
    channelId,
    messages,
  });
}
