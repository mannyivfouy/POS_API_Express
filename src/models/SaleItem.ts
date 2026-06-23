import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISaleItem extends Document {
  saleId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  sellingPrice: number;
  total: number;
}

const SaleItem: Schema = new Schema(
  {
    saleId: {
      type: Schema.Types.ObjectId,
      ref: "Sale",
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
  { timestamps: true },
);

export default mongoose.model<ISaleItem>("SaleItem", SaleItem);
