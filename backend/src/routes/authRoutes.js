import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

const uploadsDir = path.join(process.cwd(), "uploads");
// create uploads dir if missing
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // allow images and pdf
  const allowed = /jpeg|jpg|png|pdf/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  cb(null, ok);
};

const upload = multer({ storage, fileFilter });

router.post("/signup", upload.single("idImage"), signup);
router.post("/login", login);

export default router;
