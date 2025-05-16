import { model, Schema } from "mongoose";import { IMessage } from "../../../Domain2/entities/Message";
const messageSchema = new Schema<IMessage>(
  {
    content: { type: String, required: true },
    roomId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['sent', 'delivered', 'read'],
    },
    senderId: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'UserModel' },
  },
  { timestamps: true }
);

export const MessageModel = model<IMessage>(
  'MessageModel',
  messageSchema
);
