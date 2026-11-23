import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { ChatMessage } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const user = getCurrentUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (user.status === 'banned' || user.status === 'kicked') {
      return NextResponse.json({ error: 'Account restricted from sending messages.' }, { status: 403 });
    }

    const { channelId, message } = await request.json();

    if (!channelId || !message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message content and channelId are required.' }, { status: 400 });
    }

    // Strict membership check for private groups
    if (channelId !== 'general') {
      const isAdmin = user.role === 'admin' || user.role === 'moderator';
      const isTeamAChannel = channelId.endsWith('_teamA');
      const isTeamBChannel = channelId.endsWith('_teamB');
      const isPanelChannel = channelId.endsWith('_panel');

      let authorized = isAdmin;
      if (isTeamAChannel && user.teamId === 'team-a') authorized = true;
      if (isTeamBChannel && user.teamId === 'team-b') authorized = true;
      if (isPanelChannel && (user.panelRole === 'chairperson' || user.panelRole === 'vice_chairperson' || user.panelRole === 'panel_member')) authorized = true;

      if (!authorized) {
        return NextResponse.json({ error: 'Access restricted: Not a member of this debate group.' }, { status: 403 });
      }
    }

    const db = getDatabase();

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      channelId,
      senderId: user.id,
      senderName: user.name,
      senderEmail: user.email,
      senderRole: user.role,
      panelRole: user.panelRole,
      message: message.trim().slice(0, 1000), // sanitize max length
      timestamp: new Date().toISOString(),
    };

    db.messages.push(newMessage);
    saveDatabase(db);

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
