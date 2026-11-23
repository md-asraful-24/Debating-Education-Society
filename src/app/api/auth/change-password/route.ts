import { NextResponse } from 'next/server';
import { getCurrentUserFromRequest, comparePassword, hashPassword } from '@/lib/auth';
import { getDatabase, saveDatabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const user = getCurrentUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const dbUser = db.users.find((u) => u.id === user.id);

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User record not found.' },
        { status: 404 }
      );
    }

    const isMatch = comparePassword(currentPassword, dbUser.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    dbUser.passwordHash = hashPassword(newPassword);
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: 'Password successfully changed.',
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Failed to change password. Please try again.' },
      { status: 500 }
    );
  }
}
