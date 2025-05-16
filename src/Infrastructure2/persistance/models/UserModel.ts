import mongoose, { Schema } from 'mongoose';
import { User } from '../../../Domain2/entities/User';

const userSchema = new Schema<User>({
   userName: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    entity: { type: String, enum: ['company', 'user'], default: 'user' },
    password: { type: String },
    address: { type: String },
    tagLine: { type: String },
    profilePhoto: {
      type: {
        url: { type: String },
        publicId: { type: String },
      },
      default: { url: '', publicId: '' },
    },
    dateOfBirth: { type: Date },
    googleId: { type: String, unique: true, sparse: true },
    userRole: {
      type: String,
      enum: ['jobSeeker', 'companyAdmin', 'companyMember', 'admin'],
    },
    appPlan: {
      planType: { type: String, default: 'basic' },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      subscriptionId: {
        type: Schema.Types.ObjectId,
        ref: 'SubscriptionModel',
        default: null,
      },
    },
    refreshTokens: [{
      type: String,
    }],
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isFresher: { type: Boolean, default: true },
    isSpam: { type: Boolean, default: false },
    companyId: { type: Schema.Types.ObjectId, ref: 'CompanyModel' },
    connections: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }],
    savedJobs: [{ type: Schema.Types.ObjectId, ref: 'JobPostModel' }],
    appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<User>('UserModel', userSchema);
