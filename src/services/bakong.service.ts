import { env } from "../configs/env";

const { BakongKHQR, khqrData, MerchantInfo } = require("bakong-khqr");

class BakongService {
  private readonly khqr = new BakongKHQR();

  generateKHQR(amount: number, billNumber: string) {
    const expirationTimestamp =
      Date.now() + env.KHQR_EXPIRY_MINUTES * 60 * 1000;

    const merchantInfo = new MerchantInfo(
      env.BAKONG_ACCOUNT_ID,
      env.BAKONG_MERCHANT_NAME,
      "PHNOM PENH",
      env.BAKONG_MERCHANT_ID,
      env.BAKONG_ACQUIRING_BANK,
      {
        currency: khqrData.currency.usd,
        amount,
        merchantCategoryCode: "5999",
        billNumber,
        expirationTimestamp,
      },
    );

    return this.khqr.generateMerchant(merchantInfo);
  }

  async checkPayment(md5: string) {
    const response = await fetch(
      "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.BAKONG_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          md5,
        }),
      },
    );

    const result = await response.json();

    if (result.responseCode !== 0 || !result.data) {
      return {
        paid: false,
        transaction: null,
      };
    }

    return {
      paid: true,
      transaction: {
        hash: result.data.hash,
        externalRef: result.data.externalRef,
        fromAccountId: result.data.fromAccountId,
        toAccountId: result.data.toAccountId,
        currency: result.data.currency,
        amount: result.data.amount,
        createdDateMs: result.data.createdDateMs,
        acknowledgedDateMs: result.data.acknowledgedDateMs,
      },
    };
  }
}

export default new BakongService();
