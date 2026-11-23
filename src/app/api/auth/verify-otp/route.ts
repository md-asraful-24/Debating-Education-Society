import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { signToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const db = getDatabase();

    const otpRecord = db.otps.find((o) => o.email.toLowerCase() === cleanEmail);
    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No OTP verification found for this email. Please register again.' },
        { status: 400 }
      );
    }

    // Check expiration
    if (Date.now() > otpRecord.expiresAt) {
      return NextResponse.json(
        { error: 'OTP code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Rate limiting attempts
    otpRecord.attempts = (otpRecord.attempts || 0) + 1;
    if (otpRecord.attempts > 5) {
      db.otps = db.otps.filter((o) => o.email !== cleanEmail);
      saveDatabase(db);
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Verify OTP match
    if (otpRecord.otp !== cleanOtp) {
      saveDatabase(db);
      return NextResponse.json(
        { error: 'Invalid verification code. Please check and try again.' },
        { status: 400 }
      );
    }

    // Mark user verified
    const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return NextResponse.json(
        { error: 'User record not found.' },
        { status: 404 }
      );
    }

    user.isVerified = true;
    user.status = 'active';

    // Remove consumed OTP
    db.otps = db.otps.filter((o) => o.email !== cleanEmail);
    saveDatabase(db);

    // Sign session token
    const token = signToken(user);

    const response = NextResponse.json({
      success: true,
      message: 'Account verified and registered successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
