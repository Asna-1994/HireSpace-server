import mongoose from 'mongoose';
import { User } from '../entities/User'

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  find(filter: object): Promise<User[] | []>;
  update(user: User, session?: mongoose.ClientSession): Promise<User>;
  delete(email: string): Promise<void>;
  create( userData: Partial<User>, options?: { session?: mongoose.ClientSession }): Promise<User>;
  findUsers(  offset: number,   limit: number,  filter: object ): Promise<{ users: User[]; total: number }>;
  findUsersWithPagination(   offset: number,  limit: number,  filter: object ): Promise<User[]>;
  blockOrUnblock(entityId: string, action: string): Promise<User>;
  findMembers(filter: object, projection: string): Promise<User[] | null>;
  addConnection(userId: string, connectionId: string): Promise<User | null>;
  findConnections( userId: string,  offset: number,  limit: number, search: string | null  ): Promise<{ connections: User[]; total: number }>;
  findUsersWithActiveSubscriptions(): Promise<User[]>;
  findPremiumUsers(  offset: number, limit: number,  filter: object): Promise<{ users: User[]; total: number }>;
  countTotal(dateQuery: any): Promise<number>;
  countPremium(dateQuery: any): Promise<number>;
  updateMany( filter: Record<string, unknown>,  updateData: Record<string, unknown> ): Promise<void> 
  saveRefreshToken(userId: string, token: string): Promise<void>;
  verifyRefreshToken(userId: string, token: string): Promise<boolean>;
  removeRefreshToken(userId: string, token: string): Promise<void>;
  removeAllRefreshTokens(userId: string): Promise<void>; 
  clearExpiredRefreshTokens(secret: string): Promise<void>

}
