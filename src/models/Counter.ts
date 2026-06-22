import mongoose, { Schema } from "mongoose";

const CounterSchema = new Schema(
  {
    _id: String,
    seq: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Counter", CounterSchema);