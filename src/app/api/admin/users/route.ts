import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { getCurrentUserFromRequest, hasAdminPrivileges, isSuperAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  const user = getCurrentUserFromRequest(request);
  if (!user || !hasAdminPrivileges(user)) {
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

  return NextResponse.json({
    users: sanitizedUsers,
    currentUserRole: user.role,
    isSuperAdmin: isSuperAdmin(user),
  });
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user || !hasAdminPrivileges(user)) {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const { userId, action, role, teamId, panelRole, transferOwnership } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const db = getDatabase();
    const target = db.users.find((u) => u.id === userId);

    if (!target) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const callerIsSuperAdmin = isSuperAdmin(user);
    const targetIsSuperAdmin = isSuperAdmin(target);

    // Protection rule 1: Regular admin cannot modify, kick, ban, or demote a Super Admin
    if (targetIsSuperAdmin && !callerIsSuperAdmin) {
      return NextResponse.json(
        { error: 'Permission denied: Only a Super Admin can modify another Super Admin.' },
        { status: 403 }
      );
    }

    // Protection rule 2: Initial super admin account exploviaweb.bd@gmail.com cannot be banned or kicked
    if (target.email.toLowerCase() === 'exploviaweb.bd@gmail.com' && (action === 'ban' || action === 'kick')) {
      return NextResponse.json(
        { error: 'Primary Super Admin account cannot be restricted or banned.' },
        { status: 400 }
      );
    }

    // RBAC Rule 3: Privilege Escalation Prevention - Only Super Admin can assign super_admin role
    if (role === 'super_admin' || action === 'promoteSuperAdmin' || action === 'transferSuperAdmin') {
      if (!callerIsSuperAdmin) {
        return NextResponse.json(
          { error: 'Privilege escalation rejected: Only the Super Admin can grant or transfer the super_admin role.' },
          { status: 403 }
        );
      }
    }

    if (action === 'ban') {
      target.status = 'banned';
    } else if (action === 'kick') {
      target.status = 'kicked';
    } else if (action === 'activate') {
      target.status = 'active';
    } else if (action === 'promoteSuperAdmin') {
      target.role = 'super_admin';
      target.isVerified = true;
      target.status = 'active';
      if (transferOwnership) {
        // Transfer ownership: current user steps down to admin
        const currentInDb = db.users.find((u) => u.id === user.id);
        if (currentInDb && currentInDb.id !== target.id) {
          currentInDb.role = 'admin';
        }
      }
    } else if (action === 'updateRole') {
      if (role) {
        // Enforce RBAC on role change
        if (role === 'super_admin' && !callerIsSuperAdmin) {
          return NextResponse.json(
            { error: 'Only Super Admin can promote a user to super_admin.' },
            { status: 403 }
          );
        }
        target.role = role;
      }
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
