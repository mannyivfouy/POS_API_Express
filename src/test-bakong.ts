import QRCode from "qrcode";

const qr =
  "00020101021230390017mann_yivfouy@bkrt010716646990203ABA52045999530384054040.105802KH5910POS System6010PHNOM PENH62160112SALE-00000829934001317873075527810113178730815278063047BEF"; // paste the COMPLETE QR string here

const generateTestQR = async () => {
  await QRCode.toFile("./test-khqr.png", qr);

  console.log("QR image created: ./test-khqr.png");
};

generateTestQR();