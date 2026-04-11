import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

let configured = false;

function ensureCloudinaryConfigured() {
  if (configured) {
    return;
  }

  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
  });

  configured = true;
}

export function isCloudinaryConfigured() {
  return Boolean(env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret);
}

export function uploadImageBufferToCloudinary({ buffer, fileName }) {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured. Please set CLOUDINARY_* in backend .env");
  }

  ensureCloudinaryConfigured();

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        resource_type: "image",
        public_id: `${Date.now()}-${String(fileName ?? "image").replace(/[^a-zA-Z0-9_.-]/g, "-")}`,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          fileId: result.public_id,
          name: result.original_filename ?? fileName,
          webViewLink: result.secure_url,
          publicUrl: result.secure_url,
        });
      }
    );

    upload.end(buffer);
  });
}
