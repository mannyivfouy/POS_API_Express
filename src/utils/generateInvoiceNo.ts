import Counter from "../models/Counter";

export const generateInvoice = async (
  type: "purchase" | "sale",
): Promise<string> => {
  const prefix = type === "purchase" ? "PURCHASE" : "SALE";

  const counter = await Counter.findByIdAndUpdate(
    type,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  const seq = String(counter.seq).padStart(7, "0");

  return `${prefix}-${seq}`;
};
