import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPurchaseItem extends Document {
  purchaseId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  costPrice: number;
  total: number;
}

const PurchaseItem: Schema = new Schema(
  {
    purchaseId: {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IPurchaseItem>("PurchaseItem", PurchaseItem);
