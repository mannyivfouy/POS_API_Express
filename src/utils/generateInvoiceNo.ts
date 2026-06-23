import Counter from "../models/Counter";

export const generateInvoice = async (
  type: "purchase" | "sale",
): Promise<string> => {
  const prefix = type === "purchase" ? "PUR" : "SEL";

  const now = new Date();

  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");

  const counter = await Counter.findByIdAndUpdate(
    type,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  const seq = String(counter?.seq ?? 1).padStart(4, "0");

  return `${prefix}-${dateStr}-${seq}`;
};
