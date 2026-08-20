import bakongService from "./bakong.service";

export const createBakongPayment = async (
  amount: number,
  billNumber: string,
) => {
  const result = bakongService.generateKHQR(amount, billNumber);

  if (result.status.code !== 0) {
    throw new Error(result.status.message || "Failed to generate Bakong KHQR");
  }

  return {
    qr: result.data.qr,
    md5: result.data.md5,
  };
};

export const checkBakongPayment = async (
  md5: string,
  expectedAmount: number,
) => {
  const payment = await bakongService.checkPayment(md5);

  if (!payment.paid || !payment.transaction) {
    throw new Error("Payment Not Completed");
  }  

  if (payment.transaction.amount !== expectedAmount) {
    throw new Error("Payment Amount Does Not Match");
  }

  if (payment.transaction.currency !== "USD") {
    throw new Error("Payment Currency Does Not Match");
  }

  return payment;
};
