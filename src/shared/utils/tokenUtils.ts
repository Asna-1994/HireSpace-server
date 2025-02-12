import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const generateOtp = (): string => {
  return crypto.randomInt(1000, 9999).toString();
};

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "5h" });
}

export function verifyToken(token: string): object | string {
  return jwt.verify(token, JWT_SECRET);
}
