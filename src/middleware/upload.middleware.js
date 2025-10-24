import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

export const uploadFile = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error("Seules les images sont autorisées."));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
