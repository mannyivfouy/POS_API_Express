import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  fullname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  roleId: Types.ObjectId;
  status: "active" | "inactive";
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    avatar: { type: String },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    status: { type: String, enum: ["active", "inactive"] },
    lastLogin: Date,
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", UserSchema);
