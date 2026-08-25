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

  const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    const allowedMimeType = ["image/jpg", "image/jpeg"];

    const allowedExtension = [".jpg", ".png"];

    const extension = path.extname(file.originalname).toLowerCase();

    if (
      allowedMimeType.includes(file.mimetype) &&
      allowedExtension.includes(extension)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG and JPG images are allowed"));
    }
  };

  return multer({ storage, fileFilter });
};
