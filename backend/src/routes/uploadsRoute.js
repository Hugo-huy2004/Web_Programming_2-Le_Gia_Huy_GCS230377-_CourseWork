import express from "express"
import multer from "multer"
import { isCloudinaryConfigured, uploadImageBufferToCloudinary } from "../lib/cloudinaryStorage.js"

const router = express.Router()
const IMAGE_FIELD = "image"
const MAX_FILE_SIZE = 10 * 1024 * 1024

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

router.post("/drive-image", upload.single(IMAGE_FIELD), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      ok: false,
      message: "No image file found in request",
    })
  }

  try {
    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        ok: false,
        message: "Cloudinary is not configured on backend",
      })
    }

    const uploaded = await uploadImageBufferToCloudinary({
      buffer: req.file.buffer,
      fileName: req.file.originalname,
    })

    return res.json({
      ok: true,
      message: "Image uploaded successfully",
      file: uploaded,
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : "Image upload failed",
    })
  }
})

export default router
