import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs/promises";
import { CustomError } from "../../shared/error/customError";
import { STATUS_CODES } from "../../shared/constants/statusCodes";

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const upload = multer({
  dest: "uploads/", 
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg","application/pdf","application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new CustomError(STATUS_CODES.BAD_REQUEST,"Invalid file type. Only JPEG, PNG are allowed."));
    }
  },
});


const uploadToCloudinary = async (filePath: string, folder: string) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
  });
  await fs.unlink(filePath);
  return result;
};

export { upload, uploadToCloudinary, cloudinary };
