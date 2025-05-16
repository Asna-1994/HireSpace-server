
import crypto from 'crypto'

export interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
  entity : String;
  [key: string]: any;
}

export const generateOtp = (): string => {
  return crypto.randomInt(1000, 9999).toString();
};

export const generateRoomId = (
  senderId: string,
  receiverId: string
): string => {
  return [senderId, receiverId].sort().join('_');
};













