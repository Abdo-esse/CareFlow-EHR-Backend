import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error("Fichier non autorisé (jpeg, jpg, png, webp, pdf uniquement)."));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});
