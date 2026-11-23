import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { isGmailAddress, hashPassword, generateOTP } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Strictly enforce Gmail account
    if (!isGmailAddress(cleanEmail)) {
      return NextResponse.json(
        { error: 'Registration is strictly allowed for valid @gmail.com addresses only.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Check if user already exists
    const existing = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing && existing.isVerified) {
      return NextResponse.json(
        { error: 'An account with this Gmail address already exists. Please login.' },
        { status: 409 }
      );
    }

    // Generate time-limited OTP (5 minutes)
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    // Filter out previous OTPs for this email and record new OTP
    db.otps = db.otps.filter((o) => o.email !== cleanEmail);
    db.otps.push({
      email: cleanEmail,
      otp,
      expiresAt,
      attempts: 0,
      createdAt: Date.now(),
    });

    // Hash password and store or update unverified user
    const passwordHash = hashPassword(password);
    if (existing) {
      existing.name = name.trim();
      existing.passwordHash = passwordHash;
    } else {
      db.users.push({
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: 'member',
        isVerified: false,
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    }

    saveDatabase(db);

    // Send OTP via email
    const mailResult = await sendOtpEmail(cleanEmail, otp);

    return NextResponse.json({
      success: true,
      message: 'OTP verification code sent to your Gmail.',
      email: cleanEmail,
      devOtp: mailResult.devOtp, // available for testing if Gmail SMTP is not configured
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
