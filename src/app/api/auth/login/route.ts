import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { isGmailAddress, comparePassword, signToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Strictly validate Gmail
    if (!isGmailAddress(cleanEmail)) {
      return NextResponse.json(
        { error: 'Login is strictly restricted to valid @gmail.com accounts only.' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this Gmail. Please register first.' },
        { status: 404 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'This account has not verified its OTP yet. Please register or verify first.' },
        { status: 403 }
      );
    }

    if (user.status === 'banned') {
      return NextResponse.json(
        { error: 'This account has been permanently banned by the Admin Panel due to violation of conduct rules.' },
        { status: 403 }
      );
    }

    if (user.status === 'kicked') {
      return NextResponse.json(
        { error: 'This account has been temporarily kicked. Please contact administration.' },
        { status: 403 }
      );
    }

    const isMatch = comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid password. Please check and try again.' },
        { status: 401 }
      );
    }

    const token = signToken(user);

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        panelRole: user.panelRole,
        teamId: user.teamId,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login.' },
      { status: 500 }
    );
  }
}
