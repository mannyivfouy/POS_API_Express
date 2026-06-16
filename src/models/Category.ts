import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  status: "active" | "inactive";
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true },
);

export default mongoose.model<ICategory>("Category", CategorySchema);
