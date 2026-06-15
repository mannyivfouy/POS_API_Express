import multer from "multer";
import path from "path";

export const createUploader = (folder: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/temp`);
    },

    filename: (req, file, cb) => {
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    },
  });

  return multer({ storage });
};
