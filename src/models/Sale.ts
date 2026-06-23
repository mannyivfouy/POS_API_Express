import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISale extends Document {
  invoiceNo: string;
  customerId: Types.ObjectId;
  saleDate: Date;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentStatus: string;
  note?: string;
  createdBy: Types.ObjectId;
}

const SaleSchema: Schema = new Schema(
  {
    invoiceNo: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", default: null },
    saleDate: { type: Date, default: Date.now },
    subtotal: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    note: { type: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ISale>("Sale", SaleSchema);
