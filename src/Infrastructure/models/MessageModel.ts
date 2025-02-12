import mongoose, { Document, Schema, model } from "mongoose";

export type messageStatus = "sent" | "delivered" | "read";

export interface MessageDocument extends Document {
  content: string;
  roomId: string;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  status: messageStatus;
}

const messageSchema = new Schema<MessageDocument>(
  {
    content: { type: String, required: true },
    roomId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["sent", "delivered", "read"],
    },
    senderId: { type: Schema.Types.ObjectId, ref: "UserModel" },
    receiverId: { type: Schema.Types.ObjectId, ref: "UserModel" },
  },
  { timestamps: true },
);

export const MessageModel = model<MessageDocument>(
  "MessageModel",
  messageSchema,
);
