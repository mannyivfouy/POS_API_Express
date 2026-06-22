import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  phone: string;
  email: string;
}

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, trim: true },
    phone: { type: String, trim: true, unique: true },
    email: { type: String, trim: true, unique: true },
  },
  {
    timestamps: true,
  },
);
