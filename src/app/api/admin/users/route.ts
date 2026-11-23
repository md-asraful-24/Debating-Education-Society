import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const user = getCurrentUserFromRequest(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const db = getDatabase();
  const sanitizedUsers = db.users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    isVerified: u.isVerified,
    teamId: u.teamId,
    panelRole: u.panelRole,
    createdAt: u.createdAt,
  }));

  return NextResponse.json({ users: sanitizedUsers });
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const { userId, action, role, teamId, panelRole } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const db = getDatabase();
    const target = db.users.find((u) => u.id === userId);

    if (!target) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Protect master admin from being kicked/banned/demoted
    if (target.email === 'admin@gmail.com' && (action === 'ban' || action === 'kick' || role === 'member')) {
      return NextResponse.json({ error: 'Primary admin account cannot be restricted.' }, { status: 400 });
    }

    if (action === 'ban') {
      target.status = 'banned';
    } else if (action === 'kick') {
      target.status = 'kicked';
    } else if (action === 'activate') {
      target.status = 'active';
    } else if (action === 'updateRole') {
      if (role) target.role = role;
      if (teamId !== undefined) target.teamId = teamId;
      if (panelRole !== undefined) target.panelRole = panelRole;
    }

    saveDatabase(db);
    return NextResponse.json({ success: true, user: target });
  } catch (error) {
    console.error('Admin user action error:', error);
    return NextResponse.json({ error: 'Failed to process user action.' }, { status: 500 });
  }
}
