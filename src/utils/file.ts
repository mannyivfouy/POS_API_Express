import path from "path";
import fs from "fs";

export const moveFile = (file: Express.Multer.File, folder: string) => {
  const newName = Date.now() + path.extname(file.originalname);

  const oldPath = path.join(process.cwd(), "uploads", "temp", file.filename);

  const newPath = path.join(process.cwd(), "uploads", folder, newName);

  fs.renameSync(oldPath, newPath);

  return `/uploads/${folder}/${newName}`;
};

export const deleteFile = (fileUrl: string) => {
  if (!fileUrl) return;

  const filePath = path.join(process.cwd(), fileUrl.replace(/^\//, ""));

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
