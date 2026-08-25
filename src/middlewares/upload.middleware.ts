import multer from "multer";
import path from "path";

export const createUploader = (folder: string, fieldName: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folder}`);
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
      const error = new Error("Only JPG and PNG are allowed");
      (((error as any).status = 400), ((error as any).field = fieldName));

      cb(error);
    }
  };

  return multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
};
