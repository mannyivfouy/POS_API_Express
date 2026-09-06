import mongoose, { Schema } from "mongoose";

export interface IPermission extends Document {
  name: string;
  module: string;
  action: string;
  description?: string;
}

const PermissionSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    module: { type: String, required: true, trim: true },
    action: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model<IPermission>("Permission", PermissionSchema);
