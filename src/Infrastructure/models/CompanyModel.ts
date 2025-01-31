import mongoose, { Schema, Document } from 'mongoose';
import { imageObject, Member } from '../../Domain/entities/Company';




export interface CompanyDocument extends Document {
  companyName: string;
  _id : string;
  email: string;
  phone: string;
  entity: 'company' | 'user';
  password: string;
  address: string;
  companyLogo?:imageObject;
  verificationDocument? : imageObject;
  documentNumber?:string;
  industry:  String;
  establishedDate: Date;
  appPlan: 'basic' | 'premium';
  isBlocked: boolean;
  isPremium: boolean;
  isDeleted: boolean;
  isVerified : boolean;
  isSpam: boolean;
  members: Member[];
  createdAt: Date;
  updatedAt: Date;


  validateEmail: () => void;
  markAsVerified: () => void;
  upgradeToPremium: () => void;
  blockUser: () => void;
}


const companySchema = new Schema<CompanyDocument>(
  {
    companyName: { type: String, required : true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    entity: { type: String, enum: ['company', 'user'],default : 'company'},
    password: { type: String },
    address: { type: String },
    companyLogo: { 
      type: { 
        url: { type: String, },
        publicId: { type: String, }
      }, 
      default: { url: '', publicId: '' } 
    },
    establishedDate: { type: Date },
    verificationDocument :{ 
      type: { 
        url: { type: String,  },
        publicId: { type: String,  }
      }, 
      default: { url: '', publicId: '' } 
    },
    documentNumber:{ type: String },
    industry: {type: String, required : true},
    appPlan: {
      type: String,
      enum: ['basic', 'premium'],
      default: 'basic',
    },
    isVerified: { type: Boolean, default: false },
    // admins : [{ type: Schema.Types.ObjectId, ref: 'UserModel' }],
    isBlocked: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isSpam: { type: Boolean, default: false },
    members: [{
      role : {type : String,  enum: ['companyAdmin', 'companyMember'], default: 'companyMember',},
      userId : {   type: Schema.Types.ObjectId, ref: 'UserModel' }
   }],
  },
  { timestamps: true }
);

companySchema.methods.validateEmail = function() {
    if (!this.email.includes('@')) {
      throw new Error('Invalid email address');
    }
  };
  
  companySchema.methods.markAsVerified = function() {
    this.isVerified = true;
  };
  
  companySchema.methods.upgradeToPremium = function() {
    this.isPremium = true;
    this.appPlan = 'premium';
  };
  
  companySchema.methods.blockUser = function() {
    this.isBlocked = true;
  };

  

export const CompanyModel = mongoose.model<CompanyDocument>('CompanyModel', companySchema);
