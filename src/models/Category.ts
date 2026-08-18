import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  icon: string;
  status: "active" | "inactive";
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, default: "boxes", trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true },
);

export default mongoose.model<ICategory>("Category", CategorySchema);
