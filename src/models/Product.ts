import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  barcode: string;
  sku: string;
  costPrice: number;
  sellingPrice: number;
  stockQty: number;
  lowStockAlert: number;
  unit: string;
  description?: string;
  categoryId: Types.ObjectId;
  supplierId: Types.ObjectId;
  image?: string;
  status: string;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    barcode: {
      type: String,
      required: true,
      trim: true,
      sparse: true,
      unique: true,
    },
    sku: { 
      type: String, 
      required: true, 
      trim: true ,
      unique: true,
    },
    costPrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    stockQty: { type: Number,  default: 0 },
    lowStockAlert: { type: Number, required: true, default: 10 },
    unit: { type: String, required: true, trim: true },
    description: { type: String },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    image: { type: String, default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true },
);

export default mongoose.model<IProduct>("Product", ProductSchema);
