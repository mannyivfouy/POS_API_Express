import mongoose, { Document, Schema } from "mongoose";

export interface ILoginAttempt extends Document {
  ip: string;
  attempts: number;
  blockedUntil?: Date;
}

const LoginAttemptSchema: Schema = new Schema(
  {
    ip: { type: String, required: true},
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

LoginAttemptSchema.index({ ip: 1 }, { unique: true });

export default mongoose.model<ILoginAttempt>(
  "LoginAttempt",
  LoginAttemptSchema,
);
