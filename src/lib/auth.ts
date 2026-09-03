import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || "portfolio-super-secret-key-98765";
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "admin123";
const COOKIE_NAME = "admin_session_token";

export interface TokenPayload {
  role: "admin";
  iat: number;
  exp: number;
}

export function verifyPasscode(input: string): boolean {
  return input.trim() === ADMIN_PASSCODE.trim();
}

export function createAdminToken(): string {
  return jwt.sign({ role: "admin" }, ADMIN_SECRET, { expiresIn: "7d" });
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    const decoded = jwt.verify(token, ADMIN_SECRET) as TokenPayload;
    return decoded && decoded.role === "admin";
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
