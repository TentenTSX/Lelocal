import fs from "node:fs";
import path from "node:path";
import type { Request } from "express";
import multer, { type StorageEngine, type FileFilterCallback } from "multer";

// Vercel Functions only allow temporary writes under /tmp. These files are
// intentionally temporary; persistent uploads must later use Blob/Cloudinary.
const uploadDir = process.env.VERCEL
  ? path.join("/tmp", "uploads")
  : path.join(process.cwd(), "public", "uploads");

console.log("UPLOAD DIR =", uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, uploadDir);
  },

  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format non supporté. Utilisez JPG, PNG ou WEBP."));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
