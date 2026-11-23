import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, Role } from './types';
import { getDatabase } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'desb_secure_jwt_token_secret_2026_xyz';
const COOKIE_NAME = 'des_session';

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}

export function isGmailAddress(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const cleanEmail = email.trim().toLowerCase();
  // Strictly validate standard Gmail address
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return gmailRegex.test(cleanEmail);
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${COOKIE_NAME}=`)) {
      return decodeURIComponent(cookie.substring(COOKIE_NAME.length + 1));
    }
  }
  return null;
}

export function getCurrentUserFromRequest(request: Request): User | null {
  const cookieHeader = request.headers.get('cookie');
  const token = getTokenFromCookies(cookieHeader);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const db = getDatabase();
  const user = db.users.find((u) => u.id === payload.userId && u.status !== 'banned');
  return user || null;
}

export function generateOTP(): string {
  // Cryptographically sound 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export { COOKIE_NAME };
