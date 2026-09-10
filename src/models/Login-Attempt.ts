import mongoose, { Document, Schema } from "mongoose";

export interface ILoginAttempt extends Document {
  ip: string;
  username: string;
  attempts: number;
  blockedUntil?: Date;
}

const LoginAttemptSchema: Schema = new Schema(
  {
    ip: { type: String, required: true },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    blockedUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

LoginAttemptSchema.index({ ip: 1, username: 1 }, { unique: true });

export default mongoose.model<ILoginAttempt>(
  "LoginAttempt",
  LoginAttemptSchema,
);
