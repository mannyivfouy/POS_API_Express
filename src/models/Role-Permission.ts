import mongoose, { Schema, Document } from "mongoose";

export interface IRolePermission extends Document {
  roleId: mongoose.Types.ObjectId;
  permissionId: mongoose.Types.ObjectId;
}

const RolePermissionSchema: Schema = new Schema(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    permissionId: {
      type: Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
  },
  { timestamps: true },
);

RolePermissionSchema.index({ roleId: 1, permissionId: 1 }, { unique: true });

export default mongoose.model<IRolePermission>(
  "RolePermission",
  RolePermissionSchema,
);
