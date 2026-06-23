import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPurchase extends Document {
  invoiceNo: string;
  supplierId: Types.ObjectId;
  purchaseDate: Date;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  paymentStatus: string;
  note?: string;
  createdBy: Types.ObjectId;
}

const PurchaseSchema: Schema = new Schema(
  {
    invoiceNo: { type: String, required: true, unique: true },
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    purchaseDate: { type: Date, default: Date.now },
    subtotal: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
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
  {
    timestamps: true,
  },
);

export default mongoose.model<IPurchase>("Purchase", PurchaseSchema);
