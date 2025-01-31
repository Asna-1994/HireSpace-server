import mongoose, { Schema, Document } from 'mongoose';

interface imageObject {
  url: string;
  publicId: string;
}


export interface UserDocument extends Document {
  userName?: string;
  _id : string;
  email: string;
  phone?: string;
  entity: 'company' | 'user';
  password?: string;
  address?: string;
  tagLine? : string;
  profilePhoto?: imageObject;
  dateOfBirth?: Date;
  googleId?: string;
  userRole?: 'jobSeeker' | 'companyAdmin' | 'companyMember' | 'admin';
  appPlan: {
    planType: string,
    startDate: Date | null,
    endDate:Date | null,
    subscriptionId :  mongoose.Types.ObjectId | null;
  },
  isBlocked: boolean;
  isPremium: boolean;
  isDeleted: boolean;
  isFresher: boolean;
  isVerified : boolean;
  isSpam: boolean;
  companyId?: mongoose.Types.ObjectId;
  connections: mongoose.Types.ObjectId[];
  savedJobs: mongoose.Types.ObjectId[];
  appliedJobs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;

  validateEmail: () => void;
  markAsVerified: () => void;
  upgradeToPremium: () => void;
  blockUser: () => void;
  addConnection: (connectionId: mongoose.Types.ObjectId) => void;
}


const userSchema = new Schema<UserDocument>(
  {
    userName: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    entity: { type: String, enum: ['company', 'user'],default : 'user'},
    password: { type: String },
    address: { type: String },
    tagLine: { type: String },
    profilePhoto: { 
      type: { 
        url: { type: String},
        publicId: { type: String}
      }, 
      default: { url: '', publicId: '' } 
    },
    dateOfBirth: { type: Date },
    googleId: { type: String, unique: true, sparse: true },
    userRole: {
      type: String,
      enum: ['jobSeeker', 'companyAdmin', 'companyMember', 'admin']
    },
    appPlan: {
      planType : {type : String, default: "basic" },
      startDate : {type : Date , default : null},
      endDate : {type : Date , default : null},
      subscriptionId: { type: Schema.Types.ObjectId, ref: 'SubscriptionModel', default : null },
    },
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

userSchema.methods.validateEmail = function() {
    if (!this.email.includes('@')) {
      throw new Error('Invalid email address');
    }
  };
  
  userSchema.methods.markAsVerified = function() {
    this.isVerified = true;
  };
  
  userSchema.methods.upgradeToPremium = function() {
    this.isPremium = true;
    this.appPlan = 'premium';
  };
  
  userSchema.methods.blockUser = function() {
    this.isBlocked = true;
  };
  
  userSchema.methods.addConnection = function(connectionId: mongoose.Types.ObjectId) {
    if (!this.connections.includes(connectionId)) {
      this.connections.push(connectionId);
    }
  };
  

export const UserModel = mongoose.model<UserDocument>('UserModel', userSchema);
